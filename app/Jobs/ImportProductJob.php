<?php

namespace App\Jobs;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;
use Carbon\Carbon;
use Throwable;

class ImportProductJob implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $timeout = 120; // 2 minutes per job
    public $tries = 3;

    protected $item;

    /**
     * Create a new job instance.
     */
    public function __construct(array $item)
    {
        $this->item = $item;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Increase memory limit for image processing within the job
        ini_set('memory_limit', '2048M');
        
        $item = $this->item;

        DB::transaction(function () use ($item) {
            // 1. Brand
            $brand = null;
            if (!empty($item['brand_uid'])) {
                $brand = Brand::updateOrCreate(
                    ['uid' => $item['brand_uid']],
                    ['name' => $item['brand_name']]
                );
            }

            // 2. Category
            $category = null;
            if (!empty($item['category_path'])) {
                $pathParts = explode('/', $item['category_path']);
                $parentId = null;
                foreach ($pathParts as $part) {
                    $cat = Category::updateOrCreate(
                        ['name' => $part, 'parent_id' => $parentId],
                        ['name' => $part]
                    );
                    $parentId = $cat->id;
                    $category = $cat;
                }
            }

            // 3. Product
            $existingProduct = Product::where('uid', $item['uid'])->first();
            
            $mainImageUrl = null;
            if (!empty($item['image_main'])) {
                // Get new image URL (will skip download if exists)
                $mainImageUrl = $this->downloadAndConvertImage($item['image_main'], $this->extractFileName($item['image_main']));
                
                // Logic to delete old image ONLY if it's different from the new one
                if ($existingProduct && $existingProduct->image_main && $existingProduct->image_main !== $mainImageUrl) {
                    $this->deleteImage($existingProduct->image_main);
                }
            } elseif ($existingProduct) {
                $mainImageUrl = $existingProduct->image_main; 
            }

            $product = Product::updateOrCreate(
                ['uid' => $item['uid']],
                [
                    'brand_id' => $brand?->id,
                    'category_id' => $category?->id,
                    'code' => $item['code'] ?? null,
                    'sku' => $item['sku'] ?? null,
                    'name' => $item['name'] ?? 'Unnamed Product',
                    'slug' => $item['slug'] ?? null,
                    'url' => $item['url'] ?? null,
                    'barcode' => ($item['barcode'] ?? null) ?: ($item['barcodes'][0] ?? null),
                    'tnved' => $item['tnved'] ?? null,
                    'created_at_source' => !empty($item['created_at_date_time']) ? Carbon::createFromFormat('d.m.Y H:i:s', $item['created_at_date_time']) : null,
                    'novelty' => $item['novelty'] ?? false,
                    'hit' => $item['hit'] ?? false,
                    'marked' => $item['marked'] ?? false,
                    'liquidation' => $item['liquidation'] ?? false,
                    'for_marketplaces' => $item['for_marketplaces'] ?? false,
                    'description' => $item['description'] ?? null,
                    'description_html' => $item['description_html'] ?? null,
                    'short_description' => $item['short_description'] ?? null,
                    'image_main' => $mainImageUrl,
                    'price' => $price = rand(1000, 50000),
                    'old_price' => rand(0, 1) ? $price + rand(500, 10000) : null,
                    'stock' => rand(0, 50),
                    'group_code' => $item['group_code'] ?? null,
                    'group_name' => $item['group_name'] ?? null,
                ]
            );

            // 4. Parameters
            if (isset($item['parameters'])) {
                $product->parameters()->delete();
                foreach ($item['parameters'] as $param) {
                    $product->parameters()->create([
                        'name' => $param['name'],
                        'value' => (string) $param['value'],
                    ]);
                }
            }

            // 5. Additional Images
            if (isset($item['additional_images'])) {
                // We need a list of new URLs to know what to keep
                $newAdditionalUrls = [];
                foreach ($item['additional_images'] as $imgUrl) {
                    $newAdditionalUrls[] = $this->downloadAndConvertImage($imgUrl, $this->extractFileName($imgUrl));
                }
                
                // Check old additional images
                if ($existingProduct) {
                    foreach ($existingProduct->additionalImages as $oldImg) {
                        // Only delete if it's NOT in the new list
                        if (!in_array($oldImg->url, $newAdditionalUrls)) {
                            $this->deleteImage($oldImg->url);
                        }
                    }
                }
                
                // Re-create relations
                $product->additionalImages()->delete();
                foreach ($newAdditionalUrls as $localUrl) {
                    if ($localUrl) {
                        $product->additionalImages()->create([
                            'url' => $localUrl,
                        ]);
                    }
                }
            }
        });
        
        // Garbage collection logic not strictly necessary in job unless handling many items, 
        // but explicit unset is good practice.
        unset($item);
    }

    /**
     * Delete image and its thumbnail from storage
     */
    private function deleteImage($url)
    {
        if (!$url) return;
        
        $path = str_replace('/storage/', 'public/', parse_url($url, PHP_URL_PATH));
        
        // Delete main image
        if (Storage::exists($path)) {
            Storage::delete($path);
        }
        
        // Delete thumbnail
        $info = pathinfo($path);
        $thumbPath = $info['dirname'] . '/' . $info['filename'] . '_thumb.' . $info['extension'];
        
        if (Storage::exists($thumbPath)) {
            Storage::delete($thumbPath);
        }
        
        // Also check for legacy JPGs just in case
        $legacyJpg = $info['dirname'] . '/' . $info['filename'] . '.jpg';
        if (Storage::exists($legacyJpg)) {
            Storage::delete($legacyJpg);
        }
    }

    /**
     * Download and optimize image (convert to WebP with compression and resizing)
     */
    private function downloadAndConvertImage($imageUrl, $fileName)
    {
        try {
            // Skip if it's a GIF or video
            $extension = strtolower(pathinfo(parse_url($imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION));
            if (in_array($extension, ['gif', 'mp4', 'webm', 'avi', 'mov'])) {
                return $imageUrl;
            }

            // Determine deterministic filename using MD5 of the source URL
            $urlHash = md5($imageUrl);
            $baseName = pathinfo($fileName, PATHINFO_FILENAME);
            $safeBaseName = substr($baseName, 0, 50); 
            
            $webpFileName = $safeBaseName . '_' . $urlHash . '.webp';
            $storagePath = 'public/images/products/' . $webpFileName;
            
            // Check if file already exists
            if (Storage::exists($storagePath)) {
                return Storage::url(str_replace('public/', '', $storagePath));
            }

            // Download image
            $response = Http::get($imageUrl);
            if ($response->failed()) {
                return $imageUrl;
            }

            $imageData = $response->body();
            
            // Create Image Manager with GD driver
            $manager = new ImageManager(new Driver());
            
            // Read image
            $image = $manager->read($imageData);
            
            // 1. Generate Main Image (WebP, max width 1200px)
            $mainImage = clone $image;
            if ($mainImage->width() > 1200) {
                $mainImage->scale(width: 1200);
            }
            $webpData = $mainImage->toWebp(80);
            
            // Save main image to storage
            Storage::put($storagePath, $webpData);

            // 2. Generate Thumbnail (WebP, max width 400px)
            $thumbImage = clone $image;
            if ($thumbImage->width() > 400) {
                $thumbImage->scale(width: 400);
            }
            $thumbWebpData = $thumbImage->toWebp(80);

            // Generate filename for thumbnail
            $thumbFileName = $safeBaseName . '_' . $urlHash . '_thumb.webp';
            $thumbStoragePath = 'public/images/products/' . $thumbFileName;

            // Save thumbnail to storage
            Storage::put($thumbStoragePath, $thumbWebpData);
            
            // Return public URL of the main image
            return Storage::url(str_replace('public/', '', $storagePath));
            
        } catch (\Exception $e) {
            // Log error but generally return original URL or null
             \Log::warning("Error processing image {$imageUrl}: " . $e->getMessage());
            return $imageUrl;
        }
    }

    /**
     * Extract filename from URL
     */
    private function extractFileName($url)
    {
        $path = parse_url($url, PHP_URL_PATH);
        return basename($path) ?: 'image_' . uniqid();
    }
}

<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductParameter;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class ImportProductsCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-products';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import products from external JSON API';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Create images directory if it doesn't exist
        Storage::makeDirectory('public/images/products');
        $url = 'https://customers.sex-opt.ru/api/public/export/646?auth_token=kqQKCZA73oORObUK3ApLy7xKJ7FYnYajFRekGsqp';

        $this->info("Fetching data from {$url}...");

        $response = Http::get($url);

        if ($response->failed()) {
            $this->error("Failed to fetch data.");
            return 1;
        }

        $data = $response->json();
        $count = count($data);

        $this->info("Found {$count} products. Starting import...");
        $this->info("Images will be downloaded and optimized to JPEG format (GIFs and videos will be skipped)...");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($data as $item) {
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
                        'image_main' => !empty($item['image_main']) ? $this->downloadAndConvertImage($item['image_main'], $this->extractFileName($item['image_main'])) : null,
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
                    $product->additionalImages()->delete();
                    foreach ($item['additional_images'] as $imgUrl) {
                        $localImageUrl = $this->downloadAndConvertImage($imgUrl, $this->extractFileName($imgUrl));
                        $product->additionalImages()->create([
                            'url' => $localImageUrl,
                        ]);
                    }
                }
            });

            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Import completed successfully!");

        return 0;
    }

    /**
     * Download and optimize image (convert to JPEG with compression)
     * 
     * @param string $imageUrl
     * @param string $fileName
     * @return string|null Local path to converted image or null on failure
     */
    private function downloadAndConvertImage($imageUrl, $fileName)
    {
        try {
            // Skip if it's a GIF or video
            $extension = strtolower(pathinfo(parse_url($imageUrl, PHP_URL_PATH), PATHINFO_EXTENSION));
            if (in_array($extension, ['gif', 'mp4', 'webm', 'avi', 'mov'])) {
                $this->warn("Skipping {$extension} file: {$imageUrl}");
                return $imageUrl; // Return original URL for GIFs/videos
            }

            // Download image
            $response = Http::get($imageUrl);
            if ($response->failed()) {
                $this->warn("Failed to download image: {$imageUrl}");
                return $imageUrl; // Return original URL on download failure
            }

            $imageData = $response->body();
            
            // Create Image Manager with GD driver
            $manager = new ImageManager(new Driver());
            
            // Read image
            $image = $manager->read($imageData);
            
            // Convert to JPEG with quality 85
            $jpegData = $image->toJpeg(85);
            
            // Generate unique filename
            $jpegFileName = pathinfo($fileName, PATHINFO_FILENAME) . '_' . uniqid() . '.jpg';
            $storagePath = 'public/images/products/' . $jpegFileName;
            
            // Save to storage
            Storage::put($storagePath, $jpegData);
            
            // Return public URL
            return Storage::url(str_replace('public/', '', $storagePath));
            
        } catch (\Exception $e) {
            $this->warn("Error processing image {$imageUrl}: " . $e->getMessage());
            return $imageUrl; // Return original URL on error
        }
    }

    /**
     * Extract filename from URL
     * 
     * @param string $url
     * @return string
     */
    private function extractFileName($url)
    {
        $path = parse_url($url, PHP_URL_PATH);
        return basename($path) ?: 'image_' . uniqid();
    }
}

<?php

namespace App\Console\Commands;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class ImportProductsXmlCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-products-xml';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import products from external XML feed (upsert, no prices)';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $url = 'https://customers.sex-opt.ru/api/public/export/651?auth_token=kqQKCZA73oORObUK3ApLy7xKJ7FYnYajFRekGsqp';

        $this->info("Fetching XML data from API...");

        $response = Http::timeout(120)->get($url);

        if ($response->failed()) {
            $this->error("Failed to fetch data.");
            return 1;
        }

        $xmlString = $response->body();
        $xml = simplexml_load_string($xmlString);

        if ($xml === false) {
            $this->error("Failed to parse XML.");
            return 1;
        }

        $items = $xml->items->item ?? [];
        $count = count($items);

        $this->info("Found {$count} products. Importing...");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($items as $item) {
            $this->importProduct($item);
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("Import completed successfully!");

        return 0;
    }

    /**
     * Import a single product from XML item
     */
    private function importProduct(\SimpleXMLElement $item): void
    {
        // 1. Brand (outside transaction to avoid race conditions)
        $brand = null;
        $brandUid = (string) ($item->brand_uid ?? '');
        $brandName = (string) ($item->brand_name ?? '');
        
        if (!empty($brandUid)) {
            try {
                $brand = Brand::firstOrCreate(
                    ['uid' => $brandUid],
                    ['name' => $brandName]
                );
            } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                $brand = Brand::where('uid', $brandUid)->first();
            }
        }

        // 2. Category (outside transaction to avoid race conditions)
        $category = null;
        $categoryPath = (string) ($item->category_path ?? '');
        
        if (!empty($categoryPath)) {
            $pathParts = explode('/', $categoryPath);
            $parentId = null;
            foreach ($pathParts as $part) {
                try {
                    $cat = Category::firstOrCreate(
                        ['name' => $part, 'parent_id' => $parentId]
                    );
                } catch (\Illuminate\Database\UniqueConstraintViolationException $e) {
                    $cat = Category::where('name', $part)->where('parent_id', $parentId)->first();
                }
                if ($cat) {
                    $parentId = $cat->id;
                    $category = $cat;
                }
            }
        }

        $uid = (string) $item->uid;

        DB::transaction(function () use ($item, $brand, $category, $uid) {

            // Get barcode from single or first from list
            $barcode = (string) ($item->barcode ?? '');
            if (empty($barcode) && isset($item->barcodes->barcode[0])) {
                $barcode = (string) $item->barcodes->barcode[0];
            }

            // Parse created_at_date_time
            $createdAtSource = null;
            $createdAtString = (string) ($item->created_at_date_time ?? '');
            if (!empty($createdAtString)) {
                try {
                    $createdAtSource = Carbon::createFromFormat('d.m.Y H:i:s', $createdAtString);
                } catch (\Exception $e) {
                    // Skip if parsing fails
                }
            }

            // Parse boolean fields (Да/Нет to true/false)
            $novelty = $this->parseBool($item->novelty ?? '');
            $hit = $this->parseBool($item->hit ?? '');
            $marked = $this->parseBool($item->marked ?? '');
            $liquidation = $this->parseBool($item->liquidation ?? '');
            $forMarketplaces = $this->parseBool($item->for_marketplaces ?? '');

            $productData = [
                'brand_id' => $brand?->id,
                'category_id' => $category?->id,
                'code' => (string) ($item->code ?? '') ?: null,
                'sku' => (string) ($item->sku ?? '') ?: null,
                'name' => (string) ($item->name ?? '') ?: 'Unnamed Product',
                'slug' => (string) ($item->slug ?? '') ?: null,
                'url' => (string) ($item->url ?? '') ?: null,
                'barcode' => $barcode ?: null,
                'tnved' => (string) ($item->tnved ?? '') ?: null,
                'created_at_source' => $createdAtSource,
                'novelty' => $novelty,
                'hit' => $hit,
                'marked' => $marked,
                'liquidation' => $liquidation,
                'for_marketplaces' => $forMarketplaces,
                'description' => (string) ($item->description ?? '') ?: null,
                'description_html' => (string) ($item->description_html ?? '') ?: null,
                'short_description' => (string) ($item->short_description ?? '') ?: null,
                'image_main' => (string) ($item->image_main ?? '') ?: null,
                'group_code' => (string) ($item->group_code ?? '') ?: null,
                'group_name' => (string) ($item->group_name ?? '') ?: null,
            ];

            $product = Product::updateOrCreate(
                ['uid' => $uid],
                $productData
            );

            // 4. Parameters
            if (isset($item->parameters->parameter)) {
                $product->parameters()->delete();
                foreach ($item->parameters->parameter as $param) {
                    $name = (string) $param['name'];
                    $value = (string) $param;
                    $product->parameters()->create([
                        'name' => $name,
                        'value' => $value,
                    ]);
                }
            }

            // 5. Additional Images
            if (isset($item->additional_images->additional_image)) {
                $product->additionalImages()->delete();
                foreach ($item->additional_images->additional_image as $imgUrl) {
                    $url = (string) $imgUrl;
                    if ($url) {
                        $product->additionalImages()->create([
                            'url' => $url,
                        ]);
                    }
                }
            }
        });
    }

    /**
     * Parse Russian boolean (Да/Нет) to PHP boolean
     */
    private function parseBool($value): bool
    {
        $value = (string) $value;
        return mb_strtolower($value) === 'да';
    }
}

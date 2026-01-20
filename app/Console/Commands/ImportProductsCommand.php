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
                        'image_main' => $item['image_main'] ?? null,
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
                        $product->additionalImages()->create([
                            'url' => $imgUrl,
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
}

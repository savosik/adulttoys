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
        // Increase memory limit just in case
        ini_set('memory_limit', '512M');

        $url = 'https://customers.sex-opt.ru/api/public/export/646?auth_token=kqQKCZA73oORObUK3ApLy7xKJ7FYnYajFRekGsqp';

        $this->info("Fetching data from {$url}...");

        $response = Http::get($url);

        if ($response->failed()) {
            $this->error("Failed to fetch data.");
            return 1;
        }

        $data = $response->json();
        $count = count($data);

        $this->info("Found {$count} products. Dispatching jobs to 'imports' queue...");

        $bar = $this->output->createProgressBar($count);
        $bar->start();

        foreach ($data as $item) {
            \App\Jobs\ImportProductJob::dispatch($item)->onQueue('imports');
            $bar->advance();
        }

        $bar->finish();
        $this->newLine();
        $this->info("All jobs dispatched successfully! Run 'php artisan queue:work --queue=imports' to process them.");

        return 0;
    }
}

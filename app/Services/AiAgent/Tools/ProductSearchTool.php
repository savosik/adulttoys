<?php

namespace App\Services\AiAgent\Tools;

use NeuronAI\Tools\Tool;
use NeuronAI\Tools\ToolProperty;
use NeuronAI\Tools\PropertyType;
use App\Models\Product;

class ProductSearchTool extends Tool
{
    use ProductSearchHelper;

    public function __construct()
    {
        parent::__construct(
            name: 'product_search',
            description: 'Search for products in the catalog based on keywords. Use this to find products when the user asks for suggestions or specific items.'
        );
        
        $this->addProperty(
            new ToolProperty(
                name: 'query',
                type: PropertyType::STRING,
                description: 'The search query or keywords to find products (e.g. "red shoes", "iphone")',
                required: true
            )
        );
    }

    public function __invoke(string $query): string
    {
        // Search products using Scout
        $products = Product::search($query)->take(5)->get();

        if ($products->isEmpty()) {
            return "No products found for '{$query}'.";
        }

        return $products->map(function ($product) {
            return $this->formatProductData($product, [
               'image' => $product->image, // Keeping image if it exists
            ]);
        })->toJson();
    }
}

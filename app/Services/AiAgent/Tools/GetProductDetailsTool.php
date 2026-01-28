<?php

namespace App\Services\AiAgent\Tools;

use App\Models\Product;
use NeuronAI\Tools\PropertyType;
use NeuronAI\Tools\Tool;
use NeuronAI\Tools\ToolProperty;

class GetProductDetailsTool extends Tool
{
    use ProductSearchHelper;

    public function __construct()
    {
        parent::__construct(
            name: 'get_product_details',
            description: 'Get detailed information about a product: price, stock, brand, category, etc. Use this when the user asks for specific details about a product.'
        );

        $this->addProperty(
            new ToolProperty(
                name: 'product_id',
                type: PropertyType::NUMBER,
                description: 'The ID of the product to get details for.',
                required: true
            )
        );
    }

    public function __invoke(int $product_id): string
    {
        $product = Product::query()
            ->with([
                'category:id,name',
                'brand:id,name',
            ])
            // ->where('is_active', true) 
            ->find($product_id);

        if (! $product) {
            return json_encode([
                'error' => 'Product not found',
            ], JSON_UNESCAPED_UNICODE);
        }

        $data = $this->formatProductData($product, [
            // Add any other specific details here if needed
        ]);

        return json_encode($data, JSON_UNESCAPED_UNICODE);
    }
}

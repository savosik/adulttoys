<?php

namespace App\Services\AiAgent\Tools;

use App\Models\Product;

trait ProductSearchHelper
{
    /**
     * Find product by any identifier (id, sku, code, or name).
     * Returns the product or null if not found.
     */
    protected function findProductByIdentifier(?int $product_id = null, ?string $sku = null, ?string $code = null, ?string $name = null): ?Product
    {
        $query = Product::query()
            ->with([
                'category:id,name',
                'brand:id,name',
            ])
            // ->where('is_active', true) // Assuming standard active check, or remove if not applicable
            ;

        if ($product_id) {
            $query->where('id', $product_id);
        } elseif ($sku) {
            // Search by exact match or partial match (for SKUs)
            $query->where(function ($q) use ($sku) {
                $q->where('sku', $sku)
                    ->orWhere('sku', 'like', "%{$sku}%")
                    ->orWhere('code', $sku)
                    ->orWhere('code', 'like', "%{$sku}%");
            });
        } elseif ($code) {
            $query->where(function ($q) use ($code) {
                $q->where('code', $code)
                    ->orWhere('code', 'like', "%{$code}%")
                    ->orWhere('sku', $code)
                    ->orWhere('sku', 'like', "%{$code}%");
            });
        } elseif ($name) {
            $query->where('name', 'like', "%{$name}%");
        } else {
            return null;
        }

        return $query->first();
    }

    /**
     * Format product data for response.
     */
    protected function formatProductData(Product $product, array $additionalFields = []): array
    {
        // Simple price handling (add sale_price logic if column exists)
        $price = (float) $product->price;
        $stock = (int) $product->stock;

        return array_merge([
            'id' => $product->id,
            'name' => $product->name,
            'sku' => $product->sku,
            'code' => $product->code,
            'price' => $price,
            'stock' => $stock,
            'in_stock' => $stock > 0,
            'category' => $product->category?->name,
            'brand' => $product->brand?->name,
            'is_stm' => (bool)$product->is_stm,
            'key_benefits' => $product->key_benefits,
        ], $additionalFields);
    }
}

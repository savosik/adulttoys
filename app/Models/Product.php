<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use Searchable;
    protected $guarded = [];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($product) {
            if (!$product->slug) {
                $product->slug = Str::slug($product->name);
            }
        });

        static::saving(function ($product) {
            if ($product->brand_id) {
                $brand = $product->relationLoaded('brand') ? $product->brand : $product->brand()->first();
                if ($brand && in_array($brand->name, config('stm.brands', []))) {
                    $product->is_stm = true;
                } else {
                    $product->is_stm = false;
                }
            } else {
                $product->is_stm = false;
            }
        });
    }

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected $casts = [
        'novelty' => 'boolean',
        'hit' => 'boolean',
        'marked' => 'boolean',
        'liquidation' => 'boolean',
        'for_marketplaces' => 'boolean',
        'created_at_source' => 'datetime',
        'key_benefits' => 'array',
        'is_stm' => 'boolean',
    ];

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function parameters()
    {
        return $this->hasMany(ProductParameter::class);
    }

    public function additionalImages()
    {
        return $this->hasMany(ProductImage::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }

    public function toSearchableArray(): array
    {
        $array = [
            'id' => (int) $this->id,
            'name' => $this->name,
            'sku' => $this->sku,
            'description' => $this->description,
            'meta_title' => $this->meta_title,
            'meta_description' => $this->meta_description,
            'brand' => $this->brand?->name,
            'category' => $this->category?->name,
            'category_id' => (int) $this->category_id,
            'price' => (float) $this->price,
            'stock' => (int) $this->stock,
            'in_stock' => $this->stock > 0,
            'hit' => (bool) $this->hit,
            'novelty' => (bool) $this->novelty,
            'is_stm' => (bool) $this->is_stm,
            'created_at' => (int) $this->created_at?->timestamp,
        ];

        // Add transliterated versions for better search (RU <-> EN)
        $array['name_translit'] = \App\Helpers\SearchHelper::transliterate($this->name);
        $array['name_cyrillic'] = \App\Helpers\SearchHelper::transliterateToCyrillic($this->name);
        $array['name_layout'] = \App\Helpers\SearchHelper::convertLayout($this->name);
        
        return $array;
    }
}

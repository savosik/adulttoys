<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Product extends Model
{
    use Searchable;
    protected $guarded = [];

    protected $casts = [
        'novelty' => 'boolean',
        'hit' => 'boolean',
        'marked' => 'boolean',
        'liquidation' => 'boolean',
        'for_marketplaces' => 'boolean',
        'created_at_source' => 'datetime',
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
            'brand' => $this->brand?->name,
            'category' => $this->category?->name,
            'category_id' => (int) $this->category_id,
            'price' => (float) $this->price,
            'stock' => (int) $this->stock,
            'in_stock' => $this->stock > 0,
            'hit' => (bool) $this->hit,
            'novelty' => (bool) $this->novelty,
            'created_at' => (int) $this->created_at?->timestamp,
        ];

        // Add transliterated versions for better search (RU <-> EN)
        $array['name_translit'] = \App\Helpers\SearchHelper::transliterate($this->name);
        $array['name_cyrillic'] = \App\Helpers\SearchHelper::transliterateToCyrillic($this->name);
        $array['name_layout'] = \App\Helpers\SearchHelper::convertLayout($this->name);
        
        return $array;
    }
}

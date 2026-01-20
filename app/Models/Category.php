<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class Category extends Model
{
    use Searchable;
    protected $guarded = [];

    protected $appends = ['icon_url'];

    public function getIconUrlAttribute()
    {
        return $this->icon ? asset('storage/' . $this->icon) : null;
    }

    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id');
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function toSearchableArray(): array
    {
        return [
            'id' => (int) $this->id,
            'name' => $this->name,
            'icon_url' => $this->icon_url,
            'name_translit' => \App\Helpers\SearchHelper::transliterate($this->name),
            'name_cyrillic' => \App\Helpers\SearchHelper::transliterateToCyrillic($this->name),
            'name_layout' => \App\Helpers\SearchHelper::convertLayout($this->name),
        ];
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    protected $fillable = [
        'status',
        'delivery_method',
        'payment_method',
        'delivery_cost',
        'total_amount',
        'customer_name',
        'customer_phone',
        'delivery_data',
        'comment',
    ];

    protected $casts = [
        'delivery_data' => 'array',
        'delivery_cost' => 'decimal:2',
        'total_amount' => 'decimal:2',
    ];

    public function items(): HasMany
    {
        return $this->hasMany(OrderItem::class);
    }
}

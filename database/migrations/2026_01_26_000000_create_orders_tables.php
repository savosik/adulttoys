<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('status')->default('new'); // new, processing, completed, cancelled
            $table->string('delivery_method'); // pickup, courier, post
            $table->string('payment_method')->default('on_receipt');
            $table->decimal('delivery_cost', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            $table->string('customer_name');
            $table->string('customer_phone');
            $table->json('delivery_data')->nullable(); // Address, postal code, etc.
            $table->text('comment')->nullable();
            $table->timestamps();
        });

        Schema::create('order_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('order_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained();
            $table->integer('quantity');
            $table->decimal('price', 10, 2); // Price at the time of purchase
            $table->string('product_name'); // Store name in case product is deleted/renamed
            $table->text('options')->nullable(); // For future use (size, color, etc.)
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
        Schema::dropIfExists('orders');
    }
};

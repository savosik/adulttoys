<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('uid')->unique();
            $table->foreignId('brand_id')->nullable()->constrained()->onDelete('set null');
            $table->foreignId('category_id')->nullable()->constrained()->onDelete('set null');
            $table->string('code')->nullable();
            $table->string('sku')->nullable();
            $table->string('name');
            $table->string('slug')->nullable();
            $table->string('url')->nullable();
            $table->string('barcode')->nullable();
            $table->string('tnved')->nullable();
            $table->dateTime('created_at_source')->nullable();
            $table->boolean('novelty')->default(false);
            $table->boolean('hit')->default(false);
            $table->boolean('marked')->default(false);
            $table->boolean('liquidation')->default(false);
            $table->boolean('for_marketplaces')->default(false);
            $table->text('description')->nullable();
            $table->text('description_html')->nullable();
            $table->text('short_description')->nullable();
            $table->string('image_main')->nullable();
            $table->decimal('price', 12, 2)->nullable();
            $table->decimal('old_price', 12, 2)->nullable();
            $table->integer('stock')->default(0);
            $table->string('group_code')->nullable();
            $table->string('group_name')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};

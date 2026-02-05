<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CategoryIconController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/sitemap.xml', [SitemapController::class, 'index']);
Route::get('/', [CatalogController::class, 'index'])->name('catalog');
Route::get('/category/{category:slug}', [CatalogController::class, 'index'])->name('category.show');
Route::post('/order', [\App\Http\Controllers\OrderController::class, 'store'])->name('order.store');
Route::get('/brand/{brand:slug}', [CatalogController::class, 'brandIndex'])->name('brand.show');

Route::get('/about', function () {
    return Inertia::render('About', [
        'faqs' => \App\Models\Faq::orderBy('sort_order')->get()
    ]);
})->name('about');

Route::get('/search/suggestions', [CatalogController::class, 'suggestions'])->name('search.suggestions');
Route::get('/product/{product:slug}', [CatalogController::class, 'show'])->name('product.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/favorites', [CatalogController::class, 'favorites'])->name('favorites');
Route::get('/cart', [CatalogController::class, 'cart'])->name('cart');

Route::post('/api/category/set-icon', [CategoryIconController::class, 'setIcon'])->name('category.set-icon');
Route::post('/categories/reorder', [\App\Http\Controllers\CategoryController::class, 'reorder'])->name('categories.reorder');
Route::post('/categories/toggle-hidden', [\App\Http\Controllers\CategoryController::class, 'toggleHidden'])->name('categories.toggle-hidden');

Route::post('/chat/message', [\App\Http\Controllers\ChatController::class, 'sendMessage']);
Route::get('/chat/history/{chatId}', [\App\Http\Controllers\ChatController::class, 'getHistory']);
Route::get('/chat', function () {
    return inertia('Chat');
})->name('chat');

Route::get('/api/products/{product}/benefits', [\App\Http\Controllers\ProductBenefitsController::class, 'show'])->name('products.benefits');
Route::post('/api/products/{product}/reviews/generate', [\App\Http\Controllers\ProductReviewController::class, 'generate'])->name('products.reviews.generate');
Route::post('/api/products/{product}/description/enhance', [\App\Http\Controllers\ProductDescriptionController::class, 'enhance'])->name('products.description.enhance');
Route::post('/api/categories/{category}/description/generate', [\App\Http\Controllers\CategoryDescriptionController::class, 'generate'])->name('categories.description.generate');

Route::post('/api/user/currency', [\App\Http\Controllers\Api\UserController::class, 'updateCurrency'])->middleware(['auth', 'verified']);

<?php

use App\Http\Controllers\CatalogController;
use App\Http\Controllers\CategoryIconController;
use App\Http\Controllers\SitemapController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/sitemap.xml', [SitemapController::class, 'index']);
Route::get('/', [CatalogController::class, 'index'])->name('catalog');
Route::get('/category/{category:slug}', [CatalogController::class, 'index'])->name('category.show');
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

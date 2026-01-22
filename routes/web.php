<?php

use App\Http\Controllers\CatalogController;
use App\Models\Faq;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [CatalogController::class, 'index'])->name('catalog');

Route::get('/about', function () {
    return Inertia::render('About', [
        'faqs' => \App\Models\Faq::orderBy('sort_order')->get()
    ]);
})->name('about');

Route::get('/search/suggestions', [CatalogController::class, 'suggestions'])->name('search.suggestions');
Route::get('/product/{product}', [CatalogController::class, 'show'])->name('product.show');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->name('dashboard');

Route::get('/favorites', [CatalogController::class, 'favorites'])->name('favorites');
Route::get('/cart', [CatalogController::class, 'cart'])->name('cart');

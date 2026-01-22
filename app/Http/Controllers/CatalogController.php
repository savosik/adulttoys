<?php

namespace App\Http\Controllers;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index(Request $request, Category $category = null)
    {
        $search = $request->query('search');
        
        // Use category from route if provided, otherwise from query
        $categoryModel = $category ?: ($request->category 
            ? Category::where('id', $request->category)->orWhere('slug', $request->category)->first()
            : null);
            
        if ($search) {
            $queryBuilder = Product::search($search)
                ->query(fn($q) => $q->with(['brand', 'category', 'additionalImages', 'parameters'])
                    ->withCount('reviews')
                    ->withAvg('reviews', 'rating'));
        } else {
            $queryBuilder = Product::query()
                ->with(['brand', 'category', 'additionalImages', 'parameters'])
                ->withCount('reviews')
                ->withAvg('reviews', 'rating');
        }
    
        $products = $queryBuilder
            ->when($search, fn($q) => $q->where('in_stock', true))
            ->when(!$search, fn($q) => $q->where('stock', '>', 0))
            ->when($categoryModel, function ($query, $category) use ($request, $search) {
                if ($search) {
                    // Search is global, ignore category filter
                    return;
                }
                
                // Regular Eloquent filtering
                if ($request->sub_category) {
                    $subCategoryIds = is_array($request->sub_category) 
                        ? $request->sub_category 
                        : explode(',', $request->sub_category);
                    
                    $query->whereIn('category_id', $subCategoryIds);
                    return;
                }

                $categoryIds = Category::where('id', $category->id)
                    ->orWhere('parent_id', $category->id)
                    ->pluck('id');
                
                $subCategoryIds = Category::whereIn('parent_id', $categoryIds)->pluck('id');
                $allIds = $categoryIds->merge($subCategoryIds)->unique();
                
                $query->whereIn('category_id', $allIds);
            })
            ->when($request->sort, function ($query, $sort) {
                switch ($sort) {
                    case 'price_asc': $query->orderBy('price', 'asc'); break;
                    case 'price_desc': $query->orderBy('price', 'desc'); break;
                    case 'stock_desc': $query->orderBy('stock', 'desc'); break;
                    case 'name_asc': $query->orderBy('name', 'asc'); break;
                    case 'name_desc': $query->orderBy('name', 'desc'); break;
                    case 'hit': $query->orderBy('hit', 'desc'); break;
                    case 'novelty': $query->orderBy('novelty', 'desc'); break;
                    case 'latest': $query->orderBy('created_at', 'desc'); break;
                    default: $query->orderBy('price', 'desc'); break;
                }
            }, function ($query) use ($search) {
                if (!$search) $query->orderBy('price', 'desc');
            })
            ->paginate(12)
            ->withQueryString();

        $brands = Brand::withCount('products')
            ->limit(10)
            ->get();

        $subCategories = [];
        if ($categoryModel) {
            $subCategories = Category::where('parent_id', $categoryModel->id)
                ->withCount('products')
                ->get();
        }

        return Inertia::render('Catalog', [
            'products' => $products,
            'subCategories' => $subCategories,
            'brands' => $brands,
            'filters' => array_merge(
                $request->only(['sub_category', 'brand', 'search', 'sort']),
                ['category' => $categoryModel?->slug]
            ),
        ]);
    }

    public function show(Request $request, Product $product)
    {
        $product->load(['brand', 'category', 'additionalImages', 'parameters', 'reviews']);
        $product->loadCount('reviews');
        $product->reviews_avg_rating = $product->reviews()->avg('rating');

        return Inertia::render('ProductDetail', [
            'product' => $product,
            'filters' => $request->only(['category', 'sub_category', 'brand', 'search', 'sort']),
        ]);
    }

    public function suggestions(Request $request)
    {
        $query = $request->query('q');

        if (empty($query)) {
            return response()->json([
                'products' => [],
                'categories' => [],
            ]);
        }

        $products = Product::search($query)
            ->query(fn($q) => $q->withCount('reviews')->withAvg('reviews', 'rating'))
            ->where('in_stock', true)
            ->take(8)
            ->get()
            ->map(fn($p) => [
                'id' => $p->id,
                'name' => $p->name,
                'price' => $p->price,
                'image' => $p->image_main,
                'url' => route('product.show', $p->slug),
                'reviews_count' => $p->reviews_count,
                'reviews_avg_rating' => $p->reviews_avg_rating,
            ]);

        $categories = Category::search($query)
            ->take(4)
            ->get()
            ->map(fn($c) => [
                'id' => $c->id,
                'name' => $c->name,
                'icon_url' => $c->icon_url,
                'url' => route('category.show', $c->slug),
            ]);

        return response()->json([
            'products' => $products,
            'categories' => $categories,
        ]);
    }

    public function favorites()
    {
        return Inertia::render('Favorites');
    }

    public function cart()
    {
        return Inertia::render('Cart');
    }
}

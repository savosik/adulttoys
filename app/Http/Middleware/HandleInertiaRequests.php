<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that's loaded on the first page visit.
     *
     * @see https://inertiajs.com/server-side-setup#root-template
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determines the current asset version.
     *
     * @see https://inertiajs.com/asset-versioning
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @see https://inertiajs.com/shared-data
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'appName' => config('app.name'),
            'meta' => [
                'title' => null,
                'description' => null,
                'og_image' => null,
            ],
            'flash' => [
                'message' => fn () => $request->session()->get('message')
            ],
            'categories' => \App\Models\Category::whereNull('parent_id')
                ->with(['children' => function($query) {
                    $query->withCount('products')
                        ->with(['children' => function($q) {
                            $q->withCount('products');
                        }]);
                }])
                ->withCount('products')
                ->orderBy('name', 'asc')
                ->get()
                ->map(fn($c) => [
                    'id' => $c->id,
                    'slug' => $c->slug,
                    'name' => $c->name,
                    'icon' => $c->icon,
                    'icon_url' => $c->icon_url,
                    'products_count' => $c->products_count,
                    'children' => $c->children->map(fn($child) => [
                        'id' => $child->id,
                        'slug' => $child->slug,
                        'name' => $child->name,
                        'icon' => $child->icon,
                        'icon_url' => $child->icon_url,
                        'products_count' => $child->products_count,
                        'children' => $child->children->map(fn($subChild) => [
                            'id' => $subChild->id,
                            'slug' => $subChild->slug,
                            'name' => $subChild->name,
                            'icon' => $subChild->icon,
                            'icon_url' => $subChild->icon_url,
                            'products_count' => $subChild->products_count,
                        ]),
                    ]),
                ]),
            'brands' => \App\Models\Brand::withCount('products')
                ->orderBy('name', 'asc')
                ->get()
                ->map(fn($b) => [
                    'id' => $b->id,
                    'name' => $b->name,
                    'slug' => $b->slug,
                    'products_count' => $b->products_count,
                ]),
            'filters' => [
                'search' => $request->query('search'),
                'category' => $request->query('category'),
            ],
        ]);
    }
}

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
            'flash' => [
                'message' => fn () => $request->session()->get('message')
            ],
            'categories' => \App\Models\Category::whereNotNull('parent_id')
                ->whereIn('parent_id', \App\Models\Category::whereNull('parent_id')->select('id'))
                ->withCount('products')
                ->get()
                ->map(fn($c) => [
                    'id' => $c->id,
                    'name' => $c->name,
                    'icon' => $c->icon,
                    'icon_url' => $c->icon_url,
                    'products_count' => $c->products_count,
                ]),
            'filters' => [
                'search' => $request->query('search'),
                'category' => $request->query('category'),
            ],
        ]);
    }
}

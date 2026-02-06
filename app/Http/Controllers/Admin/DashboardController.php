<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Show the admin dashboard.
     */
    public function index()
    {
        $stats = [
            'users_count' => User::count(),
            'products_count' => Product::count(),
            'orders_count' => class_exists(Order::class) ? Order::count() : 0,
        ];

        return Inertia::render('Dashboard', [
            'stats' => $stats,
        ]);
    }
}

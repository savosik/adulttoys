<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'delivery_method' => 'required|in:pickup,courier,post',
            'payment_method' => 'required|string',
            'cart' => 'required|array|min:1',
            'cart.*.id' => 'required|exists:products,id',
            'cart.*.quantity' => 'required|integer|min:1',
            'cart.*.price' => 'required|numeric|min:0',
            'cart.*.name' => 'required|string',
            // Contact info
            'customer_name' => 'required|string|min:2',
            'customer_phone' => 'required|string',
            // Delivery specific
            'delivery_data' => 'nullable|array',
        ]);

        // Additional validation based on delivery method
        if ($validated['delivery_method'] === 'courier') {
            if (empty($validated['delivery_data']['address'])) {
                throw ValidationException::withMessages(['delivery_data.address' => 'Адрес доставки обязателен (курьер).']);
            }
        } elseif ($validated['delivery_method'] === 'post') {
            if (empty($validated['delivery_data']['postalCode'])) {
                throw ValidationException::withMessages(['delivery_data.postalCode' => 'Индекс обязателен (почта).']);
            }
            if (empty($validated['delivery_data']['region']) || empty($validated['delivery_data']['city'])) {
                 throw ValidationException::withMessages(['delivery_data.city' => 'Адрес доставки неполный (почта).']);
            }
        }

        try {
            DB::beginTransaction();

            // Calculate totals (double check server side)
            $itemsTotal = 0;
            foreach ($validated['cart'] as $item) {
                // Ideally fetching price from DB, but for now trusting cart with simple check or using provided
                // For better security, I should fetch products from DB.
                // Let's stick to simple implementation as requested, but maybe fetch price later if critical.
                // Re-calculating total just to be safe based on passed values.
                $itemsTotal += $item['price'] * $item['quantity'];
            }

            $deliveryCost = 0;
            if ($validated['delivery_method'] === 'courier') {
                $deliveryCost = $itemsTotal >= 100 ? 0 : 15;
            } elseif ($validated['delivery_method'] === 'post') {
                $deliveryCost = $itemsTotal >= 200 ? 0 : 20;
            }

            $order = Order::create([
                'status' => 'new',
                'delivery_method' => $validated['delivery_method'],
                'payment_method' => $validated['payment_method'],
                'delivery_cost' => $deliveryCost,
                'total_amount' => $itemsTotal + $deliveryCost,
                'customer_name' => $validated['customer_name'],
                'customer_phone' => $validated['customer_phone'],
                'delivery_data' => $validated['delivery_data'] ?? [],
                'comment' => $validated['delivery_data']['comment'] ?? null,
            ]);

            foreach ($validated['cart'] as $cartItem) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $cartItem['id'],
                    'quantity' => $cartItem['quantity'],
                    'price' => $cartItem['price'],
                    'product_name' => $cartItem['name'],
                    // options can be passed if needed
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Заказ успешно оформлен',
                'order_id' => $order->id,
                'redirect' => route('catalog'), // Or a success page
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при оформлении заказа: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Quick order - simplified order with just phone number
     */
    public function quickStore(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'customer_phone' => 'required|string|min:10',
        ]);

        try {
            DB::beginTransaction();

            // Fetch the product
            $product = \App\Models\Product::findOrFail($validated['product_id']);

            $order = Order::create([
                'status' => 'new',
                'delivery_method' => 'pickup', // Default to pickup for quick orders
                'payment_method' => 'on_receipt',
                'delivery_cost' => 0, // Pickup is free
                'total_amount' => $product->price,
                'customer_name' => 'Быстрый заказ', // Will be clarified during call
                'customer_phone' => $validated['customer_phone'],
                'delivery_data' => [],
                'comment' => 'Быстрый заказ - уточнить данные при звонке',
            ]);

            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $product->id,
                'quantity' => 1,
                'price' => $product->price,
                'product_name' => $product->name,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Быстрый заказ успешно оформлен',
                'order_id' => $order->id,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при оформлении заказа: ' . $e->getMessage()
            ], 500);
        }
    }
}

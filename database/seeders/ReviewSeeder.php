<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

use App\Models\Product;
use App\Models\Review;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $products = Product::all();
        $names = ['Александр', 'Мария', 'Дмитрий', 'Елена', 'Иван', 'Ольга', 'Сергей', 'Анна'];
        $reviews = [
            'Отличный товар! Качество на высоте.',
            'Очень довольна покупкой! Рекомендую всем.',
            'Всё пришло вовремя, упаковка целая. Товар соответствует описанию.',
            'Немного задержали доставку, но сам товар отличный.',
            'Лучшее соотношение цены и качества. Пользуюсь уже месяц, нареканий нет.',
            'Приятно удивлена качеством материалов. Очень удобно в использовании.',
            'Купил по совету друга, не пожалел. Всё работает как надо.',
            'Хороший дизайн и функционал. Стоит своих денег.',
        ];

        foreach ($products as $product) {
            // Add 1-5 reviews for each product
            $numReviews = rand(1, 5);
            for ($i = 0; $i < $numReviews; $i++) {
                Review::create([
                    'product_id' => $product->id,
                    'user_name' => $names[array_rand($names)],
                    'rating' => rand(4, 5), // Let's make products look good
                    'text' => $reviews[array_rand($reviews)],
                ]);
            }
        }
    }
}

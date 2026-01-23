<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;

class CategoryDescriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('ru_RU');

        $categories = Category::all();

        foreach ($categories as $category) {
            // Generate a structured HTML SEO text
            $html = '';
            
            // Intro
            $html .= '<h2>' . $category->name . ' в Минске</h2>';
            $html .= '<p>' . $faker->realText(300) . '</p>';

            // Benefits list
            $html .= '<h3>Преимущества покупки</h3>';
            $html .= '<ul>';
            for ($i = 0; $i < 5; $i++) {
                $html .= '<li>' . $faker->realText(50) . '</li>';
            }
            $html .= '</ul>';

            // Detailed description
            $html .= '<h3>Как выбрать?</h3>';
            $html .= '<p>' . $faker->realText(800) . '</p>';
            $html .= '<p>' . $faker->realText(600) . '</p>';

            // Conclusion
            $html .= '<h3>Почему выбирают нас?</h3>';
            $html .= '<p>' . $faker->realText(400) . '</p>';

            $category->update(['description' => $html]);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use NeuronAI\Agent;
use NeuronAI\Providers\OpenAILike;
use Illuminate\Support\Facades\Log;

class CategoryDescriptionController extends Controller
{
    public function generate(Category $category)
    {
        // Optional: Check if description is already valid/long enough to skip re-generation
        // For now, we assume the frontend decides when to call this (e.g. fish detection)

        try {
            $provider = new OpenAILike(
                baseUri: config('neuron.provider.openrouter.base_uri'),
                key: config('neuron.provider.openrouter.key'),
                model: 'google/gemini-2.0-flash-001'
            );

            $agent = new Agent();
            $agent->setAiProvider($provider);

            // Fetch a few product names to give context to the AI
            $sampleProducts = $category->products()
                ->inRandomOrder()
                ->take(5)
                ->pluck('name')
                ->implode(', ');

            $prompt = "
                You are a professional SEO copywriter for an adult toy store.
                Task: Write a compelling, SEO-friendly category description for the category: '{$category->name}'.
                
                Context:
                - Category Name: {$category->name}
                - Sample Products in this category: {$sampleProducts}
                
                Goals:
                1. Content: Explain what this category offers, who it is for, and why it's a great choice.
                2. Tone: Professional, informative, trustworthy, and safe. Avoid overly explicit or vulgar language; keep it classy and sales-oriented.
                3. Structure: Use simple HTML tags. Start with an <h2> title (different from category name, e.g., 'Benefits of ...'). Use <p> paragraphs. Maybe a <ul> list of benefits if appropriate.
                4. Length: Approx 150-250 words.
                5. Language: Russian.
                
                Output: Return ONLY the HTML content. Do NOT wrap in ```html code blocks.
            ";

            $response = $agent->chat(
                new \NeuronAI\Chat\Messages\UserMessage($prompt)
            );
            
            $responseText = $response->getContent();
            // Clean up code blocks if present
            $generatedDescription = preg_replace('/^```html\s*|\s*```$/', '', trim($responseText));

            // Sanity check
            if (strlen($generatedDescription) > 20) {
                // Determine if we should also update meta_description
                // Simple strategy: take first 150 chars of text content
                $metaDesc = mb_substr(strip_tags($generatedDescription), 0, 155) . '...';
                
                $category->update([
                    'description' => $generatedDescription,
                    'meta_description' => $category->meta_description ?: $metaDesc // Only update meta if empty? or always? Let's safeguard existing meta.
                ]);
                
                return response()->json([
                    'description' => $generatedDescription
                ]);
            }
            
            return response()->json(['message' => 'Failed to generate valid content'], 500);

        } catch (\Exception $e) {
            Log::error('Error generating category description', [
                'category_id' => $category->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json(['message' => 'Server error during generation'], 500);
        }
    }
}

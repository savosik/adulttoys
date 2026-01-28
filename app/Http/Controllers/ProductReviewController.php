<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use NeuronAI\Agent;
use NeuronAI\Providers\OpenAILike;
use Illuminate\Support\Facades\Log;

class ProductReviewController extends Controller
{
    public function generate(Product $product)
    {
        // 1. Check if reviews exist (race condition check)
        if ($product->reviews()->exists()) {
            return response()->json(['reviews' => $product->reviews]);
        }

        try {
            // Instantiate OpenRouter provider with stable Gemini model
            $provider = new OpenAILike(
                baseUri: config('neuron.provider.openrouter.base_uri'),
                key: config('neuron.provider.openrouter.key'),
                model: 'google/gemini-2.0-flash-001' 
            );

            $agent = new Agent();
            $agent->setAiProvider($provider);

            // 2. Ensure benefits exist or use description
            $benefitsText = '';
            if (!empty($product->key_benefits)) {
                $benefitsText = implode(', ', $product->key_benefits);
            } else {
                 // Fallback or generate benefits on the fly (simplified for now: use name/desc)
                 $benefitsText = "implied from description";
            }

            // Random number of reviews between 2 and 6
            $reviewCount = rand(2, 6);

            $prompt = "
                You are an expert copywriter for an adult toy store.
                Task: Generate {$reviewCount} realistic customer reviews for the following product in Russian language.
                
                Product: {$product->name}
                Description: " . strip_tags($product->description ?? '') . "
                Key Benefits to Highlight: {$benefitsText}
                
                Constraints:
                1. Target Audience: Analyze the product to determine the likely buyer (gender, age, experience level) and adopt their persona.
                2. User Names: Assign realistic Russian names (e.g., Ivan, Elena, Andrey, Marina) appropriate for the likely gender of the buyer.
                3. Ratings: Must be 4 or 5 stars integers.
                4. Content: Highlight the key benefits naturally. Text should vary in length (some short, some detailed).
                5. Output: Return ONLY a raw JSON object with a key 'reviews' containing an array of objects. Each object must have: 'user_name', 'rating' (int), 'text' (string).
                
                No markdown, no code blocks, just JSON.
            ";

            $response = $agent->chat(
                new \NeuronAI\Chat\Messages\UserMessage($prompt)
            );
            
            $responseText = $response->getContent();
            $cleanResponse = preg_replace('/^```json\s*|\s*```$/', '', trim($responseText));
            
            $data = json_decode($cleanResponse, true);

            if (json_last_error() === JSON_ERROR_NONE && isset($data['reviews']) && is_array($data['reviews'])) {
                $reviewsData = array_slice($data['reviews'], 0, $reviewCount);
                
                $savedReviews = [];
                foreach ($reviewsData as $reviewData) {
                    $savedReviews[] = $product->reviews()->create([
                        'user_name' => $reviewData['user_name'],
                        'rating' => max(4, min(5, (int)$reviewData['rating'])), // Ensure 4-5
                        'text' => $reviewData['text']
                    ]);
                }

                return response()->json(['reviews' => $savedReviews]);
            }

            Log::error('Failed to parse AI reviews response', [
                'product_id' => $product->id,
                'response' => $responseText
            ]);

            return response()->json(['reviews' => []], 500);

        } catch (\Exception $e) {
            Log::error('Error generating product reviews', [
                'product_id' => $product->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json(['reviews' => []], 500);
        }
    }
}

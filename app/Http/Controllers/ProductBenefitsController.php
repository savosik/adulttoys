<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use NeuronAI\Agent;
use NeuronAI\Providers\OpenAILike;
use Illuminate\Support\Facades\Log;

class ProductBenefitsController extends Controller
{
    public function show(Product $product)
    {
        if (!empty($product->key_benefits)) {
            return response()->json(['benefits' => $product->key_benefits]);
        }

        try {
            // Instantiate OpenRouter provider with Gemini Flash model
            $provider = new OpenAILike(
                baseUri: config('neuron.provider.openrouter.base_uri'),
                key: config('neuron.provider.openrouter.key'),
                model: 'google/gemini-2.0-flash-001' 
            );

            $agent = new Agent();
            $agent->setAiProvider($provider);

            $prompt = "
                Analyze the following product and extract 4 key benefits (very short phrases, 2-4 words each) in Russian language.
                Return ONLY a raw JSON object (no markdown formatting, no code blocks) with a single key 'benefits' containing an array of 4 strings.
                
                Product: {$product->name}
                Description: " . strip_tags($product->description ?? 'No description available');

            $response = $agent->chat(
                new \NeuronAI\Chat\Messages\UserMessage($prompt)
            );
            
            $responseText = $response->getContent();
            
            // Clean up response if it contains markdown code blocks
            $cleanResponse = preg_replace('/^```json\s*|\s*```$/', '', trim($responseText));
            
            $data = json_decode($cleanResponse, true);

            if (json_last_error() === JSON_ERROR_NONE && isset($data['benefits']) && is_array($data['benefits'])) {
                $benefits = array_slice($data['benefits'], 0, 4);
                
                $product->update([
                    'key_benefits' => $benefits
                ]);

                return response()->json(['benefits' => $benefits]);
            }

            Log::error('Failed to parse AI response for product benefits', [
                'product_id' => $product->id,
                'response' => $responseText
            ]);

            return response()->json(['benefits' => []], 500);

        } catch (\Exception $e) {
            Log::error('Error generating product benefits', [
                'product_id' => $product->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json(['benefits' => []], 500);
        }
    }
}

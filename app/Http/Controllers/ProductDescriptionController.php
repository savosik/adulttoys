<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use NeuronAI\Agent;
use NeuronAI\Providers\OpenAILike;
use Illuminate\Support\Facades\Log;

class ProductDescriptionController extends Controller
{
    public function enhance(Product $product)
    {
        // 1. Check if enhanced description already exists
        if (!empty($product->description_enhanced)) {
            return response()->json([
                'description_enhanced' => $product->description_enhanced
            ]);
        }

        try {
            $provider = new OpenAILike(
                baseUri: config('neuron.provider.openrouter.base_uri'),
                key: config('neuron.provider.openrouter.key'),
                model: 'google/gemini-2.0-flash-001'
            );

            $agent = new Agent();
            $agent->setAiProvider($provider);

            $benefitsText = !empty($product->key_benefits) ? implode(', ', $product->key_benefits) : '';

            $prompt = "
                You are a world-class copywriter and sales expert using NLP (Neuro-Linguistic Programming) techniques.
                Task: Rewrite the product description for an adult toy store to maximize conversion.
                
                Product: {$product->name}
                Original Description: " . strip_tags($product->description ?? '') . "
                Key Benefits: {$benefitsText}
                
                Goals:
                1. Motivation: Use persuasive language to create an immediate desire to buy.
                2. Confidence: Eliminate doubts. Use phrases that imply this is the best/only choice.
                3. FOMO/Urgency: subtly imply that this experience is unique and waiting.
                4. Structure: Use HTML formatting. Use <strong> for emphasis. Use <ul><li> for features. Split into readable paragraphs <p>.
                5. Tone: Professional, exciting, respectful, but highly persuasive.
                6. Language: Russian.
                
                Output: Return ONLY the HTML content (starting with <p> or similar tag). Do not include ```html blocks.
            ";

            $response = $agent->chat(
                new \NeuronAI\Chat\Messages\UserMessage($prompt)
            );
            
            $responseText = $response->getContent();
            // Clean up code blocks if present
            $enhancedDescription = preg_replace('/^```html\s*|\s*```$/', '', trim($responseText));

            // Sanity check: ensure it has some HTML or at least length
            if (strlen($enhancedDescription) > 10) {
                $product->update([
                    'description_enhanced' => $enhancedDescription
                ]);
                
                return response()->json([
                    'description_enhanced' => $enhancedDescription
                ]);
            }
            
            return response()->json(['description_enhanced' => null], 500);

        } catch (\Exception $e) {
            Log::error('Error enhancing product description', [
                'product_id' => $product->id,
                'error' => $e->getMessage()
            ]);
            
            return response()->json(['description_enhanced' => null], 500);
        }
    }
}

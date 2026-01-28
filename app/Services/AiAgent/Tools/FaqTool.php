<?php

namespace App\Services\AiAgent\Tools;

use NeuronAI\Tools\Tool;
use NeuronAI\Tools\ToolProperty;
use NeuronAI\Tools\PropertyType;
use App\Models\Faq;

class FaqTool extends Tool
{
    public function __construct()
    {
        parent::__construct(
            name: 'faq_search',
            description: 'Search for Frequently Asked Questions. Use this to find answers about shipping, returns, warranty, etc.'
        );

        $this->addProperty(
            new ToolProperty(
                name: 'query',
                type: PropertyType::STRING,
                description: 'The topic or question to search for in FAQ',
                required: true
            )
        );
    }

    public function __invoke(string $query): string
    {
        // Simple search logic using like query or Scout if Configured
        // Assuming Faq might not use Scout, we use basic 'like' or check if model has Searchable trait
        
        // If Faq uses Scout:
        // $faqs = Faq::search($query)->take(3)->get();
        
        // If not, standard Eloquent:
        $faqs = Faq::where('question', 'like', "%{$query}%")
                    ->orWhere('answer', 'like', "%{$query}%")
                    ->take(3)
                    ->get();

        if ($faqs->isEmpty()) {
            return "No FAQ found for '{$query}'.";
        }

        return $faqs->map(function ($faq) {
            return [
                'question' => $faq->question,
                'answer' => $faq->answer,
            ];
        })->toJson();
    }
}

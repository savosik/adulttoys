<?php

namespace App\Services\AiAgent;

use App\Models\Chat;
use App\Models\ChatMessage;
use App\Services\AiAgent\Tools\FaqTool;
use App\Services\AiAgent\Tools\GetProductDetailsTool;
use App\Services\AiAgent\Tools\ProductSearchTool;
use NeuronAI\Agent;
use NeuronAI\Chat\History\InMemoryChatHistory;
use NeuronAI\Chat\Messages\AssistantMessage;
use NeuronAI\Chat\Messages\UserMessage;
use NeuronAI\Laravel\AIProviderManager;

class AgentService
{
    public function __construct(protected AIProviderManager $providerManager)
    {
    }

    public function respond(Chat $chat, string $userMessageContent): string
    {
        // 1. Resolve Provider
        // using 'openrouter' explicitly or from config
        $providerName = config('neuron.ai.default', 'openrouter');
        $provider = $this->providerManager->driver($providerName);

        // 2. Prepare Tools
        $tools = [
            new ProductSearchTool(),
            new FaqTool(),
        ];

        // 3. Prepare Agent
        $agent = new Agent();
        $agent->withInstructions("You are a helpful and knowledgeable e-commerce assistant for 'Adult Toys'. 
            Your goal is to help users find products, answer questions, and provide a great shopping experience.
            
            GUIDELINES:
            - Use `product_search` logic to find products.
            - Use `faq_search` for questions about policies, shipping, etc.
            - Be polite, concise, and professional. 
            - If you find products, mention their key benefits or price.
            - If you cannot find an answer, admit it.");
        
        // 4. Load History
        $history = new InMemoryChatHistory();
        
        // Load last 10 messages for context (excluding the one we just added if any)
        // We assume the caller handles saving the current user message to DB *before* or *after* calling this.
        // If *before*, we should exclude it or include it?
        // Agent::chat() takes the *next* message.
        // So we populate history with *previous* messages.
        
        $previousMessages = $chat->messages()
            ->latest()
            ->take(10)
            ->get()
            ->reverse();

        foreach ($previousMessages as $msg) {
            if ($msg->role === 'user') {
                $history->addMessage(new UserMessage($msg->content));
            } elseif ($msg->role === 'assistant') {
                $history->addMessage(new AssistantMessage($msg->content));
            }
        }
        
        $agent->withChatHistory($history);

        // 5. Configure Agent
        $agent->setAiProvider($provider);
        $agent->addTool($tools);

        // 6. Chat
        $response = $agent->chat(new UserMessage($userMessageContent));
        
        return $response->getContent();
    }

    public function stream(Chat $chat, string $userMessageContent): \Generator
    {
        // 1. Resolve Provider
        $providerName = config('neuron.ai.default', 'openrouter');
        $provider = $this->providerManager->driver($providerName);

        // 2. Prepare Tools
        $tools = [
            new ProductSearchTool(),
            new GetProductDetailsTool(), // Added detailed tool
            new FaqTool(),
        ];

        // 3. Prepare Agent
        $agent = new Agent();
        // Updated instructions based on reference project's UnifiedChatAgent
        $agent->withInstructions(<<<'PROMPT'
Ты AI-ассистент интернет-магазина для взрослых. Помогай пользователям найти товары и отвечай на вопросы.

ПРАВИЛА:
- Используй `product_search` для поиска товаров
- Используй `get_product_details` для деталей по ID
- Используй `faq_search` для вопросов о доставке/оплате
- Отвечай кратко и по делу
- Показывай цену и наличие товаров
PROMPT
        );
        
        // 4. Load History
        $history = new InMemoryChatHistory();
        
        $previousMessages = $chat->messages()
            ->latest()
            ->take(10)
            ->get()
            ->reverse();

        foreach ($previousMessages as $msg) {
            if ($msg->role === 'user') {
                $history->addMessage(new UserMessage($msg->content));
            } elseif ($msg->role === 'assistant') {
                $history->addMessage(new AssistantMessage($msg->content));
            }
        }
        
        $agent->withChatHistory($history);

        // 5. Configure Agent
        $agent->setAiProvider($provider);
        $agent->addTool($tools);

        // 6. Stream
        return $agent->stream(new UserMessage($userMessageContent));
    }
}

<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use App\Services\AiAgent\AgentService;
use App\Models\Chat;
use App\Events\MessageSent;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessAiResponse implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Chat $chat,
        public string $userMessageContent
    ) {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(AgentService $agentService): void
    {
        // 1. Create empty assistant message
        $message = $this->chat->messages()->create([
            'role' => 'assistant',
            'content' => '',
        ]);

        // Optional: Broadcast initial empty message so UI shows "Thinking..." or just shows the bubble
        // broadcast(new MessageSent($message)); 

        $finalContent = '';
        
        // 2. Stream
        $stream = $agentService->stream($this->chat, $this->userMessageContent);

        foreach ($stream as $chunk) {
            // Check if chunk is a string (text chunk) or object (ToolCall, etc)
            // NeuronAI stream usually yields strings for text
            if (is_string($chunk)) {
                $finalContent .= $chunk;
                broadcast(new \App\Events\MessageChunkSent(
                    $this->chat->id,
                    $message->id,
                    $chunk
                ));
            }
        }

        // 3. Update full content
        $message->update(['content' => $finalContent]);

        // 4. Broadcast completion event
        broadcast(new \App\Events\MessageComplete(
            $this->chat->id,
            $message->id
        ));
    }
}

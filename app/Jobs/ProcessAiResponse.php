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
        $responseContent = $agentService->respond($this->chat, $this->userMessageContent);

        $message = $this->chat->messages()->create([
            'role' => 'assistant',
            'content' => $responseContent,
        ]);

        broadcast(new MessageSent($message));
    }
}

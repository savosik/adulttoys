<?php

namespace App\Http\Controllers;

use App\Models\Chat;
use App\Models\ChatMessage;
use App\Events\MessageSent;
use App\Jobs\ProcessAiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ChatController extends Controller
{
    public function sendMessage(Request $request)
    {
        $validated = $request->validate([
            'message' => 'required|string',
            'chat_id' => 'nullable|exists:chats,id',
        ]);

        $user = Auth::user();

        if ($request->chat_id) {
            $chat = Chat::find($request->chat_id);
        } else {
            $chat = Chat::create([
                'user_id' => $user?->id,
                'session_id' => session()->getId(),
                'title' => substr($validated['message'], 0, 50),
            ]);
        }

        // Save User Message
        $message = $chat->messages()->create([
            'role' => 'user',
            'content' => $validated['message'],
        ]);

        // Broadcast User Message
        broadcast(new MessageSent($message))->toOthers();

        // Dispatch AI Job
        ProcessAiResponse::dispatch($chat, $message->content);

        return response()->json([
            'status' => 'ok', 
            'chat_id' => $chat->id,
            'message' => $message
        ]);
    }

    public function getHistory(Request $request, $chatId)
    {
         $chat = Chat::findOrFail($chatId);
         // Authorization check needed in real app
         
         return response()->json($chat->messages()->oldest()->get());
    }
}

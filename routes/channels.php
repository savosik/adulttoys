<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

// Chat channel - accessible to all users (including guests)
Broadcast::channel('chat.{chatId}', function ($user, $chatId) {
    // For now, allow all authenticated and guest users
    // TODO: Add proper authorization (check if user owns the chat)
    return true;
});

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\User; // Added for user relationship
use App\Models\ChatMessage; // Added for messages relationship

class Chat extends Model
{
    protected $fillable = ['user_id', 'session_id', 'title'];

    public function messages()
    {
        return $this->hasMany(ChatMessage::class);
    }
}

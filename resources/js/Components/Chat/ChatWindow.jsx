import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ChatWindow() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [chatId, setChatId] = useState(null);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);

    // Initial greeting
    useEffect(() => {
        const savedChatId = localStorage.getItem('chat_id');
        if (savedChatId) {
            setChatId(savedChatId);
            // Optionally fetch history
            loadHistory(savedChatId);
        } else {
            setMessages([
                { id: 'init', role: 'assistant', content: 'Привет! Я ваш ИИ-помощник. Чем могу помочь?' }
            ]);
        }

        const params = new URLSearchParams(window.location.search);
        const initialMsg = params.get('message');
        if (initialMsg) {
            setInput(initialMsg);
        }
    }, []);

    const loadHistory = async (id) => {
        try {
            const res = await axios.get(`/chat/history/${id}`);
            if (res.data.length > 0) {
                setMessages(res.data);
            } else {
                setMessages([
                    { id: 'init', role: 'assistant', content: 'Привет! Я ваш ИИ-помощник. Чем могу помочь?' }
                ]);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    };

    // Listen to Echo
    useEffect(() => {
        if (!chatId) return;

        // Ensure we don't listen multiple times
        const channelName = `chat.${chatId}`;
        const channel = window.Echo.channel(channelName);

        console.log(`Listening to channel: ${channelName}`);

        channel.listen('MessageSent', (e) => {
            console.log('New message received via Echo:', e);

            setMessages(prev => {
                // Avoid duplication (e.g. if we optimistically added it)
                // Also check by ID.
                if (prev.find(m => m.id === e.id)) return prev;

                // If we have a temp message with same content (risky, but usually fine for user messages)
                // actually simpler to just replace temp message if we can track it.
                // For now, let's just append.
                return [...prev, e];
            });
        });

        return () => {
            console.log(`Leaving channel: ${channelName}`);
            window.Echo.leave(channelName);
        };
    }, [chatId]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isSending) return;

        const content = input;
        setInput('');
        setIsSending(true);

        try {
            // Optimistic Update
            // const tempId = 'temp-' + Date.now();
            // setMessages(prev => [...prev, { id: tempId, role: 'user', content }]);

            const response = await axios.post('/chat/message', {
                message: content,
                chat_id: chatId
            });

            if (response.data.chat_id) {
                if (response.data.chat_id != chatId) {
                    setChatId(response.data.chat_id);
                    localStorage.setItem('chat_id', response.data.chat_id);
                }
            }

            // Force update or let Echo handle it?
            // Since we broadcast user message too, Echo will catch it.
            // If we optimistically update, we might duplicate.
            // For lowest latency UX, proper way is to use a correlation ID.
            // But let's rely on immediate response.data.message push if provided, or echo.

            // Backend returns { message: ... }
            if (response.data.message) {
                setMessages(prev => {
                    if (prev.find(m => m.id === response.data.message.id)) return prev;
                    return [...prev, response.data.message];
                });
            }

        } catch (error) {
            console.error(error);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-10">
                        Start a conversation...
                    </div>
                )}

                {messages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] rounded-lg p-3 shadow-sm ${msg.role === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-white text-gray-800 border border-gray-200'
                            }`}>
                            <div className="whitespace-pre-wrap text-sm">{msg.content}</div>
                        </div>
                    </div>
                ))}

                {isSending && messages.length > 0 && messages[messages.length - 1].role === 'user' && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-500 rounded-lg p-3 text-xs italic">
                            Agent is typing...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            <div className="border-t p-4 bg-white rounded-b-lg">
                <form onSubmit={sendMessage} className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 rounded-full border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2"
                    />
                    <button
                        type="submit"
                        disabled={isSending}
                        className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

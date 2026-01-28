import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useChatStore } from '@/stores/chatStore';

export default function ChatWindow() {
    const [input, setInput] = useState('');
    const [chatId, setChatId] = useState(null);
    const messagesEndRef = useRef(null);

    // Zustand store state
    const messages = useChatStore((state) => (chatId ? state.messages[chatId] || [] : []));
    const streamingMessageId = useChatStore((state) => state.streamingMessageId);
    const streamingContent = useChatStore((state) => state.streamingContent);
    const processingChatId = useChatStore((state) => state.processingChatId);

    // Zustand store actions
    const { addMessage, setProcessing, setMessages, stopProcessing } = useChatStore();

    const isProcessing = processingChatId === chatId && !streamingMessageId;
    const isSending = !!streamingMessageId || isProcessing;

    // Initial greeting
    useEffect(() => {
        const savedChatId = localStorage.getItem('chat_id');
        if (savedChatId) {
            setChatId(savedChatId);
            loadHistory(savedChatId);
        } else {
            // Set initial chat without ID
            setChatId('init');
            setMessages('init', [
                { id: 'init', role: 'assistant', content: 'Привет! Я ваш ИИ-помощник. Чем могу помочь?' }
            ]);
        }

        const params = new URLSearchParams(window.location.search);
        const initialMsg = params.get('message');
        if (initialMsg) {
            setInput(initialMsg);
        }
    }, [setMessages]);

    const loadHistory = async (id) => {
        try {
            const res = await axios.get(`/chat/history/${id}`);
            if (res.data.length > 0) {
                setMessages(id, res.data);
            } else {
                setMessages(id, [
                    { id: 'init', role: 'assistant', content: 'Привет! Я ваш ИИ-помощник. Чем могу помочь?' }
                ]);
            }
        } catch (e) {
            console.error("Failed to load history", e);
        }
    };

    // Listen to Echo (Public Channel with correct event names)
    useEffect(() => {
        if (!chatId || chatId === 'init' || !window.Echo) return;

        const channelName = `chat.${chatId}`;
        console.log(`[Chat] Subscribing to channel: ${channelName}`);

        const channel = window.Echo.channel(channelName);

        const handleStreaming = (data) => {
            console.log('[Chat] Received message.streaming event:', data);
            const state = useChatStore.getState();

            if (data.message_id === state.streamingMessageId) {
                // Continue streaming
                state.appendStreamingChunk(data.chunk, chatId, data.message_id);
            } else {
                // Start new streaming
                state.startStreaming(data.message_id);
                state.appendStreamingChunk(data.chunk, chatId, data.message_id);
            }
        };

        const handleComplete = (data) => {
            console.log('[Chat] Received message.complete event:', data);

            // Fetch the full message from server for data integrity
            axios.get(`/chat/history/${chatId}`).then((response) => {
                const message = response.data.find((m) => m.id === data.message_id);
                const state = useChatStore.getState();

                if (message) {
                    state.completeStreaming(chatId, data.message_id, message.content);
                } else {
                    state.completeStreaming(chatId, data.message_id, '');
                }

                // Update all messages to ensure consistency
                setMessages(chatId, response.data);
            }).catch((error) => {
                console.error('[Chat] Error fetching messages after completion:', error);
                const state = useChatStore.getState();
                state.completeStreaming(chatId, data.message_id, '');
            });
        };

        channel
            .listen('.message.streaming', handleStreaming)
            .listen('.message.complete', handleComplete)
            .error((error) => {
                console.error('[Chat] Echo channel error:', error);
            });

        console.log('[Chat] Event listeners registered for:', channelName);

        return () => {
            console.log(`[Chat] Leaving channel: ${channelName}`);
            window.Echo.leave(channelName);
        };
    }, [chatId, setMessages]);

    // Auto-scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, streamingContent]);

    const sendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!input.trim() || isSending) return;

        const content = input;
        setInput('');

        try {
            // Optimistic user message
            const userMessage = {
                id: Date.now(),
                role: 'user',
                content,
                created_at: new Date().toISOString(),
            };

            const currentChatId = chatId === 'init' ? null : chatId;

            if (currentChatId) {
                addMessage(currentChatId, userMessage);
            }

            // Set processing state
            if (currentChatId) {
                setProcessing(currentChatId);
            }

            const response = await axios.post('/chat/message', {
                message: content,
                chat_id: currentChatId
            });

            if (response.data.chat_id) {
                const newChatId = response.data.chat_id;

                if (newChatId != currentChatId) {
                    setChatId(newChatId);
                    localStorage.setItem('chat_id', newChatId);
                    // Add message to new chat
                    addMessage(newChatId, userMessage);
                    setProcessing(newChatId);
                }
            }

        } catch (error) {
            console.error('[Chat] Error sending message:', error);
            stopProcessing();
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
                            <div className="whitespace-pre-wrap text-sm">
                                {streamingMessageId === msg.id ? streamingContent : msg.content}
                            </div>
                        </div>
                    </div>
                ))}

                {/* Thinking Indicator */}
                {isProcessing && !streamingMessageId && (
                    <div className="flex justify-start">
                        <div className="bg-gray-200 text-gray-500 rounded-lg p-3 text-xs italic">
                            Agent is thinking...
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
                        disabled={isSending}
                        className="flex-1 rounded-full border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 disabled:opacity-50"
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

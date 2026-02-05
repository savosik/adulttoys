import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useChatStore } from '@/stores/chatStore';

// Mic Icon
const MicIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="22" />
    </svg>
);
// Trash Icon
const TrashIcon = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M3 6h18" />
        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
    </svg>
);

export default function ChatWindow() {
    const [input, setInput] = useState('');
    const [chatId, setChatId] = useState(null);
    const messagesEndRef = useRef(null);
    const [isListening, setIsListening] = useState(false);
    const recognitionRef = useRef(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

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

    // Speech Recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'ru-RU';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(prev => prev ? `${prev} ${transcript}` : transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
    }, []);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return alert('Голосовой ввод не поддерживается');
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const clearChat = () => {
        setShowClearConfirm(true);
    };

    const confirmClear = () => {
        // Clear local storage
        localStorage.removeItem('chat_id');

        // Reset state
        setChatId('init');
        setMessages('init', [
            { id: 'init', role: 'assistant', content: 'Привет! Я ваш ИИ-помощник. Чем могу помочь?' }
        ]);

        setShowClearConfirm(false);
    };

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
        <div className="flex flex-col h-full bg-[#8EBCDA] sm:rounded-lg overflow-hidden shadow-sm">
            {/* Minimal Header */}
            <div className="bg-white py-2 px-4 flex items-center justify-between border-b border-gray-100 z-10 shrink-0 relative">
                {showClearConfirm && (
                    <div className="absolute inset-0 bg-white z-20 flex items-center justify-between px-4 animate-in fade-in duration-200">
                        <span className="text-sm font-medium text-gray-700">Очистить историю?</span>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowClearConfirm(false)}
                                className="px-3 py-1 text-xs font-medium text-gray-500 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={confirmClear}
                                className="px-3 py-1 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors shadow-sm"
                            >
                                Да, очистить
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex items-center">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold mr-3 shadow-sm text-sm">
                        AI
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-800 text-sm leading-tight">AI Assistant</h3>
                        <p className="text-xs text-blue-500 font-medium">online</p>
                    </div>
                </div>
                <button
                    onClick={clearChat}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all mr-8"
                    title="Очистить чат"
                >
                    <TrashIcon className="w-4 h-4" />
                    <span className="text-xs font-medium">Очистить</span>
                </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-2 py-1 sm:px-4 sm:py-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {messages.length === 0 && (
                    <div className="flex h-full items-center justify-center">
                        <div className="bg-black/10 text-white rounded-full px-4 py-1 text-sm backdrop-blur-sm">
                            Начните общение...
                        </div>
                    </div>
                )}

                {messages.map(msg => (
                    <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div
                            className={`max-w-[85%] sm:max-w-[75%] shadow-sm text-[15px] leading-relaxed relative break-words px-3 py-1.5 ${msg.role === 'user'
                                ? 'bg-[#EEFFDE] text-gray-900 rounded-2xl rounded-tr-sm'
                                : 'bg-white text-gray-900 rounded-2xl rounded-tl-sm'
                                }`}
                        >
                            <div className="whitespace-pre-wrap">
                                {streamingMessageId === msg.id ? streamingContent : msg.content}
                            </div>
                            {/* Time placeholder if needed, usually simplified */}
                        </div>
                    </div>
                ))}

                {/* Thinking Indicator */}
                {isProcessing && !streamingMessageId && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white text-gray-500 rounded-2xl rounded-tl-sm px-4 py-2 text-sm shadow-sm opacity-80">
                            печатает...
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-2 sm:px-4 sm:py-3 shrink-0">
                <form onSubmit={sendMessage} className="flex items-end gap-2 max-w-4xl mx-auto">
                    <div className="flex-1 bg-gray-100 rounded-2xl flex items-center px-4 py-2 relative">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Сообщение..."
                            disabled={isSending}
                            className="bg-transparent border-none outline-none focus:outline-none focus:ring-0 focus:ring-transparent focus:border-transparent text-gray-800 placeholder-gray-400 w-full p-0 pr-8 text-[15px]"
                        />
                        <button
                            type="button"
                            onClick={toggleVoiceInput}
                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening
                                ? 'bg-red-500 text-white animate-pulse'
                                : 'text-gray-400 hover:text-red-600 hover:bg-gray-200'
                                }`}
                        >
                            <MicIcon className="w-4 h-4" />
                        </button>
                    </div>
                    <button
                        type="submit"
                        disabled={isSending || !input.trim()}
                        className={`p-3 rounded-full shrink-0 transition-all duration-200 ${input.trim()
                            ? 'bg-blue-500 text-white hover:bg-blue-600 shadow-md transform hover:scale-105'
                            : 'bg-gray-100 text-gray-400'
                            }`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                            <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
}

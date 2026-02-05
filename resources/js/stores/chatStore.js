import { create } from 'zustand';

export const useChatStore = create((set, get) => ({
    messages: {}, // { chatId: [messages] }
    streamingMessageId: null,
    streamingContent: '',
    processingChatId: null, // Chat ID that is currently processing
    isOpen: false,
    draftMessage: '',

    openChat: () => set({ isOpen: true }),
    closeChat: () => set({ isOpen: false }),
    toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
    setDraftMessage: (message) => set({ draftMessage: message }),

    setMessages: (chatId, messages) => {
        set((state) => ({
            messages: { ...state.messages, [chatId]: messages },
        }));
    },

    addMessage: (chatId, message) => {
        set((state) => ({
            messages: {
                ...state.messages,
                [chatId]: [...(state.messages[chatId] || []), message],
            },
        }));
    },

    setProcessing: (chatId) => {
        set({
            processingChatId: chatId,
        });
    },

    stopProcessing: () => {
        set({
            processingChatId: null,
        });
    },

    startStreaming: (messageId) => {
        set({
            streamingMessageId: messageId,
            streamingContent: '',
            processingChatId: null, // Stop processing when streaming starts
        });
    },

    appendStreamingChunk: (chunk, chatId, messageId) => {
        set((state) => {
            const newContent = state.streamingContent + chunk;

            if (chatId && messageId) {
                const messages = state.messages[chatId] || [];

                // Check if message already exists
                const messageExists = messages.some(m => m.id === messageId);

                if (!messageExists) {
                    // Create new message in store
                    const newMessage = {
                        id: messageId,
                        role: 'assistant',
                        content: newContent,
                        created_at: new Date().toISOString(),
                    };

                    return {
                        streamingContent: newContent,
                        messages: {
                            ...state.messages,
                            [chatId]: [...messages, newMessage],
                        },
                    };
                } else {
                    // Update existing message
                    const updatedMessages = messages.map(msg =>
                        msg.id === messageId ? { ...msg, content: newContent } : msg
                    );

                    return {
                        streamingContent: newContent,
                        messages: {
                            ...state.messages,
                            [chatId]: updatedMessages,
                        },
                    };
                }
            }

            return {
                streamingContent: newContent,
            };
        });
    },

    completeStreaming: (chatId, messageId, content) => {
        set((state) => {
            const messages = state.messages[chatId] || [];
            const updatedMessages = messages.map((msg) =>
                msg.id === messageId ? { ...msg, content } : msg
            );

            return {
                messages: { ...state.messages, [chatId]: updatedMessages },
                streamingMessageId: null,
                streamingContent: '',
                processingChatId: null,
            };
        });
    },
}));

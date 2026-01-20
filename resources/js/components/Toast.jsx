import React, { useEffect, useState } from 'react';
import useStore from '@/store/useStore';

const Toast = () => {
    const [toast, setToast] = useState(null);

    useEffect(() => {
        // Subscribe to store changes
        const unsubscribe = useStore.subscribe((state, prevState) => {
            // Check if cart count increased
            const prevCartCount = prevState.getCartCount();
            const currentCartCount = state.getCartCount();
            
            if (currentCartCount > prevCartCount) {
                setToast({
                    type: 'cart',
                    message: 'Товар добавлен в корзину',
                    icon: '🛒'
                });
            }
            
            // Check if favorites changed
            const prevFavCount = prevState.getFavoritesCount();
            const currentFavCount = state.getFavoritesCount();
            
            if (currentFavCount > prevFavCount) {
                setToast({
                    type: 'favorite',
                    message: 'Добавлено в избранное',
                    icon: '❤️'
                });
            } else if (currentFavCount < prevFavCount) {
                setToast({
                    type: 'favorite',
                    message: 'Удалено из избранного',
                    icon: '💔'
                });
            }
            
            // Check if chat queue changed
            const prevChatCount = prevState.getChatQueueCount();
            const currentChatCount = state.getChatQueueCount();
            
            if (currentChatCount > prevChatCount) {
                setToast({
                    type: 'chat',
                    message: 'Товар добавлен в чат',
                    icon: '💬'
                });
            } else if (currentChatCount < prevChatCount) {
                setToast({
                    type: 'chat-remove',
                    message: 'Удалено из чата',
                    icon: '🚫'
                });
            }
        });

        return unsubscribe;
    }, []);

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 2500);

            return () => clearTimeout(timer);
        }
    }, [toast]);

    if (!toast) return null;

    return (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] pointer-events-none animate-in fade-in slide-in-from-top-2 duration-300">
            <div className={`px-4 py-3 rounded-xl shadow-2xl border flex items-center gap-3 ${
                toast.type === 'cart' 
                    ? 'bg-red-700 border-red-600 text-white' 
                    : toast.type === 'chat'
                    ? 'bg-gradient-to-br from-red-400 to-red-600 border-red-500 text-white'
                    : 'bg-white border-gray-200 text-gray-900'
            }`}>
                <span className="text-2xl">{toast.icon}</span>
                <span className="font-medium text-sm">{toast.message}</span>
            </div>
        </div>
    );
};

export default Toast;

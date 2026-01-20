import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            // Cart state
            cart: [],
            
            // Favorites state
            favorites: [],
            
            // Chat state
            chatQueue: [],
            
            // Cart actions
            addToCart: (product) => {
                const { cart } = get();
                const existingItem = cart.find(item => item.id === product.id);
                
                if (existingItem) {
                    // Increase quantity if already in cart
                    set({
                        cart: cart.map(item =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        )
                    });
                } else {
                    // Add new item to cart
                    set({
                        cart: [...cart, { ...product, quantity: 1 }]
                    });
                }
            },
            
            removeFromCart: (productId) => {
                set({
                    cart: get().cart.filter(item => item.id !== productId)
                });
            },
            
            updateCartQuantity: (productId, quantity) => {
                if (quantity <= 0) {
                    get().removeFromCart(productId);
                    return;
                }
                
                set({
                    cart: get().cart.map(item =>
                        item.id === productId
                            ? { ...item, quantity }
                            : item
                    )
                });
            },
            
            incrementCartQuantity: (productId) => {
                const item = get().cart.find(item => item.id === productId);
                if (item) {
                    get().updateCartQuantity(productId, item.quantity + 1);
                }
            },
            
            decrementCartQuantity: (productId) => {
                const item = get().cart.find(item => item.id === productId);
                if (item) {
                    get().updateCartQuantity(productId, item.quantity - 1);
                }
            },
            
            clearCart: () => {
                console.log('Clearing cart...');
                set({ cart: [] });
                console.log('Cart cleared:', get().cart);
            },
            
            getCartTotal: () => {
                return get().cart.reduce((total, item) => {
                    return total + (item.price * item.quantity);
                }, 0);
            },
            
            getCartCount: () => {
                return get().cart.reduce((count, item) => count + item.quantity, 0);
            },
            
            // Favorites actions
            addToFavorites: (product) => {
                const { favorites } = get();
                if (!favorites.find(item => item.id === product.id)) {
                    set({
                        favorites: [...favorites, product]
                    });
                }
            },
            
            removeFromFavorites: (productId) => {
                set({
                    favorites: get().favorites.filter(item => item.id !== productId)
                });
            },
            
            toggleFavorite: (product) => {
                const { favorites } = get();
                const exists = favorites.find(item => item.id === product.id);
                
                if (exists) {
                    get().removeFromFavorites(product.id);
                } else {
                    get().addToFavorites(product);
                }
            },
            
            isFavorite: (productId) => {
                return get().favorites.some(item => item.id === productId);
            },
            
            getFavoritesCount: () => {
                return get().favorites.length;
            },
            
            clearFavorites: () => {
                console.log('Clearing favorites...');
                set({ favorites: [] });
                console.log('Favorites cleared:', get().favorites);
                // Explicitly persist to storage if needed (Zustand persist middleware handles this, 
                // but let's ensure the action is correctly calling set)
            },
            
            // Chat actions
            addToChatQueue: (product) => {
                const { chatQueue } = get();
                if (!chatQueue.find(item => item.id === product.id)) {
                    set({
                        chatQueue: [...chatQueue, product]
                    });
                }
            },
            
            removeFromChatQueue: (productId) => {
                set({
                    chatQueue: get().chatQueue.filter(item => item.id !== productId)
                });
            },
            
            toggleChatQueue: (product) => {
                const { chatQueue } = get();
                const exists = chatQueue.find(item => item.id === product.id);
                
                if (exists) {
                    get().removeFromChatQueue(product.id);
                } else {
                    get().addToChatQueue(product);
                }
            },
            
            clearChatQueue: () => {
                set({ chatQueue: [] });
            },
            
            getChatQueueCount: () => {
                return get().chatQueue.length;
            }
        }),
        {
            name: 'ecom-storage', // localStorage key
            partialize: (state) => ({
                cart: state.cart,
                favorites: state.favorites,
                chatQueue: state.chatQueue
            })
        }
    )
);

export default useStore;

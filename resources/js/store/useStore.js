import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useStore = create(
    persist(
        (set, get) => ({
            // Cart state
            cart: [],

            // Delivery method state
            deliveryMethod: 'pickup', // pickup, courier, post

            // Courier delivery form data
            courierDelivery: {
                name: '',
                address: '',
                phone: '',
                mapLat: null,
                mapLng: null,
                comment: ''
            },

            // Courier delivery validation
            courierDeliveryErrors: {
                name: '',
                address: '',
                phone: ''
            },

            // Pickup delivery form data
            pickupDelivery: {
                name: '',
                phone: '',
                comment: ''
            },

            // Pickup validation
            pickupDeliveryErrors: {
                name: '',
                phone: ''
            },

            // Post delivery form data
            postDelivery: {
                name: '',
                postalCode: '',
                region: '',
                city: '',
                house: '',
                apartment: '',
                phone: '',
                comment: ''
            },

            // Post delivery validation
            postDeliveryErrors: {
                name: '',
                postalCode: '',
                region: '',
                city: '',
                house: '',
                apartment: '',
                phone: ''
            },

            // Favorites state
            favorites: [],

            // Chat state
            chatQueue: [],

            // Notification state
            notification: null,

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
            },

            // Notification actions
            showNotification: (message, type = 'success') => {
                set({
                    notification: {
                        message,
                        type,
                        id: Date.now()
                    }
                });
            },

            // Delivery actions
            setDeliveryMethod: (method) => {
                set({ deliveryMethod: method });
            },

            getDeliveryCost: () => {
                const { deliveryMethod } = get();
                const total = get().getCartTotal();

                switch (deliveryMethod) {
                    case 'pickup':
                        return 0;
                    case 'courier':
                        return total >= 100 ? 0 : 15;
                    case 'post':
                        return total >= 200 ? 0 : 20;
                    default:
                        return 0;
                }
            },

            getOrderTotal: () => {
                return get().getCartTotal() + get().getDeliveryCost();
            },

            // Courier delivery actions
            setCourierDeliveryData: (data) => {
                const newData = { ...get().courierDelivery, ...data };
                set({ courierDelivery: newData });

                // Validate changed fields
                const errors = { ...get().courierDeliveryErrors };

                if ('name' in data) {
                    if (!data.name || data.name.trim().length < 2) {
                        errors.name = 'Имя обязательно';
                    } else {
                        errors.name = '';
                    }
                }

                if ('address' in data) {
                    if (!data.address || data.address.trim().length < 10) {
                        errors.address = 'Адрес должен содержать минимум 10 символов';
                    } else {
                        errors.address = '';
                    }
                }

                if ('phone' in data) {
                    const phoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
                    if (!data.phone) {
                        errors.phone = 'Телефон обязателен для заполнения';
                    } else if (!phoneRegex.test(data.phone)) {
                        errors.phone = 'Формат: +375 (29) 123-45-67';
                    } else {
                        errors.phone = '';
                    }
                }

                set({ courierDeliveryErrors: errors });
            },

            validateCourierDelivery: () => {
                const { courierDelivery } = get();
                const errors = {};

                if (!courierDelivery.name || courierDelivery.name.trim().length < 2) {
                    errors.name = 'Имя обязательно';
                }

                if (!courierDelivery.address || courierDelivery.address.trim().length < 10) {
                    errors.address = 'Адрес должен содержать минимум 10 символов';
                }

                const phoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
                if (!courierDelivery.phone) {
                    errors.phone = 'Телефон обязателен для заполнения';
                } else if (!phoneRegex.test(courierDelivery.phone)) {
                    errors.phone = 'Формат: +375 (29) 123-45-67';
                }

                set({ courierDeliveryErrors: errors });
                return Object.keys(errors).length === 0;
            },

            clearCourierDeliveryData: () => {
                set({
                    courierDelivery: {
                        name: '',
                        address: '',
                        phone: '',
                        mapLat: null,
                        mapLng: null,
                        comment: ''
                    },
                    courierDeliveryErrors: {
                        name: '',
                        address: '',
                        phone: ''
                    }
                });
            },

            // Pickup delivery actions
            setPickupDeliveryData: (data) => {
                const newData = { ...get().pickupDelivery, ...data };
                set({ pickupDelivery: newData });

                const errors = { ...get().pickupDeliveryErrors };

                if ('name' in data) {
                    if (!data.name || data.name.trim().length < 2) {
                        errors.name = 'Имя обязательно';
                    } else {
                        errors.name = '';
                    }
                }

                if ('phone' in data) {
                    const phoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
                    if (!data.phone) {
                        errors.phone = 'Телефон обязателен';
                    } else if (!phoneRegex.test(data.phone)) {
                        errors.phone = 'Формат: +375 (29) 123-45-67';
                    } else {
                        errors.phone = '';
                    }
                }

                set({ pickupDeliveryErrors: errors });
            },

            validatePickupDelivery: () => {
                const { pickupDelivery } = get();
                const errors = {};

                if (!pickupDelivery.name || pickupDelivery.name.trim().length < 2) {
                    errors.name = 'Имя обязательно';
                }

                const phoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
                if (!pickupDelivery.phone) {
                    errors.phone = 'Телефон обязателен';
                } else if (!phoneRegex.test(pickupDelivery.phone)) {
                    errors.phone = 'Формат: +375 (29) 123-45-67';
                }

                set({ pickupDeliveryErrors: errors });
                return Object.keys(errors).length === 0;
            },

            clearPickupDeliveryData: () => {
                set({
                    pickupDelivery: { name: '', phone: '', comment: '' },
                    pickupDeliveryErrors: { name: '', phone: '' }
                });
            },

            // Post delivery actions
            setPostDeliveryData: (data) => {
                const newData = { ...get().postDelivery, ...data };
                set({ postDelivery: newData });

                // Validate changed fields
                const errors = { ...get().postDeliveryErrors };

                if ('name' in data) {
                    if (!data.name || data.name.trim().length < 2) {
                        errors.name = 'Имя обязательно';
                    } else {
                        errors.name = '';
                    }
                }

                if ('postalCode' in data) {
                    const postalCodeRegex = /^\d{6}$/;
                    if (!data.postalCode) {
                        errors.postalCode = 'Индекс обязателен';
                    } else if (!postalCodeRegex.test(data.postalCode)) {
                        errors.postalCode = 'Индекс должен содержать 6 цифр';
                    } else {
                        errors.postalCode = '';
                    }
                }

                if ('region' in data) {
                    if (!data.region || data.region.trim().length < 3) {
                        errors.region = 'Укажите район (минимум 3 символа)';
                    } else {
                        errors.region = '';
                    }
                }

                if ('city' in data) {
                    if (!data.city || data.city.trim().length < 2) {
                        errors.city = 'Укажите населенный пункт (минимум 2 символа)';
                    } else {
                        errors.city = '';
                    }
                }

                if ('house' in data) {
                    if (!data.house || data.house.trim().length === 0) {
                        errors.house = 'Укажите номер дома';
                    } else {
                        errors.house = '';
                    }
                }

                if ('apartment' in data) {
                    if (!data.apartment || data.apartment.trim().length === 0) {
                        errors.apartment = 'Укажите номер квартиры';
                    } else {
                        errors.apartment = '';
                    }
                }

                if ('phone' in data) {
                    const phoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
                    if (!data.phone) {
                        errors.phone = 'Телефон обязателен';
                    } else if (!phoneRegex.test(data.phone)) {
                        errors.phone = 'Формат: +375 (29) 123-45-67';
                    } else {
                        errors.phone = '';
                    }
                }

                set({ postDeliveryErrors: errors });
            },

            validatePostDelivery: () => {
                const { postDelivery } = get();
                const errors = {};

                if (!postDelivery.name || postDelivery.name.trim().length < 2) {
                    errors.name = 'Имя обязательно';
                }

                const postalCodeRegex = /^\d{6}$/;
                if (!postDelivery.postalCode) {
                    errors.postalCode = 'Индекс обязателен';
                } else if (!postalCodeRegex.test(postDelivery.postalCode)) {
                    errors.postalCode = 'Индекс должен содержать 6 цифр';
                }

                if (!postDelivery.region || postDelivery.region.trim().length < 3) {
                    errors.region = 'Укажите район (минимум 3 символа)';
                }

                if (!postDelivery.city || postDelivery.city.trim().length < 2) {
                    errors.city = 'Укажите населенный пункт (минимум 2 символа)';
                }

                if (!postDelivery.house || postDelivery.house.trim().length === 0) {
                    errors.house = 'Укажите номер дома';
                }

                if (!postDelivery.apartment || postDelivery.apartment.trim().length === 0) {
                    errors.apartment = 'Укажите номер квартиры';
                }

                const phoneRegex = /^\+375\s?\(?\d{2}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/;
                if (!postDelivery.phone) {
                    errors.phone = 'Телефон обязателен';
                } else if (!phoneRegex.test(postDelivery.phone)) {
                    errors.phone = 'Формат: +375 (29) 123-45-67';
                }

                set({ postDeliveryErrors: errors });
                return Object.keys(errors).length === 0;
            },

            clearPostDeliveryData: () => {
                set({
                    postDelivery: {
                        postalCode: '',
                        region: '',
                        city: '',
                        house: '',
                        apartment: '',
                        phone: '',
                        comment: ''
                    },
                    postDeliveryErrors: {
                        postalCode: '',
                        region: '',
                        city: '',
                        house: '',
                        apartment: '',
                        phone: ''
                    }
                });
            }
        }),
        {
            name: 'ecom-storage', // localStorage key
            partialize: (state) => ({
                cart: state.cart,
                favorites: state.favorites,
                chatQueue: state.chatQueue,
                deliveryMethod: state.deliveryMethod,
                deliveryMethod: state.deliveryMethod,
                courierDelivery: state.courierDelivery,
                pickupDelivery: state.pickupDelivery,
                postDelivery: state.postDelivery
            })
        }
    )
);

export default useStore;

import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import axios from 'axios';
import useStore from '@/store/useStore';

const Icons = {
    Trash2: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
    ),
    Minus: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /></svg>
    ),
    Plus: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M5 12h14" /><path d="M12 5v14" /></svg>
    ),
    ShoppingCart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
    ),
    Package: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" /></svg>
    ),
    Truck: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14" /><circle cx="17" cy="18" r="2" /><circle cx="7" cy="18" r="2" /></svg>
    ),
    Mail: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>
    ),
    MapPin: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
    Clock: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
    ),
    Navigation: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="3 11 22 2 13 21 11 13 3 11" /></svg>
    ),
    ArrowLeft: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
    ),
    ArrowUpDown: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>
    ),
    Search: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    Mic: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
    ),
    Tag: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
    ),
    Heart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
    ),
    MessageCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
    ),
};

const Cart = () => {
    const cart = useStore((state) => state.cart);
    const removeFromCart = useStore((state) => state.removeFromCart);
    const incrementCartQuantity = useStore((state) => state.incrementCartQuantity);
    const decrementCartQuantity = useStore((state) => state.decrementCartQuantity);
    const getCartTotal = useStore((state) => state.getCartTotal());
    const getCartCount = useStore((state) => state.getCartCount());
    const clearCart = useStore((state) => state.clearCart);
    const deliveryMethod = useStore((state) => state.deliveryMethod);
    const setDeliveryMethod = useStore((state) => state.setDeliveryMethod);
    const getDeliveryCost = useStore((state) => state.getDeliveryCost());
    const getOrderTotal = useStore((state) => state.getOrderTotal());
    const courierDelivery = useStore((state) => state.courierDelivery);
    const setCourierDeliveryData = useStore((state) => state.setCourierDeliveryData);
    const courierDeliveryErrors = useStore((state) => state.courierDeliveryErrors);
    const validateCourierDelivery = useStore((state) => state.validateCourierDelivery);
    const postDelivery = useStore((state) => state.postDelivery);
    const setPostDeliveryData = useStore((state) => state.setPostDeliveryData);
    const postDeliveryErrors = useStore((state) => state.postDeliveryErrors);
    const validatePostDelivery = useStore((state) => state.validatePostDelivery);
    const favorites = useStore((state) => state.favorites);
    const isFavorite = (id) => favorites.some(f => f.id === id);
    const toggleFavorite = useStore((state) => state.toggleFavorite);
    const chatQueue = useStore((state) => state.chatQueue);
    const toggleChatQueue = useStore((state) => state.toggleChatQueue);

    // Sorting state
    const [currentSort, setCurrentSort] = useState('latest');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const sortDropdownRef = useRef(null);

    const sortOptions = [
        { label: 'Сначала новые', value: 'latest' },
        { label: 'Дешевле', value: 'price_asc' },
        { label: 'Дороже', value: 'price_desc' },
        { label: 'По названию (А-Я)', value: 'name_asc' },
        { label: 'По названию (Я-А)', value: 'name_desc' },
    ];

    // Sorted cart items
    const sortedCart = [...cart].sort((a, b) => {
        switch (currentSort) {
            case 'price_asc': return a.price - b.price;
            case 'price_desc': return b.price - a.price;
            case 'name_asc': return a.name.localeCompare(b.name);
            case 'name_desc': return b.name.localeCompare(a.name);
            case 'latest':
            default:
                return 0; // Default order from store (latest added)
        }
    });

    // Search state
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const searchRef = useRef(null);
    const recognitionRef = useRef(null);

    // UI state
    const [isClearing, setIsClearing] = useState(false);
    const [mapMarker, setMapMarker] = useState(null);

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Fetch suggestions
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery.length >= 2) {
                axios.get(`/search/suggestions?q=${searchQuery}`)
                    .then(res => {
                        setSuggestions(res.data);
                        setShowSuggestions(true);
                    });
            } else {
                setSuggestions({ products: [], categories: [] });
                setShowSuggestions(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery]);

    // Speech recognition
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'ru-RU';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setSearchQuery(transcript);
                setIsListening(false);
                router.get('/catalog', { search: transcript });
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
        return () => recognitionRef.current?.stop();
    }, []);









    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        if (searchQuery.trim()) {
            router.get('/catalog', { search: searchQuery });
        }
    };

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return alert('Голосовой ввод не поддерживается');
        if (isListening) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

    const handleSort = (value) => {
        setCurrentSort(value);
        setShowSortDropdown(false);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    const handleCourierInputChange = (field, value) => {
        // Apply phone mask
        if (field === 'phone') {
            value = formatPhoneNumber(value);
        }
        setCourierDeliveryData({ [field]: value });
    };

    const handlePostInputChange = (field, value) => {
        // Apply phone mask
        if (field === 'phone') {
            value = formatPhoneNumber(value);
        }
        setPostDeliveryData({ [field]: value });
    };

    // Phone number formatter for +375 (XX) XXX-XX-XX
    const formatPhoneNumber = (value) => {
        // Remove all non-digit characters except +
        const cleaned = value.replace(/[^\d+]/g, '');

        // If empty or just +, return as is
        if (cleaned.length === 0) return '';
        if (cleaned === '+') return '+';

        // Start with +375
        let formatted = '+375';

        // Extract digits after +375
        const digits = cleaned.replace(/^\+?375?/, '');

        if (digits.length > 0) {
            // Add opening parenthesis and first 2 digits
            formatted += ' (' + digits.substring(0, 2);

            if (digits.length >= 2) {
                // Close parenthesis after 2 digits
                formatted += ')';

                if (digits.length > 2) {
                    // Add space and next 3 digits
                    formatted += ' ' + digits.substring(2, 5);

                    if (digits.length > 5) {
                        // Add dash and next 2 digits
                        formatted += '-' + digits.substring(5, 7);

                        if (digits.length > 7) {
                            // Add dash and last 2 digits
                            formatted += '-' + digits.substring(7, 9);
                        }
                    }
                }
            }
        }

        return formatted;
    };

    const handleMapClick = (e) => {
        // This would be implemented with actual map library (e.g., Leaflet, Google Maps)
        // For now, we'll store placeholder coordinates
        const marker = {
            lat: 53.9045 + (Math.random() - 0.5) * 0.01,
            lng: 27.5569 + (Math.random() - 0.5) * 0.01
        };
        setMapMarker(marker);
        setCourierDeliveryData({ mapLat: marker.lat, mapLng: marker.lng });
    };

    // Check if checkout form is complete
    const isCheckoutFormComplete = () => {
        if (deliveryMethod === 'pickup') return true;

        if (deliveryMethod === 'courier') {
            return courierDelivery.address &&
                courierDelivery.address.length >= 10 &&
                courierDelivery.phone &&
                !courierDeliveryErrors.address &&
                !courierDeliveryErrors.phone;
        }

        if (deliveryMethod === 'post') {
            return postDelivery.postalCode &&
                postDelivery.region &&
                postDelivery.city &&
                postDelivery.house &&
                postDelivery.apartment &&
                postDelivery.phone &&
                !postDeliveryErrors.postalCode &&
                !postDeliveryErrors.region &&
                !postDeliveryErrors.city &&
                !postDeliveryErrors.house &&
                !postDeliveryErrors.apartment &&
                !postDeliveryErrors.phone;
        }

        return false;
    };

    const getMissingFieldsCount = () => {
        if (deliveryMethod === 'pickup') return 0;

        let missing = 0;
        if (deliveryMethod === 'courier') {
            if (!courierDelivery.address || courierDelivery.address.length < 10) missing++;
            if (!courierDelivery.phone) missing++;
        }

        if (deliveryMethod === 'post') {
            if (!postDelivery.postalCode) missing++;
            if (!postDelivery.region) missing++;
            if (!postDelivery.city) missing++;
            if (!postDelivery.house) missing++;
            if (!postDelivery.apartment) missing++;
            if (!postDelivery.phone) missing++;
        }

        return missing;
    };

    return (
        <>
            <Head title="Корзина" />

            {/* Search Header */}
            <div className="bg-white shadow-sm flex-shrink-0 sticky top-0 z-20">
                <div className="px-4 py-3">
                    <div className="flex items-center gap-4">
                        <div className="flex-1 relative" ref={searchRef}>
                            <form onSubmit={handleSearchSubmit} className="relative">
                                <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Поиск товаров..."
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
                                    className="w-full pl-9 pr-10 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-red-400 focus:bg-white transition-all text-sm"
                                />
                                <button type="submit" className="hidden" aria-hidden="true" />
                                <button
                                    type="button"
                                    onClick={toggleVoiceInput}
                                    className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${isListening
                                        ? 'bg-red-500 text-white animate-pulse'
                                        : 'text-gray-400 hover:text-red-600 hover:bg-gray-200'
                                        }`}
                                >
                                    <Icons.Mic className="w-4 h-4" />
                                </button>
                            </form>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && (suggestions.products.length > 0 || suggestions.categories.length > 0) && (
                                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 z-[9999] animate-in fade-in slide-in-from-top-2 duration-200 max-h-[70vh] flex flex-col overflow-hidden">
                                    <div className="overflow-y-auto flex-1">
                                        {suggestions.categories.length > 0 && (
                                            <div className="p-2">
                                                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Категории</div>
                                                {suggestions.categories.map(cat => (
                                                    <Link
                                                        key={cat.id}
                                                        href={cat.url}
                                                        onClick={() => setShowSuggestions(false)}
                                                        className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                    >
                                                        {cat.icon_url ? (
                                                            <img src={cat.icon_url} alt="" className="w-4 h-4 object-contain flex-shrink-0" />
                                                        ) : (
                                                            <Icons.Tag className="w-4 h-4 text-red-500" />
                                                        )}
                                                        <span className="text-sm font-medium text-gray-700">{cat.name}</span>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}

                                        {suggestions.products.length > 0 && (
                                            <div className="p-2 border-t border-gray-50">
                                                <div className="px-3 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Товары</div>
                                                {suggestions.products.map(prod => {
                                                    const productData = {
                                                        id: prod.id,
                                                        name: prod.name,
                                                        price: prod.price,
                                                        image_main: prod.image,
                                                        stock: 1
                                                    };
                                                    const isProductFavorite = isFavorite(prod.id);

                                                    return (
                                                        <div key={prod.id} className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors group">
                                                            <Link
                                                                href={prod.url}
                                                                onClick={() => setShowSuggestions(false)}
                                                                className="flex items-center gap-3 flex-1 min-w-0"
                                                            >
                                                                <div className="w-10 h-10 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
                                                                    <img src={prod.image || 'https://placehold.co/100x100?text=No+Image'} alt="" className="w-full h-full object-cover" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <div className="text-sm font-medium text-gray-900 truncate">{prod.name}</div>
                                                                    <div className="flex items-center gap-2 mt-0.5">
                                                                        <div className="text-xs text-red-600 font-bold">{new Intl.NumberFormat('ru-RU').format(prod.price)} BYN</div>
                                                                        {prod.reviews_count > 0 && (
                                                                            <div className="flex items-center gap-0.5 text-[10px] text-gray-400">
                                                                                <span className="text-yellow-500">★</span>
                                                                                <span>{Number(prod.reviews_avg_rating).toFixed(1)}</span>
                                                                                <span>({prod.reviews_count})</span>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            </Link>

                                                            <button
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    e.stopPropagation();
                                                                    toggleFavorite(productData);
                                                                }}
                                                                className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isProductFavorite ? 'bg-red-50' : 'bg-gray-100 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                <Icons.Heart className={`w-4 h-4 ${isProductFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                                            </button>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={handleSearchSubmit}
                                        className="w-full p-3 bg-red-50 text-center text-xs font-bold text-red-600 hover:bg-red-100 transition-colors border-t border-gray-100"
                                    >
                                        Показать все результаты
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="relative flex-shrink-0" ref={sortDropdownRef}>
                            <button
                                onClick={() => setShowSortDropdown(!showSortDropdown)}
                                className={`p-2 rounded-lg transition-colors ${showSortDropdown ? 'bg-gray-200' : 'hover:bg-gray-100'}`}
                            >
                                <Icons.ArrowUpDown className="w-6 h-6 text-gray-700" />
                            </button>

                            {showSortDropdown && (
                                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-50 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Сортировка</span>
                                    </div>
                                    {sortOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            onClick={() => handleSort(option.value)}
                                            className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${currentSort === option.value
                                                ? 'text-red-700 font-bold bg-red-50'
                                                : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span>{option.label}</span>
                                            {currentSort === option.value && (
                                                <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Title Panel */}
                <div className="px-4 py-3 border-t border-gray-50 flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Корзина</h1>
                        {cart.length > 0 && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {getCartCount} {getCartCount === 1 ? 'товар' : (getCartCount > 1 && getCartCount < 5) ? 'товара' : 'товаров'}
                            </p>
                        )}
                    </div>
                    {cart.length > 0 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isClearing) {
                                    setIsClearing(true);
                                    setTimeout(() => setIsClearing(false), 3000);
                                } else {
                                    clearCart();
                                    setIsClearing(false);
                                }
                            }}
                            className={`text-sm transition-colors font-medium px-3 py-1 rounded-lg ${isClearing
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'text-gray-400 hover:text-red-500'
                                }`}
                        >
                            {isClearing ? 'Уверены? Нажмите ещё раз' : 'Очистить всё'}
                        </button>
                    )}
                </div>
            </div>

            <main className="flex-1 overflow-y-auto content-scroll bg-gray-50">
                <div className="max-w-4xl mx-auto p-4 md:p-6">
                    {cart.length === 0 ? (
                        <div className="bg-white rounded-3xl p-12 text-center shadow-sm border border-gray-100">
                            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icons.ShoppingCart className="w-10 h-10 text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Ваша корзина пуста</h2>
                            <p className="text-gray-500 mb-8 max-w-xs mx-auto">
                                Самое время добавить в неё что-нибудь интересное из нашего каталога
                            </p>
                            <Link
                                href="/catalog"
                                className="inline-flex items-center justify-center px-8 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                Вернуться к покупкам
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Cart Items */}
                            <div className="lg:col-span-2 space-y-4">
                                {sortedCart.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4"
                                    >
                                        <Link
                                            href={`/product/${item.slug}`}
                                            className="w-24 h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100"
                                        >
                                            <img
                                                src={item.image_main || 'https://placehold.co/400x600?text=No+Image'}
                                                alt={item.name}
                                                className="w-full h-full object-cover"
                                            />
                                        </Link>

                                        <div className="flex-1 flex flex-col min-w-0">
                                            <div className="flex justify-between items-start gap-2 mb-2">
                                                <Link
                                                    href={`/product/${item.slug}`}
                                                    className="font-bold text-gray-900 text-sm hover:text-red-500 transition-colors line-clamp-2"
                                                >
                                                    {item.name}
                                                </Link>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1.5 text-gray-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                                                >
                                                    <Icons.Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="mt-auto flex items-end justify-between">
                                                <div className="space-y-2">
                                                    <div className="text-lg font-bold text-red-600">
                                                        {formatPrice(item.price * item.quantity)} BYN
                                                    </div>
                                                    {item.quantity > 1 && (
                                                        <div className="text-[10px] text-gray-400 font-medium">
                                                            {formatPrice(item.price)} BYN / шт.
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    {/* Favorite Button */}
                                                    <button
                                                        onClick={() => toggleFavorite(item)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isFavorite(item.id) ? 'bg-red-50' : 'bg-gray-100 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <Icons.Heart className={`w-5 h-5 ${isFavorite(item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                                    </button>

                                                    {/* Quantity Selector */}
                                                    <div className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 rounded-xl overflow-hidden h-10 min-w-[100px] transition-colors">
                                                        <button
                                                            onClick={() => decrementCartQuantity(item.id)}
                                                            className="w-8 h-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-700 font-bold text-lg"
                                                        >
                                                            −
                                                        </button>
                                                        <div className="flex-1 text-center text-gray-900 font-bold text-sm">
                                                            {item.quantity}
                                                        </div>
                                                        <button
                                                            onClick={() => incrementCartQuantity(item.id)}
                                                            className="w-8 h-full flex items-center justify-center hover:bg-gray-300 transition-colors text-gray-700 font-bold text-lg"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Chat Button */}
                                                    <button
                                                        onClick={() => toggleChatQueue(item)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${chatQueue.some(q => q.id === item.id) ? 'bg-red-50 border border-red-200' : 'bg-gray-100 hover:bg-gray-200'
                                                            }`}
                                                    >
                                                        <Icons.MessageCircle className={`w-5 h-5 ${chatQueue.some(q => q.id === item.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Order Summary */}
                            <div className="lg:col-span-1">
                                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 sticky top-6">
                                    <h3 className="text-lg font-bold text-gray-900 mb-6">Ваш заказ</h3>

                                    {/* Free Shipping Progress */}
                                    {deliveryMethod === 'courier' && getCartTotal < 100 && (
                                        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="font-bold text-gray-700">📦 До бесплатной доставки</span>
                                                <span className="font-bold text-green-600">{formatPrice(100 - getCartTotal)} BYN</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-500 ease-out"
                                                    style={{ width: `${Math.min((getCartTotal / 100) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Добавьте ещё товаров, чтобы получить бесплатную доставку курьером
                                            </p>
                                        </div>
                                    )}

                                    {deliveryMethod === 'post' && getCartTotal < 200 && (
                                        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200">
                                            <div className="flex items-center justify-between text-sm mb-2">
                                                <span className="font-bold text-gray-700">📦 До бесплатной доставки почтой</span>
                                                <span className="font-bold text-blue-600">{formatPrice(200 - getCartTotal)} BYN</span>
                                            </div>
                                            <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-blue-400 to-cyan-500 transition-all duration-500 ease-out"
                                                    style={{ width: `${Math.min((getCartTotal / 200) * 100, 100)}%` }}
                                                />
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                Добавьте ещё товаров, чтобы получить бесплатную доставку почтой
                                            </p>
                                        </div>
                                    )}

                                    {((deliveryMethod === 'courier' && getCartTotal >= 100) ||
                                        (deliveryMethod === 'post' && getCartTotal >= 200)) && (
                                            <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200">
                                                <div className="flex items-center gap-2">
                                                    <svg className="w-5 h-5 text-green-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-green-700">Вы получили бесплатную доставку!</div>
                                                        <div className="text-xs text-green-600 mt-0.5">Экономия: {formatPrice(getDeliveryCost === 0 ? (deliveryMethod === 'courier' ? 15 : 20) : 0)} BYN</div>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                    {/* Delivery Method Selection */}
                                    <div className="mb-6">
                                        <div className="text-sm font-bold text-gray-700 mb-3">Способ доставки</div>
                                        <div className="space-y-2">
                                            {/* Self-pickup */}
                                            <button
                                                onClick={() => setDeliveryMethod('pickup')}
                                                className={`w-full p-3 rounded-xl border-2 transition-all text-left ${deliveryMethod === 'pickup'
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${deliveryMethod === 'pickup' ? 'bg-red-500' : 'bg-gray-100'
                                                        }`}>
                                                        <Icons.Package className={`w-5 h-5 ${deliveryMethod === 'pickup' ? 'text-white' : 'text-gray-600'
                                                            }`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-sm text-gray-900">Самовывоз</div>
                                                        <div className="text-xs text-green-600 font-bold">Бесплатно</div>
                                                        <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                                                            пр-т Победителей 57, оф. 16Н
                                                        </div>
                                                    </div>
                                                    {deliveryMethod === 'pickup' && (
                                                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>

                                            {/* Courier */}
                                            <button
                                                onClick={() => setDeliveryMethod('courier')}
                                                className={`w-full p-3 rounded-xl border-2 transition-all text-left ${deliveryMethod === 'courier'
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${deliveryMethod === 'courier' ? 'bg-red-500' : 'bg-gray-100'
                                                        }`}>
                                                        <Icons.Truck className={`w-5 h-5 ${deliveryMethod === 'courier' ? 'text-white' : 'text-gray-600'
                                                            }`} />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-bold text-sm text-gray-900">Курьером</div>
                                                        <div className="text-xs text-gray-500">
                                                            {getCartTotal >= 100 ? (
                                                                <span className="text-green-600 font-bold">Бесплатно</span>
                                                            ) : (
                                                                <span className="font-bold">15 BYN</span>
                                                            )}
                                                        </div>
                                                        <div className="text-[10px] text-gray-500 mt-0.5 leading-tight">
                                                            {new Date().getHours() < 19 ? 'Сегодня' : 'Завтра'} c 18:00 до 21:00
                                                        </div>
                                                    </div>
                                                    {deliveryMethod === 'courier' && (
                                                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center flex-shrink-0">
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>

                                            {/* Post */}
                                            <button
                                                onClick={() => setDeliveryMethod('post')}
                                                className={`w-full p-3 rounded-xl border-2 transition-all text-left ${deliveryMethod === 'post'
                                                    ? 'border-red-500 bg-red-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${deliveryMethod === 'post' ? 'bg-red-500' : 'bg-gray-100'
                                                        }`}>
                                                        <Icons.Mail className={`w-5 h-5 ${deliveryMethod === 'post' ? 'text-white' : 'text-gray-600'
                                                            }`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="font-bold text-sm text-gray-900">Почтой</div>
                                                        <div className="text-xs text-gray-500">
                                                            {getCartTotal >= 200 ? (
                                                                <span className="text-green-600 font-bold">Бесплатно</span>
                                                            ) : (
                                                                <span>20 BYN <span className="text-gray-400">(бесплатно от 200 BYN)</span></span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    {deliveryMethod === 'post' && (
                                                        <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Pickup Location Details */}
                                    {deliveryMethod === 'pickup' && (
                                        <div className="mb-6 p-4 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl border border-red-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Icons.MapPin className="w-5 h-5 text-red-600" />
                                                <h4 className="font-bold text-gray-900">Пункт самовывоза</h4>
                                            </div>

                                            <div className="space-y-3 mb-4">
                                                <div className="flex gap-2">
                                                    <Icons.MapPin className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm">
                                                        <div className="font-bold text-gray-900">г. Минск, пр-т Победителей 57,</div>
                                                        <div className="font-bold text-gray-900">оф. 16Н</div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <Icons.Clock className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                                                    <div className="text-sm text-gray-700">
                                                        <div className="font-medium">Пн-Пт: 10:00-18:00</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">Сб-Вс: выходной</div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Map */}
                                            <div className="rounded-xl overflow-hidden border border-red-200 mb-3">
                                                <iframe
                                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2349.8901234567!2d27.5569!3d53.9045!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x46dbc57d9f0e0e0b%3A0x1234567890abcdef!2z0J_RgC3RgiDQn9C-0LHQtdC00LjRgtC10LvQtdC5IDU3LCDQnNC40L3RgdC6!5e0!3m2!1sru!2sby!4v1234567890123!5m2!1sru!2sby"
                                                    width="100%"
                                                    height="200"
                                                    style={{ border: 0 }}
                                                    allowFullScreen=""
                                                    loading="lazy"
                                                    referrerPolicy="no-referrer-when-downgrade"
                                                    className="w-full"
                                                ></iframe>
                                            </div>

                                            {/* Navigation Instructions */}
                                            <details className="group">
                                                <summary className="flex items-center justify-between cursor-pointer py-2 px-3 bg-white rounded-lg hover:bg-red-50 transition-colors">
                                                    <div className="flex items-center gap-2">
                                                        <Icons.Navigation className="w-4 h-4 text-red-500" />
                                                        <span className="text-sm font-bold text-gray-900">Как добраться</span>
                                                    </div>
                                                    <svg className="w-4 h-4 text-gray-400 transition-transform group-open:rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </summary>

                                                <div className="mt-3 space-y-3 px-3">
                                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                        <div className="font-bold text-xs text-gray-500 uppercase mb-2">🚇 На метро</div>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                            Станция «Немига» или «Фрунзенская».
                                                            От метро пешком 7-10 минут по проспекту Победителей.
                                                        </p>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                        <div className="font-bold text-xs text-gray-500 uppercase mb-2">🚌 На транспорте</div>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                            Автобусы: 1, 29, 44, 69, 91.
                                                            Троллейбусы: 12, 29, 37.
                                                            Остановка «пр-т Победителей».
                                                        </p>
                                                    </div>

                                                    <div className="bg-white rounded-lg p-3 border border-gray-100">
                                                        <div className="font-bold text-xs text-gray-500 uppercase mb-2">🚗 На автомобиле</div>
                                                        <p className="text-sm text-gray-700 leading-relaxed">
                                                            Бесплатная парковка возле здания.
                                                            Вход со стороны двора, офис 16Н на 1-м этаже.
                                                        </p>
                                                    </div>

                                                    {/* Images placeholder */}
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                            <img
                                                                src="https://placehold.co/400x300/e5e7eb/6b7280?text=Вход+в+здание"
                                                                alt="Вход в здание"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                                                            <img
                                                                src="https://placehold.co/400x300/e5e7eb/6b7280?text=Офис"
                                                                alt="Офис"
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </details>
                                        </div>
                                    )}

                                    {/* Courier Delivery Form */}
                                    {deliveryMethod === 'courier' && (
                                        <div className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Icons.Truck className="w-5 h-5 text-blue-600" />
                                                <h4 className="font-bold text-gray-900">Данные для доставки</h4>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Address Input */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                        Адрес в Минске <span className="text-xs text-gray-500 font-normal">(обязательно)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={courierDelivery.address}
                                                            onChange={(e) => handleCourierInputChange('address', e.target.value)}
                                                            placeholder="ул. Ленина, 25"
                                                            className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors ${courierDeliveryErrors.address
                                                                ? 'border-red-300 focus:ring-red-400'
                                                                : courierDelivery.address && courierDelivery.address.length >= 10
                                                                    ? 'border-green-300 focus:ring-green-400'
                                                                    : 'border-gray-200 focus:ring-blue-400'
                                                                }`}
                                                        />
                                                        {courierDelivery.address && courierDelivery.address.length >= 10 && !courierDeliveryErrors.address && (
                                                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {courierDeliveryErrors.address && (
                                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {courierDeliveryErrors.address}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Phone Input */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                        Телефон для связи <span className="text-xs text-gray-500 font-normal">(обязательно)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="tel"
                                                            value={courierDelivery.phone}
                                                            onChange={(e) => handleCourierInputChange('phone', e.target.value)}
                                                            placeholder="+375 (29) 123-45-67"
                                                            maxLength="19"
                                                            className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors ${courierDeliveryErrors.phone
                                                                ? 'border-red-300 focus:ring-red-400'
                                                                : courierDelivery.phone && !courierDeliveryErrors.phone && courierDelivery.phone.length > 0
                                                                    ? 'border-green-300 focus:ring-green-400'
                                                                    : 'border-gray-200 focus:ring-blue-400'
                                                                }`}
                                                        />
                                                        {courierDelivery.phone && !courierDeliveryErrors.phone && courierDelivery.phone.length > 0 && (
                                                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {courierDeliveryErrors.phone && (
                                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {courierDeliveryErrors.phone}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Comment - Optional */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                        Комментарий (необязательно)
                                                    </label>
                                                    <textarea
                                                        value={courierDelivery.comment}
                                                        onChange={(e) => handleCourierInputChange('comment', e.target.value)}
                                                        placeholder="подъезд 2, домофон 25"
                                                        rows="2"
                                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm resize-none"
                                                    />
                                                </div>

                                                <div className="flex items-start gap-2 bg-blue-50 rounded-lg p-3 border border-blue-100">
                                                    <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="text-xs text-blue-700 leading-relaxed">
                                                        Доставка осуществляется только по городу Минску.
                                                        Курьер свяжется с вами за 1-2 часа до доставки.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Post Delivery Form */}
                                    {deliveryMethod === 'post' && (
                                        <div className="mb-6 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                                            <div className="flex items-center gap-2 mb-4">
                                                <Icons.Mail className="w-5 h-5 text-green-600" />
                                                <h4 className="font-bold text-gray-900">Данные для отправки</h4>
                                            </div>

                                            <div className="space-y-3">
                                                {/* Postal Code */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                        Индекс <span className="text-xs text-gray-500 font-normal">(обязательно)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={postDelivery.postalCode}
                                                            onChange={(e) => handlePostInputChange('postalCode', e.target.value)}
                                                            placeholder="220000"
                                                            maxLength="6"
                                                            className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors ${postDeliveryErrors.postalCode
                                                                ? 'border-red-300 focus:ring-red-400'
                                                                : postDelivery.postalCode && postDelivery.postalCode.length === 6 && !postDeliveryErrors.postalCode
                                                                    ? 'border-green-300 focus:ring-green-400'
                                                                    : 'border-gray-200 focus:ring-green-400'
                                                                }`}
                                                        />
                                                        {postDelivery.postalCode && postDelivery.postalCode.length === 6 && !postDeliveryErrors.postalCode && (
                                                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {postDeliveryErrors.postalCode && (
                                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {postDeliveryErrors.postalCode}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Region */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                        Район <span className="text-xs text-gray-500 font-normal">(обязательно)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={postDelivery.region}
                                                            onChange={(e) => handlePostInputChange('region', e.target.value)}
                                                            placeholder="Минский район"
                                                            className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors ${postDeliveryErrors.region
                                                                ? 'border-red-300 focus:ring-red-400'
                                                                : postDelivery.region && postDelivery.region.length >= 3 && !postDeliveryErrors.region
                                                                    ? 'border-green-300 focus:ring-green-400'
                                                                    : 'border-gray-200 focus:ring-green-400'
                                                                }`}
                                                        />
                                                        {postDelivery.region && postDelivery.region.length >= 3 && !postDeliveryErrors.region && (
                                                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {postDeliveryErrors.region && (
                                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {postDeliveryErrors.region}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* City/Town */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                        Населенный пункт <span className="text-xs text-gray-500 font-normal">(обязательно)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={postDelivery.city}
                                                            onChange={(e) => handlePostInputChange('city', e.target.value)}
                                                            placeholder="г. Минск"
                                                            className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors ${postDeliveryErrors.city
                                                                ? 'border-red-300 focus:ring-red-400'
                                                                : postDelivery.city && postDelivery.city.length >= 2 && !postDeliveryErrors.city
                                                                    ? 'border-green-300 focus:ring-green-400'
                                                                    : 'border-gray-200 focus:ring-green-400'
                                                                }`}
                                                        />
                                                        {postDelivery.city && postDelivery.city.length >= 2 && !postDeliveryErrors.city && (
                                                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {postDeliveryErrors.city && (
                                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {postDeliveryErrors.city}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* House and Apartment in one row */}
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                            Дом <span className="text-xs text-gray-500 font-normal">(обязательно)</span>
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={postDelivery.house}
                                                                onChange={(e) => handlePostInputChange('house', e.target.value)}
                                                                placeholder="25"
                                                                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors ${postDeliveryErrors.house
                                                                    ? 'border-red-300 focus:ring-red-400'
                                                                    : postDelivery.house && postDelivery.house.length > 0 && !postDeliveryErrors.house
                                                                        ? 'border-green-300 focus:ring-green-400'
                                                                        : 'border-gray-200 focus:ring-green-400'
                                                                    }`}
                                                            />
                                                            {postDelivery.house && postDelivery.house.length > 0 && !postDeliveryErrors.house && (
                                                                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        {postDeliveryErrors.house && (
                                                            <p className="text-xs text-red-600 mt-1">{postDeliveryErrors.house}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                            Квартира <span className="text-xs text-gray-500 font-normal">(обязательно)</span>
                                                        </label>
                                                        <div className="relative">
                                                            <input
                                                                type="text"
                                                                value={postDelivery.apartment}
                                                                onChange={(e) => handlePostInputChange('apartment', e.target.value)}
                                                                placeholder="10"
                                                                className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors ${postDeliveryErrors.apartment
                                                                    ? 'border-red-300 focus:ring-red-400'
                                                                    : postDelivery.apartment && postDelivery.apartment.length > 0 && !postDeliveryErrors.apartment
                                                                        ? 'border-green-300 focus:ring-green-400'
                                                                        : 'border-gray-200 focus:ring-green-400'
                                                                    }`}
                                                            />
                                                            {postDelivery.apartment && postDelivery.apartment.length > 0 && !postDeliveryErrors.apartment && (
                                                                <svg className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                                </svg>
                                                            )}
                                                        </div>
                                                        {postDeliveryErrors.apartment && (
                                                            <p className="text-xs text-red-600 mt-1">{postDeliveryErrors.apartment}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Phone Input */}
                                                <div>
                                                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                        Телефон для связи <span className="text-xs text-gray-500 font-normal">(обязательно)</span>
                                                    </label>
                                                    <div className="relative">
                                                        <input
                                                            type="tel"
                                                            value={postDelivery.phone}
                                                            onChange={(e) => handlePostInputChange('phone', e.target.value)}
                                                            placeholder="+375 (29) 123-45-67"
                                                            maxLength="19"
                                                            className={`w-full px-3 py-2.5 pr-10 border rounded-lg focus:ring-2 focus:border-transparent text-sm transition-colors ${postDeliveryErrors.phone
                                                                ? 'border-red-300 focus:ring-red-400'
                                                                : postDelivery.phone && !postDeliveryErrors.phone && postDelivery.phone.length > 0
                                                                    ? 'border-green-300 focus:ring-green-400'
                                                                    : 'border-gray-200 focus:ring-green-400'
                                                                }`}
                                                        />
                                                        {postDelivery.phone && !postDeliveryErrors.phone && postDelivery.phone.length > 0 && (
                                                            <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                    {postDeliveryErrors.phone && (
                                                        <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                            </svg>
                                                            {postDeliveryErrors.phone}
                                                        </p>
                                                    )}
                                                </div>

                                                <div className="flex items-start gap-2 bg-green-50 rounded-lg p-3 border border-green-100">
                                                    <svg className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                    </svg>
                                                    <div className="text-xs text-green-700 leading-relaxed">
                                                        Доставка почтой осуществляется по всей территории Беларуси.
                                                        Срок доставки: 3-7 рабочих дней.
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Товары ({getCartCount})</span>
                                            <span className="font-bold text-gray-900">{formatPrice(getCartTotal)} BYN</span>
                                        </div>
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Доставка</span>
                                            {getDeliveryCost === 0 ? (
                                                <span className="text-green-600 font-bold">Бесплатно</span>
                                            ) : (
                                                <span className="font-bold text-gray-900">{formatPrice(getDeliveryCost)} BYN</span>
                                            )}
                                        </div>

                                        {/* Payment Method */}
                                        <div className="pt-3 border-t border-gray-100">
                                            <div className="text-xs font-bold text-gray-700 mb-2">Способ оплаты</div>
                                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                                </svg>
                                                <span>Наличными или картой при получении</span>
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                                            <span className="text-base font-bold text-gray-900">Итого</span>
                                            <div className="text-right">
                                                <div className="text-2xl font-extrabold text-red-600">
                                                    {formatPrice(getOrderTotal)} BYN
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        disabled={!isCheckoutFormComplete()}
                                        className={`w-full py-4 rounded-2xl font-bold text-lg transition-all mb-4 relative group ${isCheckoutFormComplete()
                                            ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-95'
                                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            }`}
                                    >
                                        {isCheckoutFormComplete()
                                            ? 'Оформить заказ'
                                            : `Заполните данные доставки (${getMissingFieldsCount()})`
                                        }

                                        {!isCheckoutFormComplete() && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-gray-400 rounded-2xl">
                                                <span className="text-white text-sm font-medium px-4">
                                                    Осталось заполнить: {getMissingFieldsCount()} {getMissingFieldsCount() === 1 ? 'поле' : 'поля'}
                                                </span>
                                            </div>
                                        )}
                                    </button>

                                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                                        Нажимая кнопку «Оформить заказ», вы соглашаетесь с условиями публичной оферты и политики конфиденциальности
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

Cart.layout = page => <MainLayout children={page} />;


export default Cart;

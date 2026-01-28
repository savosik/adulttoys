import React, { useState, useEffect, useRef } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, router } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import axios from 'axios';
import useStore from '@/store/useStore';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Simplified SVG Icons
const Icons = {
    Heart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
    ),
    ShoppingCart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
    ),
    MessageCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
    ),
    Package: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.27 6.96 8.73 5.05 8.73-5.05" /><path d="M12 22.08V12" /></svg>
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
    ArrowUpDown: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>
    ),
};

const Favorites = () => {
    // Zustand store - using direct state access for reactivity
    const addToCart = useStore((state) => state.addToCart);
    const incrementCartQuantity = useStore((state) => state.incrementCartQuantity);
    const decrementCartQuantity = useStore((state) => state.decrementCartQuantity);
    const toggleFavorite = useStore((state) => state.toggleFavorite);
    const isFavorite = useStore((state) => state.isFavorite);
    const toggleChatQueue = useStore((state) => state.toggleChatQueue);
    const cart = useStore((state) => state.cart);
    const chatQueue = useStore((state) => state.chatQueue);
    const favorites = useStore((state) => state.favorites);
    const clearFavorites = useStore((state) => state.clearFavorites);

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

    // Sorted favorites
    const sortedFavorites = [...favorites].sort((a, b) => {
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
    const [isClearing, setIsClearing] = useState(false);
    const searchRef = useRef(null);
    const recognitionRef = useRef(null);

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
                router.get('/', { search: transcript });
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
            router.get('/', { search: searchQuery });
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

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        if (product.stock > 0) {
            addToCart(product);
        }
    };

    const handleIncrementCart = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        incrementCartQuantity(productId);
    };

    const handleDecrementCart = (e, productId) => {
        e.preventDefault();
        e.stopPropagation();
        decrementCartQuantity(productId);
    };

    const handleToggleFavorite = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
    };

    const handleAddToChat = (e, product) => {
        e.preventDefault();
        e.stopPropagation();
        toggleChatQueue(product);
    };

    return (
        <>
            <Head title="Избранное" />

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
                        <h1 className="text-xl font-bold text-gray-900">Избранное</h1>
                        {favorites.length > 0 && (
                            <p className="text-sm text-gray-500 mt-0.5">
                                {favorites.length} {favorites.length === 1 ? 'товар' : (favorites.length > 1 && favorites.length < 5) ? 'товара' : 'товаров'}
                            </p>
                        )}
                    </div>
                    {favorites.length > 0 && (
                        <button
                            type="button"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                if (!isClearing) {
                                    setIsClearing(true);
                                    setTimeout(() => setIsClearing(false), 3000);
                                } else {
                                    clearFavorites();
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

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto content-scroll">
                <div className="p-4">
                    {favorites.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 px-4">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                                <Icons.Heart className="w-12 h-12 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-bold text-gray-900 mb-2">Список избранного пуст</h2>
                            <p className="text-gray-500 text-center mb-6 max-w-sm">
                                Добавляйте понравившиеся товары, чтобы не потерять их
                            </p>
                            <Link
                                href="/"
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors"
                            >
                                Перейти в каталог
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-4">
                            {sortedFavorites.map((product) => {
                                const images = [
                                    product.image_main,
                                    ...(product.additional_images || []).map(img => img.url)
                                ].filter(Boolean);

                                if (images.length === 0) {
                                    images.push('https://placehold.co/400x400/e5e7eb/6b7280?text=No+Image');
                                }

                                return (
                                    <Link
                                        key={product.id}
                                        href={`/product/${product.slug}`}
                                        className="bg-white rounded-2xl overflow-hidden shadow-sm group border border-gray-100 flex flex-col cursor-pointer hover:shadow-md transition-shadow"
                                    >
                                        <div className="relative aspect-[2/3] overflow-hidden bg-gray-50">
                                            <Swiper
                                                modules={[Pagination, Navigation]}
                                                pagination={{ clickable: true }}
                                                navigation={true}
                                                className="h-full w-full product-swiper"
                                            >
                                                {images.map((img, idx) => (
                                                    <SwiperSlide key={idx}>
                                                        <img
                                                            src={img}
                                                            alt={`${product.name} - ${idx + 1}`}
                                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                        />
                                                    </SwiperSlide>
                                                ))}
                                            </Swiper>

                                            {product.old_price && (
                                                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                                                    -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-3">
                                            <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                                                {product.name}
                                            </h3>

                                            <div className="flex items-center gap-1 mb-2">
                                                <span className="text-yellow-500 text-sm">★</span>
                                                <span className="text-xs text-gray-600">{Number(product.reviews_avg_rating || 0).toFixed(1)}</span>
                                                <span className="text-xs text-gray-400">({product.reviews_count || 0})</span>
                                            </div>

                                            <div className="flex items-end gap-2 mb-3">
                                                <span className="text-lg font-bold text-gray-900">
                                                    {new Intl.NumberFormat('ru-RU').format(product.price)} BYN
                                                </span>
                                                {product.old_price && (
                                                    <span className="text-xs text-gray-400 line-through mb-0.5">
                                                        {new Intl.NumberFormat('ru-RU').format(product.old_price)} BYN
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-2">
                                                {/* Favorites Button */}
                                                <button
                                                    onClick={(e) => handleToggleFavorite(e, product)}
                                                    className="flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-red-50 border border-red-200"
                                                >
                                                    <Icons.Heart
                                                        className="w-5 h-5 transition-all fill-red-500 stroke-red-500"
                                                    />
                                                </button>

                                                {/* Add to Cart Button */}
                                                {(() => {
                                                    const cartItem = cart.find(item => item.id === product.id);

                                                    if (cartItem) {
                                                        // Quantity selector
                                                        return (
                                                            <div className="flex-1 flex items-center gap-1 bg-green-600 rounded-xl overflow-hidden">
                                                                <button
                                                                    onClick={(e) => handleDecrementCart(e, product.id)}
                                                                    className="w-10 h-10 flex items-center justify-center hover:bg-green-700 transition-colors text-white font-bold text-lg"
                                                                >
                                                                    −
                                                                </button>
                                                                <div className="flex-1 text-center text-white font-bold text-sm">
                                                                    {cartItem.quantity}
                                                                </div>
                                                                <button
                                                                    onClick={(e) => handleIncrementCart(e, product.id)}
                                                                    className="w-10 h-10 flex items-center justify-center hover:bg-green-700 transition-colors text-white font-bold text-lg"
                                                                >
                                                                    +
                                                                </button>
                                                            </div>
                                                        );
                                                    }

                                                    // Regular add to cart button
                                                    return (
                                                        <button
                                                            onClick={(e) => handleAddToCart(e, product)}
                                                            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${product.stock <= 0
                                                                ? 'bg-gray-200 text-gray-500'
                                                                : 'bg-red-500 hover:bg-red-600 text-white'
                                                                }`}
                                                            disabled={product.stock <= 0}
                                                        >
                                                            {product.stock > 0 ? (
                                                                <>
                                                                    <Icons.ShoppingCart className="w-4 h-4" />
                                                                    <span className="text-sm">
                                                                        <span className="xs:hidden">купить</span>
                                                                        <span className="hidden xs:inline">{new Date().getHours() < 19 ? 'сегодня' : 'завтра'}</span>
                                                                    </span>
                                                                </>
                                                            ) : (
                                                                'Нет в наличии'
                                                            )}
                                                        </button>
                                                    );
                                                })()}

                                                {/* Chat Button */}
                                                {(() => {
                                                    const isInChat = chatQueue.some(item => item.id === product.id);
                                                    return (
                                                        <button
                                                            onClick={(e) => handleAddToChat(e, product)}
                                                            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isInChat
                                                                ? 'bg-red-50 border border-red-200'
                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            <Icons.MessageCircle className={`w-5 h-5 transition-all ${isInChat
                                                                ? 'fill-red-500 stroke-red-500'
                                                                : 'text-gray-600'
                                                                }`} />
                                                        </button>
                                                    );
                                                })()}
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

Favorites.layout = page => <MainLayout children={page} />;

export default Favorites;

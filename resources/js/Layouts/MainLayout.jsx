import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import axios from 'axios';
import useStore from '@/store/useStore';
import Toast from '@/components/Toast';

// Simplified SVG Icons to mimic lucide-react
const Icons = {
    Search: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    ),
    Phone: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
    ),
    Store: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/><path d="M2 7h20"/><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7"/></svg>
    ),
    Home: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
    ),
    Package: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.27 6.96 8.73 5.05 8.73-5.05"/><path d="M12 22.08V12"/></svg>
    ),
    Smartphone: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>
    ),
    Monitor: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
    ),
    Headphones: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/></svg>
    ),
    Watch: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="7"/><polyline points="12 9 12 12 13.5 13.5"/><path d="M16.51 17.35 18.5 21a2 2 0 0 0 1.72 1h.5a2 2 0 0 0 2-2v-3.51"/><path d="M18.5 3a2 2 0 0 1 1.72 1l1.99 3.51V11a2 2 0 0 1-2 2h-.5a2 2 0 0 1-1.72-1L16.51 6.65"/><path d="M7.49 17.35 5.5 21a2 2 0 0 1-1.72 1h-.5a2 2 0 0 1-2-2v-3.51"/><path d="M5.5 3a2 2 0 0 0-1.72 1L1.79 7.51V11a2 2 0 0 0 2 2h.5a2 2 0 0 0 1.72-1L7.49 6.65"/></svg>
    ),
    Tag: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
    ),
    Shirt: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>
    ),
    Zap: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
    ),
    Heart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
    ),
    ShoppingCart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
    ),
    User: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
    ),
    LayoutGrid: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
    ),
    MessageCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
    ),
    MapPin: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
    ),
    HelpCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>
    ),
    ClipboardList: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/></svg>
    ),
    Droplets: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-6-4-6s-4 2.7-4 6c0 2.2 1.8 4 4 4Z"/><path d="M17 18.3c1.7 0 3-1.3 3-3 0-2.5-3-4.5-3-4.5s-3 2-3 4.5c0 1.7 1.3 3 3 3Z"/></svg>
    ),
    Shield: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1-1z"/></svg>
    ),
    Activity: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
    ),
    Mic: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
    ),
    ArrowUpDown: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
    ),
    Star: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
};

const getCategoryIcon = (name = '') => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('игруш')) return Icons.Package;
    if (lowerName.includes('одежд') || lowerName.includes('бель')) return Icons.Shirt;
    if (lowerName.includes('вибр') || lowerName.includes('стимул') || lowerName.includes('электро')) return Icons.Zap;
    if (lowerName.includes('космет') || lowerName.includes('гель') || lowerName.includes('смазк')) return Icons.Droplets;
    if (lowerName.includes('презерв')) return Icons.Shield;
    if (lowerName.includes('тренаж') || lowerName.includes('бад')) return Icons.Activity;
    
    return Icons.Package;
};

const MainLayout = ({ children, filters: propsFilters }) => {
    const { categories = [], filters: pageFilters = {}, cart: pageCart = [], chatQueue: pageChatQueue = [], appName } = usePage().props;
    const { component, url } = usePage();
    // Use filters from props (ProductDetail) or from page props (Catalog)
    const filters = propsFilters || pageFilters;
    const selectedCategory = filters.category;
    
    const isAboutPage = component === 'About';
    
    // Zustand store
    const cartCount = useStore((state) => state.getCartCount());
    const favoritesCount = useStore((state) => state.getFavoritesCount());
    const chatQueueCount = useStore((state) => state.getChatQueueCount());
    const isFavorite = useStore((state) => state.isFavorite);
    const toggleFavorite = useStore((state) => state.toggleFavorite);
    const addToCart = useStore((state) => state.addToCart);
    const incrementCartQuantity = useStore((state) => state.incrementCartQuantity);
    const decrementCartQuantity = useStore((state) => state.decrementCartQuantity);
    const toggleChatQueue = useStore((state) => state.toggleChatQueue);
    const cart = useStore((state) => state.cart);
    const chatQueue = useStore((state) => state.chatQueue);

    // Search state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const searchRef = useRef(null);
    const recognitionRef = useRef(null);
    const sortDropdownRef = useRef(null);

    const sortOptions = [
        { label: 'Сначала новые', value: 'latest' },
        { label: 'Дешевле', value: 'price_asc' },
        { label: 'Дороже', value: 'price_desc' },
        { label: 'По наличию', value: 'stock_desc' },
        { label: 'По названию (А-Я)', value: 'name_asc' },
        { label: 'По названию (Я-А)', value: 'name_desc' },
        { label: 'По популярности', value: 'hit' },
        { label: 'Новинки', value: 'novelty' },
    ];

    const currentSort = filters.sort || 'price_desc';

    // Click outside handlers
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
                setShowSortDropdown(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Sync search query with filters
    useEffect(() => {
        setSearchQuery(filters.search || '');
        setShowSuggestions(false);
    }, [filters.search]);

    // Fetch suggestions
    useEffect(() => {
        if (searchQuery === filters.search) {
            setShowSuggestions(false);
            return;
        }

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
    }, [searchQuery, filters.search]);

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
                router.get('/catalog', { search: transcript }, { 
                    preserveState: false, 
                    preserveScroll: false, 
                    replace: false 
                });
            };

            recognitionRef.current.onerror = () => setIsListening(false);
            recognitionRef.current.onend = () => setIsListening(false);
        }
        return () => recognitionRef.current?.stop();
    }, []);

    const handleSearch = (e) => setSearchQuery(e.target.value);

    const handleSearchSubmit = (e) => {
        e?.preventDefault();
        setShowSuggestions(false);
        if (searchQuery.trim()) {
            router.get('/catalog', { search: searchQuery }, { 
                preserveState: false, 
                preserveScroll: false, 
                replace: false 
            });
        } else {
            router.get('/catalog', { search: undefined }, { 
                preserveState: false, 
                preserveScroll: false, 
                replace: false 
            });
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
        setShowSortDropdown(false);
        router.get('/catalog', { ...filters, sort: value }, { 
            preserveState: true, 
            preserveScroll: true,
            replace: true 
        });
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden font-sans">
            <Toast />
            <style>{`
                .sidebar-scroll::-webkit-scrollbar {
                    width: 4px;
                }
                .sidebar-scroll::-webkit-scrollbar-track {
                    background: transparent;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 2px;
                }
                .sidebar-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .sidebar-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 transparent;
                    direction: rtl;
                }
                .sidebar-scroll > nav {
                    direction: ltr;
                }
                .content-scroll::-webkit-scrollbar {
                    width: 6px;
                }
                .content-scroll::-webkit-scrollbar-track {
                    background: #f1f5f9;
                }
                .content-scroll::-webkit-scrollbar-thumb {
                    background: #cbd5e1;
                    border-radius: 3px;
                }
                .content-scroll::-webkit-scrollbar-thumb:hover {
                    background: #94a3b8;
                }
                .content-scroll {
                    scrollbar-width: thin;
                    scrollbar-color: #cbd5e1 #f1f5f9;
                }
                .product-swiper .swiper-button-next,
                .product-swiper .swiper-button-prev {
                    color: #444;
                    background: rgba(255, 255, 255, 0.7);
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                }
                .product-swiper .swiper-button-next:after,
                .product-swiper .swiper-button-prev:after {
                    font-size: 10px;
                    font-weight: bold;
                }
                .product-swiper .swiper-pagination-bullet-active {
                    background: #ef4444;
                }
                .detail-swiper .swiper-button-next,
                .detail-swiper .swiper-button-prev {
                    width: 32px;
                    height: 32px;
                }
                .detail-swiper .swiper-button-next:after,
                .detail-swiper .swiper-button-prev:after {
                    font-size: 14px;
                }
            `}</style>

            {/* Header */}
            <header className="bg-white border-b border-gray-200 z-50 flex-shrink-0">
                <div className="px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
                            <img src="/logo.svg" alt="A-toys" className="h-9 w-auto" />
                        </Link>
                        
                        <div className="flex items-stretch h-full">
                            <a href="https://yandex.by/maps/-/CHe9n0p-" target="_blank" className="flex flex-col items-center justify-center gap-1 px-3 md:px-6 hover:bg-gray-50 transition-colors border-l border-gray-100">
                                <Icons.MapPin className="w-5 h-5 text-gray-400" />
                                <span className="text-[10px] font-medium text-gray-500">Мы здесь</span>
                            </a>
                            <Link 
                                href="/about" 
                                className={`flex flex-col items-center justify-center gap-1 px-3 md:px-6 transition-colors border-l border-gray-100 ${
                                    isAboutPage ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-500'
                                }`}
                            >
                                <Icons.HelpCircle className={`w-5 h-5 ${isAboutPage ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className={`text-[10px] font-medium ${isAboutPage ? 'text-red-600' : 'text-gray-500'}`}>О нас</span>
                            </Link>
                            <a href="tel:+375295008990" className="flex flex-col items-center justify-center gap-1 px-3 md:px-6 hover:bg-gray-50 transition-colors border-l border-gray-100">
                                <Icons.Phone className="w-5 h-5 text-gray-400" />
                                <span className="text-[10px] font-medium text-gray-500">Позвонить</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-20 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto sidebar-scroll">
                    <nav className="py-2">
                        <Link
                            href="/catalog"
                            className={`w-full flex flex-col items-center gap-1 px-2 py-3 transition-colors ${
                                !selectedCategory
                                    ? 'bg-red-50 text-red-700 border-r-2 border-red-500'
                                    : 'text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Icons.Home className="w-5 h-5 flex-shrink-0" />
                            <span className="text-[9px] font-medium leading-tight text-center break-all line-clamp-2 max-w-full overflow-hidden">
                                Все
                            </span>
                        </Link>
                        {categories.map(cat => {
                            if (cat.id === 2) console.log('Category 2 data:', cat);
                            const Icon = getCategoryIcon(cat.name);
                            const isActive = selectedCategory == cat.id || selectedCategory == cat.name;
                            return (
                                <Link
                                    key={cat.id}
                                    href={`/catalog?category=${cat.id}`}
                                    className={`w-full flex flex-col items-center gap-1 px-2 py-3 transition-colors ${
                                        isActive
                                            ? 'bg-red-50 text-red-700 border-r-2 border-red-500'
                                            : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                                    title={cat.name}
                                >
                                    {cat.icon ? (
                                        <img 
                                            src={cat.icon_url || `/storage/${cat.icon}`} 
                                            alt={cat.name} 
                                            className="w-10 h-10 flex-shrink-0 object-contain mb-1" 
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '/icons/package.svg'; // Fallback if image fails
                                            }}
                                        />
                                    ) : (
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                    )}
                                    <span className="text-[9px] font-medium leading-tight text-center break-all line-clamp-2 max-w-full overflow-hidden">
                                        {cat.name}
                                    </span>
                                </Link>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Sort & Search Header */}
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
                                            className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                                                isListening 
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
                                                                        className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                                                                            isFavorite(prod.id) ? 'bg-red-50' : 'bg-gray-100 hover:bg-gray-200'
                                                                        }`}
                                                                    >
                                                                        <Icons.Heart className={`w-4 h-4 ${isFavorite(prod.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
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

                                {usePage().component === 'Catalog' && (
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
                                                        className={`w-full px-4 py-2.5 text-left text-sm transition-colors flex items-center justify-between ${
                                                            currentSort === option.value 
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
                                )}
                            </div>
                        </div>
                    </div>
                    {children}
                </div>
            </div>

            {/* Footer Navigation */}
            <nav className="bg-white border-t border-gray-200 z-50 flex-shrink-0">
                <div className="flex items-center justify-center px-2 py-2 relative h-16">
                    <div className="flex items-center gap-12 max-w-md">
                        <Link href="/favorites" className="flex flex-col items-center gap-1 relative group">
                            <div className="relative">
                                <Icons.Heart className="w-6 h-6 text-gray-700" />
                                {favoritesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                                        {favoritesCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-medium text-gray-700 leading-tight text-center">Избранное</span>
                        </Link>

                        <button className="flex flex-col items-center gap-1 relative -mt-8">
                            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all active:scale-95 border-4 border-white relative">
                                <Icons.MessageCircle className="w-7 h-7 text-white" />
                                {chatQueueCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold border-2 border-white">
                                        {chatQueueCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-medium text-gray-700 leading-tight text-center mt-1">Чат</span>
                        </button>

                        <Link href="/cart" className="flex flex-col items-center gap-1 relative group">
                            <div className="relative">
                                <Icons.ShoppingCart className="w-6 h-6 text-gray-700" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </div>
                            <span className="text-[9px] font-medium text-gray-700 leading-tight text-center">Корзина</span>
                        </Link>
                    </div>
                </div>
            </nav>
        </div>
    );
};

export default MainLayout;


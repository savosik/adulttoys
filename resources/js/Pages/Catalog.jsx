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
    ArrowUpDown: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21 16-4 4-4-4"/><path d="M17 20V4"/><path d="m3 8 4-4 4 4"/><path d="M7 4v16"/></svg>
    ),
    ChevronLeft: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
    ),
    ChevronRight: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6"/></svg>
    ),
    Heart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
    ),
    Star: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
    ),
    ShoppingCart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
    ),
    ArrowUp: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 15-6-6-6 6"/></svg>
    ),
    Tag: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/></svg>
    ),
    MessageCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
    ),
    Search: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
    ),
    Mic: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/></svg>
    ),
};

const Catalog = (props) => {
    const { products, categories, subCategories = [], filters } = props;
    
    // Zustand store
    const [items, setItems] = useState(products?.data || []);
    const [isLoading, setIsLoading] = useState(false);
    const [showAllSubCategories, setShowAllSubCategories] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    
    // Sub-category state (multi-select)
    const [selectedSubCategories, setSelectedSubCategories] = useState(new Set(
        filters.sub_category ? String(filters.sub_category).split(',') : []
    ));

    // Update sub-categories when filters change
    useEffect(() => {
        setSelectedSubCategories(new Set(
            filters.sub_category ? String(filters.sub_category).split(',') : []
        ));
    }, [filters.sub_category]);

    const toggleSubCategory = (subCategoryId) => {
        const idStr = String(subCategoryId);
        const newSelected = new Set(selectedSubCategories);
        
        if (newSelected.has(idStr)) {
            newSelected.delete(idStr);
        } else {
            newSelected.add(idStr);
        }
        
        setSelectedSubCategories(newSelected);
        
        // Sync with URL
        const subCategoryParam = Array.from(newSelected).join(',');
        const url = filters.category ? `/category/${filters.category}` : '/';
        
        router.get(url, { 
            ...filters, 
            category: undefined, // It's in the path now
            sub_category: subCategoryParam || undefined 
        }, { 
            preserveState: true, 
            preserveScroll: true,
            replace: true 
        });
    };
    
    // Search state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const searchRef = useRef(null);
    const recognitionRef = useRef(null);
    const sortDropdownRef = useRef(null);
    const loadMoreRef = useRef(null);
    const scrollRef = useRef(null);

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

    // Zustand store
    const addToCart = useStore((state) => state.addToCart);
    const incrementCartQuantity = useStore((state) => state.incrementCartQuantity);
    const decrementCartQuantity = useStore((state) => state.decrementCartQuantity);
    const toggleFavorite = useStore((state) => state.toggleFavorite);
    const favorites = useStore((state) => state.favorites);
    const isFavorite = (id) => favorites.some(f => f.id === id);
    const toggleChatQueue = useStore((state) => state.toggleChatQueue);
    const cart = useStore((state) => state.cart);
    const chatQueue = useStore((state) => state.chatQueue);

    // Event handlers to prevent link navigation
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

    // Sync items when products prop changes
    useEffect(() => {
        if (!products) return;
        
        if (products.current_page === 1) {
            setItems(products.data || []);
        } else {
            setItems(prev => [...prev, ...(products.data || [])]);
        }
        setIsLoading(false);
    }, [products]);

    // Intersection Observer for Infinite Scroll
    useEffect(() => {
        if (!products) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && products.next_page_url && !isLoading) {
                    setIsLoading(true);
                    router.get(products.next_page_url, {}, {
                        preserveState: true,
                        preserveScroll: true,
                        only: ['products'],
                    });
                }
            },
            { threshold: 0.1 }
        );

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [products?.next_page_url, isLoading]);

    // Scroll Top visibility
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        setShowScrollTop(scrollTop > 500);
    };

    const scrollToTop = () => {
        scrollRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <MainLayout>
            <>
            <Head title="Каталог" />
            
            {/* Content Area */}
            <main 
                ref={scrollRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto content-scroll relative"
            >
                <div className="p-4">
                        {/* Multi-select Tags UX */}
                        {subCategories.length > 0 && (
                            <div className="mb-6">
                                <div className="flex flex-wrap gap-2">
                                    {subCategories.map((category, index) => {
                                        const isActive = selectedSubCategories.has(String(category.id));
                                        const isHidden = !showAllSubCategories && index >= 5;
                                        
                                        return (
                                            <button 
                                                key={category.id}
                                                onClick={() => toggleSubCategory(category.id)}
                                                className={`px-3 py-1.5 rounded-lg text-[9px] font-bold transition-all border text-left leading-none items-center gap-1.5 break-words flex-shrink-0 max-w-[180px] sm:max-w-none ${
                                                    isHidden ? 'hidden' : 'flex'
                                                } ${
                                                    isActive 
                                                        ? 'bg-red-700 text-white border-red-700 shadow-sm' 
                                                        : 'bg-white border-gray-200 text-gray-500 hover:border-red-300'
                                                }`}
                                            >
                                                <span>{category.name}</span>
                                                {isActive && (
                                                    <svg className="w-2.5 h-2.5 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {subCategories.length > 5 && (
                                    <button 
                                        onClick={() => setShowAllSubCategories(!showAllSubCategories)}
                                        className="w-full mt-4 py-2 bg-gray-50/50 rounded-xl text-red-500 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-100 hover:text-red-700 transition-all border border-transparent hover:border-gray-200"
                                    >
                                        <span>{showAllSubCategories ? 'Скрыть лишнее' : `Все подкатегории (${subCategories.length})`}</span>
                                        <svg 
                                            className={`w-3.5 h-3.5 transition-transform duration-500 ${showAllSubCategories ? 'rotate-180' : ''}`} 
                                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"
                                        >
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Products Grid */}
                        {items.length > 0 ? (
                            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-4">
                                {items.map((product) => {
                                const images = [
                                    product.image_main,
                                    ...(product.additional_images || []).map(img => img.url)
                                ].filter(Boolean);
                                
                                if (images.length === 0) {
                                    images.push('https://placehold.co/400x400/e5e7eb/6b7280?text=No+Image');
                                }

                                // Build product URL with filters
                                const productUrl = (() => {
                                    const params = new URLSearchParams();
                                    if (filters.category) params.set('category', filters.category);
                                    if (filters.sub_category) params.set('sub_category', filters.sub_category);
                                    if (filters.brand) params.set('brand', filters.brand);
                                    if (filters.search) params.set('search', filters.search);
                                    if (filters.sort) params.set('sort', filters.sort);
                                    
                                    const queryString = params.toString();
                                    return `/product/${product.slug}${queryString ? '?' + queryString : ''}`;
                                })();

                                return (
                                    <Link 
                                        key={product.id} 
                                        href={productUrl}
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
                                                    className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                                        isFavorite(product.id)
                                                        ? 'bg-red-50 border border-red-200'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                    }`}
                                                >
                                                    <Icons.Heart 
                                                        className={`w-5 h-5 transition-all ${
                                                            isFavorite(product.id) 
                                                            ? 'fill-red-500 stroke-red-500' 
                                                            : 'text-gray-600'
                                                        }`} 
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
                                                            className={`flex-1 py-2.5 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
                                                                product.stock <= 0
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
                                                            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                                                                isInChat
                                                                ? 'bg-red-50 border border-red-200'
                                                                : 'bg-gray-100 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            <Icons.MessageCircle className={`w-5 h-5 transition-all ${
                                                                isInChat
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
                        ) : !isLoading && (
                            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <Icons.Search className="w-10 h-10 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">Ничего не найдено</h3>
                                <p className="text-sm text-gray-500 max-w-xs">
                                    Попробуйте изменить запрос или сбросить фильтры
                                </p>
                                <button
                                    onClick={() => router.get('/')}
                                    className="mt-6 px-6 py-2 bg-red-500 text-white rounded-xl text-sm font-bold hover:bg-red-600 transition-colors"
                                >
                                    Сбросить все
                                </button>
                            </div>
                        )}

                        {/* Infinite Scroll Trigger */}
                        <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-4">
                            {isLoading && (
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Back to Top Button */}
                    <button
                        onClick={scrollToTop}
                        className={`fixed bottom-24 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50 border border-gray-100 ${
                            showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                        }`}
                    >
                        <Icons.ArrowUp className="w-6 h-6 text-red-700" />
                    </button>
            </main>
            </>
        </MainLayout>
    );
};

export default Catalog;


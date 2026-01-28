import React, { useState, useEffect, useRef } from 'react';
import { Link, usePage, router, Head } from '@inertiajs/react';
import axios from 'axios';
import useStore from '@/store/useStore';
import Toast from '@/components/Toast';
import TypingText from '@/components/TypingText';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
// Simplified SVG Icons to mimic lucide-react
const Icons = {
    Search: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
    ),
    Phone: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    ),
    Store: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" /><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" /><path d="M2 7h20" /><path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12a2 2 0 0 1-2-2V7" /></svg>
    ),
    Home: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    Package: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m7.5 4.27 9 5.15" /><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" /><path d="m3.27 6.96 8.73 5.05 8.73-5.05" /><path d="M12 22.08V12" /></svg>
    ),
    Smartphone: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="14" height="20" x="5" y="2" rx="2" ry="2" /><path d="M12 18h.01" /></svg>
    ),
    Monitor: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="3" rx="2" /><line x1="8" x2="16" y1="21" y2="21" /><line x1="12" x2="12" y1="17" y2="21" /></svg>
    ),
    Headphones: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3" /></svg>
    ),
    Watch: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="7" /><polyline points="12 9 12 12 13.5 13.5" /><path d="M16.51 17.35 18.5 21a2 2 0 0 0 1.72 1h.5a2 2 0 0 0 2-2v-3.51" /><path d="M18.5 3a2 2 0 0 1 1.72 1l1.99 3.51V11a2 2 0 0 1-2 2h-.5a2 2 0 0 1-1.72-1L16.51 6.65" /><path d="M7.49 17.35 5.5 21a2 2 0 0 1-1.72 1h-.5a2 2 0 0 1-2-2v-3.51" /><path d="M5.5 3a2 2 0 0 0-1.72 1L1.79 7.51V11a2 2 0 0 0 2 2h.5a2 2 0 0 0 1.72-1L7.49 6.65" /></svg>
    ),
    Tag: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
    ),
    Shirt: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z" /></svg>
    ),
    Zap: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
    ),
    Heart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
    ),
    ShoppingCart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" /><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" /></svg>
    ),
    User: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    LayoutGrid: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="7" height="7" x="3" y="3" rx="1" /><rect width="7" height="7" x="14" y="3" rx="1" /><rect width="7" height="7" x="14" y="14" rx="1" /><rect width="7" height="7" x="3" y="14" rx="1" /></svg>
    ),
    MessageCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
    ),
    MapPin: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>
    ),
    HelpCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" x2="12.01" y1="17" y2="17" /></svg>
    ),
    ClipboardList: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="8" height="4" x="8" y="2" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>
    ),
    Droplets: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7 16.3c2.2 0 4-1.8 4-4 0-3.3-4-6-4-6s-4 2.7-4 6c0 2.2 1.8 4 4 4Z" /><path d="M17 18.3c1.7 0 3-1.3 3-3 0-2.5-3-4.5-3-4.5s-3 2-3 4.5c0 1.7 1.3 3 3 3Z" /></svg>
    ),
    Shield: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1-1z" /></svg>
    ),
    Activity: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
    ),
    Mic: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" /><path d="M19 10v2a7 7 0 0 1-14 0v-2" /><line x1="12" x2="12" y1="19" y2="22" /></svg>
    ),
    ArrowUpDown: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m21 16-4 4-4-4" /><path d="M17 20V4" /><path d="m3 8 4-4 4 4" /><path d="M7 4v16" /></svg>
    ),
    ArrowUp: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m18 15-6-6-6 6" /></svg>
    ),
    Star: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    ),
    Menu: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
    ),
    X: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    ),
    ChevronRight: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m9 18 6-6-6-6" /></svg>
    ),
};

const getCategoryIcon = (name = '') => {
    if (!name) return Icons.Package;
    const lowerName = name.toLowerCase();
    if (lowerName.includes('игруш')) return Icons.Package;
    if (lowerName.includes('одежд') || lowerName.includes('бель')) return Icons.Shirt;
    if (lowerName.includes('вибр') || lowerName.includes('стимул') || lowerName.includes('электро')) return Icons.Zap;
    if (lowerName.includes('космет') || lowerName.includes('гель') || lowerName.includes('смазк')) return Icons.Droplets;
    if (lowerName.includes('презерв')) return Icons.Shield;
    if (lowerName.includes('тренаж') || lowerName.includes('бад')) return Icons.Activity;

    return Icons.Package;
};

const SortableSidebarItem = ({ category, isActive, isSortingMode, isHidingMode, onToggleHidden }) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: category.id, disabled: !isSortingMode });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
        position: 'relative',
        opacity: isDragging ? 0.5 : (category.is_hidden && isHidingMode ? 0.5 : 1),
        filter: category.is_hidden && isHidingMode ? 'grayscale(100%)' : 'none',
    };

    const Icon = getCategoryIcon(category.name);

    // In hiding mode, we also want to prevent navigation, so use 'div'.
    const Tag = (isSortingMode || isHidingMode) ? 'div' : Link;
    const tagProps = (isSortingMode || isHidingMode) ? {} : { href: `/category/${category.slug}` };

    const handleClick = (e) => {
        if (isSortingMode) {
            e.preventDefault();
        }
        if (isHidingMode) {
            e.preventDefault();
            onToggleHidden(category);
        }
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Tag
                {...tagProps}
                onClick={handleClick}
                className={`w-full flex flex-col md:flex-row items-center gap-1 md:gap-2 px-1 md:px-2 py-3 md:py-1 transition-colors border-b border-gray-100 select-none ${isActive
                    ? 'bg-red-50 text-red-700'
                    : 'text-gray-600 hover:bg-gray-50'
                    } ${(isSortingMode || isHidingMode) ? 'cursor-pointer' : ''} ${isSortingMode ? 'cursor-move' : ''}`}
                title={category.name}
            >
                {/* ICON BLOCK */}
                {category.icon ? (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 overflow-hidden relative">
                        <img
                            src={category.icon_url || `/storage/${category.icon}`}
                            alt={category.name}
                            className={`w-full h-full object-contain relative z-10 ${isActive ? 'mix-blend-multiply' : ''}`}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/icons/package.svg';
                                e.target.style.padding = '8px';
                            }}
                            draggable={false}
                        />
                        {/* Hidden Indicator Overlay */}
                        {Boolean(category.is_hidden) && isHidingMode && (
                            <div className="absolute inset-0 bg-gray-500/50 flex items-center justify-center z-20">
                                <Icons.X className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center flex-shrink-0 relative">
                        {Icon && typeof Icon === 'function' ? <Icon className="w-5 h-5" /> : <Icons.Package className="w-5 h-5" />}
                        {Boolean(category.is_hidden) && isHidingMode && (
                            <div className="absolute inset-0 bg-gray-500/50 rounded-full flex items-center justify-center z-20">
                                <Icons.X className="w-6 h-6 text-white" />
                            </div>
                        )}
                    </div>
                )}

                {/* TEXT BLOCK */}
                <div className="flex-1 min-w-0 w-full md:w-auto">
                    <p className={`text-[9px] font-medium leading-tight text-center md:text-left line-clamp-2 ${category.is_hidden && isHidingMode ? 'line-through text-gray-400' : ''}`}>
                        {category.name}
                    </p>
                </div>
            </Tag>
        </div>
    );
};

const MainLayout = ({ children, filters: propsFilters }) => {
    const { categories = [], sidebarCategories = [], filters: pageFilters = {}, cart: pageCart = [], chatQueue: pageChatQueue = [], appName, brands = [] } = usePage().props;
    const { component, url } = usePage();

    // Schema.org Organization Data
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Store",
        "name": "A-Toys",
        "url": typeof window !== 'undefined' ? window.location.origin : 'https://a-toys.by',
        "logo": typeof window !== 'undefined' ? `${window.location.origin}/logo.svg` : 'https://a-toys.by/logo.svg',
        "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+375-29-500-89-90",
            "contactType": "customer service",
            "areaServed": "BY",
            "availableLanguage": "Russian"
        },
        "address": {
            "@type": "PostalAddress",
            "streetAddress": "пр-т Победителей 57 оф. 16Н",
            "addressLocality": "Минск",
            "addressRegion": "Минская область",
            "postalCode": "220035",
            "addressCountry": "BY"
        }
    };

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
    const showNotification = useStore((state) => state.showNotification);
    const cart = useStore((state) => state.cart);
    const chatQueue = useStore((state) => state.chatQueue);

    // Search state
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [suggestions, setSuggestions] = useState({ products: [], categories: [] });
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [showCallModal, setShowCallModal] = useState(false);
    const [showMenuPanel, setShowMenuPanel] = useState(false);
    const [menuActiveTab, setMenuActiveTab] = useState('categories');
    const [activeCategory, setActiveCategory] = useState(null);
    const [expandedMobileCategory, setExpandedMobileCategory] = useState(null);
    const searchRef = useRef(null);
    const recognitionRef = useRef(null);
    const sortDropdownRef = useRef(null);
    const contentRef = useRef(null);

    // Sortable state
    const [sidebarItems, setSidebarItems] = useState(sidebarCategories.length > 0 ? sidebarCategories : categories.flatMap(cat => cat.children || []));
    const [isSortingMode, setIsSortingMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('category_sort') === '1';
        }
        return false;
    });
    const [isHidingMode, setIsHidingMode] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('category_hide') === '1';
        }
        return false;
    });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const params = new URLSearchParams(window.location.search);
            if (params.has('category_sort')) {
                const sortParam = params.get('category_sort');
                const newMode = sortParam === '1';
                setIsSortingMode(newMode);
                // If turning on sort, turn off hide
                if (newMode) setIsHidingMode(false);
                localStorage.setItem('category_sort', newMode ? '1' : '0');
                if (newMode) localStorage.setItem('category_hide', '0');
            }
            if (params.has('category_hide')) {
                const hideParam = params.get('category_hide');
                const newMode = hideParam === '1';
                setIsHidingMode(newMode);
                // If turning on hide, turn off sort
                if (newMode) setIsSortingMode(false);
                localStorage.setItem('category_hide', newMode ? '1' : '0');
                if (newMode) localStorage.setItem('category_sort', '0');
            }
        }
    }, [url]);

    const handleToggleHidden = (category) => {
        // Optimistic update
        setSidebarItems(items => items.map(item =>
            item.id === category.id ? { ...item, is_hidden: !item.is_hidden } : item
        ));

        axios.post('/categories/toggle-hidden', { id: category.id })
            .then(res => {
                showNotification('Видимость обновлена', 'success');
            })
            .catch(err => {
                console.error(err);
                // Revert
                setSidebarItems(items => items.map(item =>
                    item.id === category.id ? { ...item, is_hidden: !item.is_hidden } : item
                ));
            });
    };

    useEffect(() => {
        if (sidebarCategories.length > 0) {
            setSidebarItems(sidebarCategories);
        } else {
            setSidebarItems(categories.flatMap(cat => cat.children || []));
        }
    }, [sidebarCategories, categories]);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event) => {
        if (!isSortingMode) return;
        const { active, over } = event;

        if (active.id !== over.id) {
            setSidebarItems((items) => {
                const oldIndex = items.findIndex((item) => item.id === active.id);
                const newIndex = items.findIndex((item) => item.id === over.id);

                const newItems = arrayMove(items, oldIndex, newIndex);

                // Save to backend
                const reorderedData = newItems.map((item, index) => ({
                    id: item.id,
                    sort_order: index
                }));

                axios.post('/categories/reorder', { categories: reorderedData })
                    .catch(error => {
                        console.error('Failed to save order', error);
                        // Optional: revert state on error
                    });

                return newItems;
            });
        }
    };

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

    // Set default active category
    useEffect(() => {
        if (categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0]);
        }
    }, [categories]);

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
                router.get('/', { search: transcript }, {
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
        // Search is always global for better UX
        if (searchQuery.trim()) {
            router.get('/', { search: searchQuery }, {
                preserveState: false,
                preserveScroll: false,
                replace: false
            });
        } else {
            router.get('/', { search: undefined }, {
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
        const url = filters.category ? `/category/${filters.category}` : '/';
        router.get(url, { ...filters, category: undefined, sort: value }, {
            preserveState: true,
            preserveScroll: true,
            replace: true
        });
    };

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        setShowScrollTop(scrollTop > 500);
    };

    const scrollToTop = () => {
        contentRef.current?.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="h-screen bg-gray-50 flex flex-col overflow-hidden font-sans">
            <Head>
                <script type="application/ld+json">
                    {JSON.stringify(organizationSchema)}
                </script>
            </Head>
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
                .sidebar-scroll > * {
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

            {/* Call Modal */}
            {showCallModal && (
                <div
                    className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onClick={() => setShowCallModal(false)}
                >
                    <div
                        className="bg-white rounded-3xl w-full max-w-xs overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-8 text-center">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Icons.Phone className="w-8 h-8 text-red-500" />
                            </div>

                            <h3 className="text-xl font-bold text-gray-900 mb-2">Наш номер</h3>
                            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                                Мы работаем ежедневно<br />
                                <span className="font-semibold text-gray-900">с 10:00 до 20:00</span>
                            </p>

                            <div className="text-2xl font-bold text-gray-900 mb-8 tracking-tight">
                                +375 (29) 500-89-90
                            </div>

                            <div className="grid gap-3">
                                <a
                                    href="tel:+375295008990"
                                    className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-200 active:scale-95 flex items-center justify-center gap-2"
                                >
                                    <Icons.Phone className="w-5 h-5" />
                                    Позвонить
                                </a>
                                <button
                                    onClick={() => setShowCallModal(false)}
                                    className="w-full py-4 text-gray-400 font-medium hover:text-gray-600 transition-colors"
                                >
                                    Отмена
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Menu Panel */}
            {showMenuPanel && (
                <div className="fixed inset-0 z-[100] flex justify-center items-start pt-4 sm:pt-24 px-2 sm:px-4 pb-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setShowMenuPanel(false)}
                    />

                    {/* Panel */}
                    <div className="relative w-full max-w-5xl bg-white shadow-2xl rounded-2xl flex flex-col max-h-[calc(100vh-2rem)] sm:max-h-[85vh] overflow-hidden animate-in zoom-in-95 duration-200">
                        {/* Header Tabs */}
                        <div className="flex items-center justify-between px-6 pt-4 border-b border-gray-100">
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setMenuActiveTab('categories')}
                                    className={`pb-4 text-sm font-bold transition-all relative ${menuActiveTab === 'categories'
                                        ? 'text-red-600'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    По категориям
                                    {menuActiveTab === 'categories' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-t-full"></div>
                                    )}
                                </button>
                                <button
                                    onClick={() => setMenuActiveTab('brands')}
                                    className={`pb-4 text-sm font-bold transition-all relative ${menuActiveTab === 'brands'
                                        ? 'text-red-600'
                                        : 'text-gray-400 hover:text-gray-600'
                                        }`}
                                >
                                    По брендам
                                    {menuActiveTab === 'brands' && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-600 rounded-t-full"></div>
                                    )}
                                </button>
                            </div>
                            <button
                                onClick={() => setShowMenuPanel(false)}
                                className="p-2 -mr-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors mb-2"
                            >
                                <Icons.X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto">
                            {menuActiveTab === 'categories' ? (
                                <>
                                    {/* Mobile Accordion Layout */}
                                    <div className="md:hidden h-full overflow-y-auto content-scroll">
                                        <div className="p-4 space-y-2">
                                            <Link
                                                href="/"
                                                onClick={() => setShowMenuPanel(false)}
                                                className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl text-gray-700 font-medium"
                                            >
                                                <Icons.LayoutGrid className="w-5 h-5 text-red-500" />
                                                Все категории
                                            </Link>

                                            {categories.map((cat) => {
                                                const Icon = getCategoryIcon(cat.name);
                                                const isExpanded = expandedMobileCategory === cat.id;

                                                return (
                                                    <div key={cat.id} className="bg-gray-50 rounded-xl overflow-hidden">
                                                        <button
                                                            onClick={() => setExpandedMobileCategory(isExpanded ? null : cat.id)}
                                                            className="w-full flex items-center gap-3 px-4 py-3 text-left"
                                                        >
                                                            {cat.icon ? (
                                                                <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0">
                                                                    <img
                                                                        src={cat.icon_url || `/storage/${cat.icon}`}
                                                                        alt=""
                                                                        className="w-full h-full object-contain"
                                                                    />
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-8 rounded-lg bg-white text-gray-500 flex items-center justify-center flex-shrink-0">
                                                                    {Icon && typeof Icon === 'function' ? (
                                                                        <Icon className="w-5 h-5" />
                                                                    ) : (
                                                                        <Icons.Package className="w-5 h-5" />
                                                                    )}
                                                                </div>
                                                            )}
                                                            <span className={`flex-1 text-sm font-medium ${isExpanded ? 'text-red-600' : 'text-gray-700'}`}>
                                                                {cat.name}
                                                            </span>
                                                            <Icons.ChevronRight className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                                                        </button>

                                                        {isExpanded && cat.children && cat.children.length > 0 && (
                                                            <div className="px-4 pb-4 pt-1 space-y-1 bg-white/50">
                                                                <Link
                                                                    href={`/category/${cat.slug}`}
                                                                    onClick={() => setShowMenuPanel(false)}
                                                                    className="block px-3 py-2 text-sm text-red-600 font-medium rounded-lg hover:bg-red-50"
                                                                >
                                                                    Все в «{cat.name}»
                                                                </Link>
                                                                {cat.children.map(child => (
                                                                    <div key={child.id}>
                                                                        <Link
                                                                            href={`/category/${child.slug}`}
                                                                            onClick={() => setShowMenuPanel(false)}
                                                                            className="block px-3 py-2 text-sm font-medium text-gray-800 rounded-lg hover:bg-gray-100"
                                                                        >
                                                                            {child.name}
                                                                        </Link>
                                                                        {child.children && child.children.length > 0 && (
                                                                            <div className="ml-4 space-y-0.5">
                                                                                {child.children.map(subChild => (
                                                                                    <Link
                                                                                        key={subChild.id}
                                                                                        href={`/category/${subChild.slug}`}
                                                                                        onClick={() => setShowMenuPanel(false)}
                                                                                        className="block px-3 py-1.5 text-xs text-gray-500 rounded hover:text-red-600"
                                                                                    >
                                                                                        {subChild.name}
                                                                                    </Link>
                                                                                ))}
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Desktop Two-Column Layout */}
                                    <div className="hidden md:flex h-full">
                                        {/* Sidebar (Left Column) */}
                                        <div className="w-64 md:w-72 bg-gray-50/50 border-r border-gray-100 overflow-y-auto p-3 space-y-1 content-scroll">
                                            <Link
                                                href="/"
                                                onClick={() => setShowMenuPanel(false)}
                                                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${!selectedCategory && !activeCategory
                                                    ? 'bg-white shadow text-red-600 font-bold'
                                                    : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                    }`}
                                            >
                                                <div className="w-8 h-8 rounded-lg bg-red-50 text-red-500 flex items-center justify-center">
                                                    <Icons.LayoutGrid className="w-5 h-5" />
                                                </div>
                                                <span className="text-sm">Все категории</span>
                                            </Link>

                                            {categories.map((cat) => {
                                                const Icon = getCategoryIcon(cat.name);
                                                const isSelected = activeCategory?.id === cat.id;

                                                return (
                                                    <button
                                                        key={cat.id}
                                                        onClick={() => setActiveCategory(cat)}
                                                        onMouseEnter={() => setActiveCategory(cat)}
                                                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all text-left ${isSelected
                                                            ? 'bg-white shadow text-red-600 font-bold'
                                                            : 'text-gray-600 hover:bg-white hover:shadow-sm'
                                                            }`}
                                                    >
                                                        {cat.icon ? (
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center p-1.5 overflow-hidden flex-shrink-0">
                                                                <img
                                                                    src={cat.icon_url || `/storage/${cat.icon}`}
                                                                    alt=""
                                                                    className={`w-full h-full object-contain ${isSelected ? 'mix-blend-multiply' : ''}`}
                                                                    onError={(e) => {
                                                                        e.target.style.display = 'none';
                                                                    }}
                                                                />
                                                            </div>
                                                        ) : (
                                                            <div className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 flex items-center justify-center flex-shrink-0">
                                                                {Icon && typeof Icon === 'function' ? (
                                                                    <Icon className="w-5 h-5" />
                                                                ) : (
                                                                    <Icons.Package className="w-5 h-5" />
                                                                )}
                                                            </div>
                                                        )}
                                                        <span className="text-sm leading-tight flex-1">{cat.name}</span>
                                                        {isSelected && <Icons.ChevronRight className="w-4 h-4" />}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Main Content (Right Column) */}
                                        <div className="flex-1 overflow-y-auto p-6 lg:p-8 bg-white content-scroll">
                                            {activeCategory ? (
                                                <div className="animate-in fade-in slide-in-from-left-2 duration-300">
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">
                                                            {activeCategory.name}
                                                        </h2>
                                                        <Link
                                                            href={`/category/${activeCategory.slug}`}
                                                            onClick={() => setShowMenuPanel(false)}
                                                            className="px-4 py-1.5 bg-red-50 text-red-600 rounded-full text-xs font-bold hover:bg-red-100 transition-colors"
                                                        >
                                                            Смотреть все
                                                        </Link>
                                                    </div>

                                                    <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
                                                        {activeCategory.children && activeCategory.children.length > 0 ? (
                                                            activeCategory.children.map((child) => (
                                                                <div key={child.id} className="break-inside-avoid">
                                                                    <Link
                                                                        href={`/category/${child.slug}`}
                                                                        onClick={() => setShowMenuPanel(false)}
                                                                        className="font-bold text-gray-900 hover:text-red-600 transition-colors block mb-2 text-[15px]"
                                                                    >
                                                                        {child.name}
                                                                    </Link>
                                                                    {child.children && child.children.length > 0 && (
                                                                        <div className="space-y-1 mb-3">
                                                                            {child.children.map(subChild => (
                                                                                <Link
                                                                                    key={subChild.id}
                                                                                    href={`/category/${subChild.slug}`}
                                                                                    onClick={() => setShowMenuPanel(false)}
                                                                                    className="block text-sm text-gray-500 hover:text-red-600 transition-colors pl-1"
                                                                                >
                                                                                    {subChild.name}
                                                                                </Link>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))
                                                        ) : (
                                                            <div className="text-gray-500 italic">Нет подкатегорий</div>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="h-full flex flex-col items-center justify-center text-gray-400">
                                                    <Icons.LayoutGrid className="w-16 h-16 mb-4 opacity-50" />
                                                    <p>Выберите категорию</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <div className="h-full overflow-y-auto p-4 md:p-6 bg-white content-scroll">
                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4">
                                        {brands.map((brand) => (
                                            <Link
                                                key={brand.id}
                                                href={`/brand/${brand.slug}`}
                                                onClick={() => setShowMenuPanel(false)}
                                                className="group p-3 md:p-4 bg-gray-50 rounded-xl border border-transparent hover:border-red-200 hover:bg-red-50 hover:shadow-sm transition-all text-center flex flex-col items-center gap-2 md:gap-3"
                                            >
                                                <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center text-gray-400 group-hover:text-red-500 shadow-sm transition-colors">
                                                    <Icons.Tag className="w-5 h-5 md:w-6 md:h-6" />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-gray-900 text-xs md:text-sm mb-0.5">{brand.name}</div>
                                                    <div className="text-[9px] md:text-[10px] text-gray-500 group-hover:text-red-500/80 uppercase font-bold tracking-wider">
                                                        {brand.products_count} тов.
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
            }

            {/* Header */}
            <header className="bg-white border-b border-gray-200 z-50 flex-shrink-0">
                <div className="px-4">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
                                <div className="w-1.5 h-8 bg-red-500 rounded-full"></div>
                                <img src="/logo.svg" alt="A-toys" className="h-9 w-auto" />
                            </Link>
                            <div className="min-w-0 h-10 flex items-start pt-2.5 overflow-hidden">
                                <TypingText phrases={[
                                    "Продаем интимные товары с 2019 года",
                                    "Более 30 собственных товарных марок 18+",
                                    "Импортер интимных товаров в Беларусь",
                                    "Все товары в наличии на складе в Минске",
                                    "Посетите Склад шоурум г. Минск, Победителей 57"
                                ]} />
                            </div>
                        </div>

                        <div className="flex items-stretch h-full">
                            {(() => {
                                const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
                                const section = params.get('section');
                                const isWeAreHereActive = isAboutPage && section === 'we-are-here';
                                const isAboutActive = isAboutPage && !section;

                                return (
                                    <>
                                        <Link
                                            href="/about?section=we-are-here"
                                            className={`flex flex-col items-center justify-center gap-1 px-3 md:px-6 transition-colors border-l border-gray-100 ${isWeAreHereActive ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-500'
                                                }`}
                                        >
                                            <Icons.MapPin className={`w-5 h-5 ${isWeAreHereActive ? 'text-red-500' : 'text-gray-400'}`} />
                                            <span className={`text-[10px] font-medium ${isWeAreHereActive ? 'text-red-600' : 'text-gray-500'}`}>Мы здесь</span>
                                        </Link>
                                        <Link
                                            href="/about"
                                            className={`flex flex-col items-center justify-center gap-1 px-3 md:px-6 transition-colors border-l border-gray-100 ${isAboutActive ? 'bg-red-50 text-red-600' : 'hover:bg-gray-50 text-gray-500'
                                                }`}
                                        >
                                            <Icons.HelpCircle className={`w-5 h-5 ${isAboutActive ? 'text-red-500' : 'text-gray-400'}`} />
                                            <span className={`text-[10px] font-medium ${isAboutActive ? 'text-red-600' : 'text-gray-500'}`}>Инфо</span>
                                        </Link>
                                    </>
                                );
                            })()}
                            <button
                                onClick={() => setShowCallModal(true)}
                                className="flex flex-col items-center justify-center gap-1 px-3 md:px-6 hover:bg-gray-50 transition-colors border-l border-gray-100"
                            >
                                <Icons.Phone className="w-5 h-5 text-gray-400" />
                                <span className="text-[10px] font-medium text-gray-500">Позвонить</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-20 md:w-40 lg:w-52 bg-white border-r border-gray-200 flex-shrink-0 flex flex-col">
                    {/* Fixed Catalog Button - matches search header height */}
                    <button
                        onClick={() => setShowMenuPanel(true)}
                        className={`w-full flex flex-col md:flex-row items-center md:items-center justify-center gap-1 md:gap-2 px-1 md:px-2 h-16 flex-shrink-0 border-b border-gray-100 shadow-sm transition-colors ${showMenuPanel
                            ? 'bg-red-50 text-red-700'
                            : 'text-gray-600 hover:bg-gray-50'
                            }`}
                    >
                        <Icons.Menu className="w-5 h-5 flex-shrink-0" />
                        <span className="text-[9px] md:text-xs font-bold leading-tight text-center md:text-left">
                            Каталог
                        </span>
                    </button>

                    {/* Scrollable Categories */}
                    {/* Scrollable Categories */}
                    <nav className="flex-1 overflow-y-auto sidebar-scroll py-2">
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sidebarItems}
                                strategy={verticalListSortingStrategy}
                            >
                                {sidebarItems.map(cat => {
                                    const isActive = selectedCategory == cat.id || selectedCategory == cat.name || selectedCategory == cat.slug;
                                    return (
                                        <SortableSidebarItem
                                            key={cat.id}
                                            category={cat}
                                            isActive={isActive}
                                            isSortingMode={isSortingMode}
                                            isHidingMode={isHidingMode}
                                            onToggleHidden={handleToggleHidden}
                                        />
                                    );
                                })}
                            </SortableContext>
                        </DndContext>
                    </nav>
                </aside>

                {/* Main Content */}
                <div
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="flex-1 flex flex-col overflow-y-auto content-scroll"
                >
                    {/* Sort & Search Header */}
                    {!['Cart', 'Favorites'].includes(component) && (
                        <div className="bg-white shadow-sm flex-shrink-0 sticky top-0 z-20">
                            <div className="px-4 py-3 min-h-[64px] flex flex-col justify-center">
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

                                                                const cartItem = cart.find(item => item.id === prod.id);
                                                                const isInChat = chatQueue.some(item => item.id === prod.id);

                                                                return (
                                                                    <div key={prod.id} className="px-3 py-2 hover:bg-red-50 rounded-lg transition-colors">
                                                                        <div className="flex items-center gap-2">
                                                                            <Link
                                                                                href={prod.url}
                                                                                onClick={() => setShowSuggestions(false)}
                                                                                className="flex items-center gap-3 flex-1 min-w-0"
                                                                            >
                                                                                <div className="w-10 aspect-[2/3] bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex-shrink-0">
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

                                                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                                                {/* Favorites Button */}
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        toggleFavorite(productData);
                                                                                    }}
                                                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isFavorite(prod.id) ? 'bg-red-50 border border-red-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                                                >
                                                                                    <Icons.Heart className={`w-4 h-4 ${isFavorite(prod.id) ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
                                                                                </button>

                                                                                {/* Cart Button */}
                                                                                {cartItem ? (
                                                                                    <div className="flex items-center gap-1 bg-green-600 rounded-lg overflow-hidden h-8">
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault();
                                                                                                e.stopPropagation();
                                                                                                decrementCartQuantity(prod.id);
                                                                                            }}
                                                                                            className="w-8 h-8 flex items-center justify-center hover:bg-green-700 transition-colors text-white font-bold text-sm"
                                                                                        >
                                                                                            −
                                                                                        </button>
                                                                                        <div className="px-2 text-center text-white font-bold text-xs min-w-[20px]">
                                                                                            {cartItem.quantity}
                                                                                        </div>
                                                                                        <button
                                                                                            onClick={(e) => {
                                                                                                e.preventDefault();
                                                                                                e.stopPropagation();
                                                                                                incrementCartQuantity(prod.id);
                                                                                            }}
                                                                                            className="w-8 h-8 flex items-center justify-center hover:bg-green-700 transition-colors text-white font-bold text-sm"
                                                                                        >
                                                                                            +
                                                                                        </button>
                                                                                    </div>
                                                                                ) : (
                                                                                    <button
                                                                                        onClick={(e) => {
                                                                                            e.preventDefault();
                                                                                            e.stopPropagation();
                                                                                            if (productData.stock > 0) {
                                                                                                addToCart(productData);
                                                                                            }
                                                                                        }}
                                                                                        className="w-8 h-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                                                                                    >
                                                                                        <Icons.ShoppingCart className="w-4 h-4 text-gray-600" />
                                                                                    </button>
                                                                                )}

                                                                                {/* Chat Button */}
                                                                                <button
                                                                                    onClick={(e) => {
                                                                                        e.preventDefault();
                                                                                        e.stopPropagation();
                                                                                        toggleChatQueue(productData);
                                                                                    }}
                                                                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isInChat ? 'bg-red-50 border border-red-200' : 'bg-gray-100 hover:bg-gray-200'}`}
                                                                                >
                                                                                    <Icons.MessageCircle className={`w-4 h-4 ${isInChat ? 'fill-red-500 stroke-red-500' : 'text-gray-600'}`} />
                                                                                </button>
                                                                            </div>
                                                                        </div>
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
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                    {children}

                    {!['Cart', 'Favorites'].includes(component) && (
                        <footer className="bg-white border-t border-gray-100 mt-auto">
                            <div className="w-full px-6 md:px-12 py-6 md:py-8">
                                {/* Top Tier: Brand & Navigation */}
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-6 md:mb-8">
                                    {/* Brand */}
                                    <div className="flex-shrink-0">
                                        <Link href="/" className="flex items-center gap-3 group">
                                            <div className="w-1.5 h-6 bg-red-500 rounded-full transition-all group-hover:h-8"></div>
                                            <img src="/logo.svg" alt="A-toys" className="h-6 w-auto opacity-100 transition-opacity" />
                                        </Link>
                                    </div>

                                    {/* Navigation */}
                                    <nav className="flex flex-wrap gap-6 text-xs font-medium">
                                        <Link href="/about?section=delivery" className="text-gray-900 hover:text-red-600 transition-colors relative group">
                                            Доставка
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                                        </Link>
                                        <Link href="/about?section=payment" className="text-gray-900 hover:text-red-600 transition-colors relative group">
                                            Оплата
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                                        </Link>
                                        <Link href="/about" className="text-gray-900 hover:text-red-600 transition-colors relative group">
                                            Вопросы и ответы
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                                        </Link>
                                        <Link href="/about?section=we-are-here" className="text-gray-900 hover:text-red-600 transition-colors relative group">
                                            Как нас найти
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 transition-all group-hover:w-full"></span>
                                        </Link>
                                    </nav>
                                </div>

                                {/* Bottom Tier: Legal */}
                                <div className="flex flex-col md:flex-row justify-between items-end gap-4 text-[10px] text-gray-400 font-medium tracking-wide">
                                    <div className="space-y-1 max-w-xl flex flex-wrap gap-x-4">
                                        <span>ООО "Адалт Тойс", УНП 192825568.</span>
                                        <span>Зарегистрировано в Торговом реестре РБ 12.05.2019.</span>
                                        <span>Свидетельство о гос. регистрации выдано Мингорисполкомом.</span>
                                    </div>
                                    <div className="text-right whitespace-nowrap">
                                        <p>© 2019-{new Date().getFullYear()} A-Toys. Все права защищены. 18+</p>
                                    </div>
                                </div>
                            </div>
                        </footer>
                    )}

                    {/* Back to Top Button */}
                    <button
                        onClick={scrollToTop}
                        className={`fixed bottom-24 right-6 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-[60] border border-gray-100 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'
                            }`}
                    >
                        <Icons.ArrowUp className="w-6 h-6 text-red-700" />
                    </button>
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
        </div >
    );
};

export default MainLayout;


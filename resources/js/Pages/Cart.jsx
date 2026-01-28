import React, { useState, useEffect, useRef } from 'react';
import { IMaskInput } from 'react-imask';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import axios from 'axios';
import MapModal from '@/Components/MapModal';
import useStore from '@/store/useStore';
import OrderSuccessModal from '@/Components/OrderSuccessModal';

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
    Shield: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1-1z" /></svg>
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

    // Delivery state
    const pickupDelivery = useStore((state) => state.pickupDelivery);
    const setPickupDeliveryData = useStore((state) => state.setPickupDeliveryData);
    const pickupDeliveryErrors = useStore((state) => state.pickupDeliveryErrors);
    const validatePickupDelivery = useStore((state) => state.validatePickupDelivery);

    const clearCourierDeliveryData = useStore((state) => state.clearCourierDeliveryData);
    const clearPostDeliveryData = useStore((state) => state.clearPostDeliveryData);
    const clearPickupDeliveryData = useStore((state) => state.clearPickupDeliveryData);

    // Sorting state
    const [currentSort, setCurrentSort] = useState('latest');
    const [showSortDropdown, setShowSortDropdown] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successOrderId, setSuccessOrderId] = useState(null);
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

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    const handleCourierInputChange = (field, value) => {
        setCourierDeliveryData({ [field]: value });
    };

    const handlePickupInputChange = (field, value) => {
        setPickupDeliveryData({ [field]: value });
    };

    const handlePostInputChange = (field, value) => {
        setPostDeliveryData({ [field]: value });
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

    const handleOrderSubmit = async () => {
        if (!isCheckoutFormComplete()) return;

        let customerName = '';
        let customerPhone = '';
        let deliveryData = {};

        if (deliveryMethod === 'pickup') {
            customerName = pickupDelivery.name;
            customerPhone = pickupDelivery.phone;
            deliveryData = {
                comment: pickupDelivery.comment
            };
        } else if (deliveryMethod === 'courier') {
            customerName = courierDelivery.name;
            customerPhone = courierDelivery.phone;
            deliveryData = {
                address: courierDelivery.address,
                comment: courierDelivery.comment,
                mapLat: courierDelivery.mapLat,
                mapLng: courierDelivery.mapLng
            };
        } else if (deliveryMethod === 'post') {
            customerName = postDelivery.name;
            customerPhone = postDelivery.phone;
            deliveryData = {
                postalCode: postDelivery.postalCode,
                region: postDelivery.region,
                city: postDelivery.city,
                house: postDelivery.house,
                apartment: postDelivery.apartment,
                comment: postDelivery.comment
            };
        }

        const orderData = {
            cart: cart.map(item => ({
                id: item.id,
                quantity: item.quantity,
                price: item.price,
                name: item.name
            })),
            delivery_method: deliveryMethod,
            payment_method: 'on_receipt', // Default for now
            customer_name: customerName,
            customer_phone: customerPhone,
            delivery_data: deliveryData
        };

        try {
            const response = await axios.post('/order', orderData);
            if (response.data.success) {
                // Clear cart and state specific delivery data
                clearCart();
                clearCart();
                // Delivery data is intentionally preserved for future orders

                // Redirect or show success
                // For now, let's just alert or redirect to catalog
                // ideally show a success modal or page
                setSuccessOrderId(response.data.order_id);
                setIsSuccessModalOpen(true);
            }
        } catch (error) {
            console.error('Order error:', error);
            alert('Ошибка при оформлении заказа: ' + (error.response?.data?.message || error.message));
        }
    };

    // Check if checkout form is complete
    const isCheckoutFormComplete = () => {
        if (deliveryMethod === 'pickup') {
            return pickupDelivery.name &&
                pickupDelivery.phone &&
                !pickupDeliveryErrors.name &&
                !pickupDeliveryErrors.phone;
        }

        if (deliveryMethod === 'courier') {
            return courierDelivery.name &&
                courierDelivery.address &&
                courierDelivery.address.length >= 10 &&
                courierDelivery.phone &&
                !courierDeliveryErrors.name &&
                !courierDeliveryErrors.address &&
                !courierDeliveryErrors.phone;
        }

        if (deliveryMethod === 'post') {
            return postDelivery.name &&
                postDelivery.postalCode &&
                postDelivery.region &&
                postDelivery.city &&
                postDelivery.house &&
                postDelivery.apartment &&
                postDelivery.phone &&
                !postDeliveryErrors.name &&
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
        let missing = 0;

        if (deliveryMethod === 'pickup') {
            if (!pickupDelivery.name) missing++;
            if (!pickupDelivery.phone) missing++;
        }

        if (deliveryMethod === 'courier') {
            if (!courierDelivery.name) missing++;
            if (!courierDelivery.address || courierDelivery.address.length < 10) missing++;
            if (!courierDelivery.phone) missing++;
        }

        if (deliveryMethod === 'post') {
            if (!postDelivery.name) missing++;
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
                <div className="mx-auto p-4 md:p-6">
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
                                href="/"
                                className="inline-flex items-center justify-center px-8 py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20 active:scale-95"
                            >
                                Вернуться к покупкам
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Cart Items */}
                            <div className="lg:col-span-1 space-y-4">
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

                                    {/* Delivery Method Selection */}
                                    <div className="mb-6">


                                        {/* Tabs */}
                                        <div className="flex bg-gray-100 p-1 rounded-xl mb-4">
                                            <button
                                                onClick={() => setDeliveryMethod('pickup')}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'pickup'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <Icons.Package className="w-4 h-4" />
                                                <span className="hidden sm:inline">Самовывоз</span>
                                            </button>
                                            <button
                                                onClick={() => setDeliveryMethod('courier')}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'courier'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <Icons.Truck className="w-4 h-4" />
                                                <span className="hidden sm:inline">Курьер</span>
                                            </button>
                                            <button
                                                onClick={() => setDeliveryMethod('post')}
                                                className={`flex-1 py-2 px-3 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2 ${deliveryMethod === 'post'
                                                    ? 'bg-white text-gray-900 shadow-sm'
                                                    : 'text-gray-500 hover:text-gray-700'
                                                    }`}
                                            >
                                                <Icons.Mail className="w-4 h-4" />
                                                <span className="hidden sm:inline">Почта</span>
                                            </button>
                                        </div>

                                        {/* Selected Method Details & Forms */}
                                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 transition-all">
                                            {deliveryMethod === 'pickup' && (
                                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                            <Icons.MapPin className="w-4 h-4 text-red-500" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm text-gray-900">Пункт выдачи</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                г. Минск, пр-т Победителей 57, оф. 16Н
                                                                <span className="mx-2 text-gray-300">|</span>
                                                                <button
                                                                    onClick={() => setIsMapModalOpen(true)}
                                                                    className="text-red-500 hover:underline bg-transparent border-0 p-0 cursor-pointer"
                                                                >
                                                                    Открыть на карте
                                                                </button>
                                                            </div>
                                                            <div className="flex items-center gap-1.5 text-xs text-gray-500 mt-1.5">
                                                                <Icons.Clock className="w-3 h-3" />
                                                                <span>Пн-Пт: 10:00-18:00</span>
                                                            </div>
                                                            <div className="text-xs text-green-600 font-bold mt-2">Бесплатно</div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Ваше имя <span className="text-red-500">*</span></label>
                                                            <input
                                                                type="text"
                                                                value={pickupDelivery.name}
                                                                onChange={(e) => handlePickupInputChange('name', e.target.value)}
                                                                placeholder="Иван Иванов"
                                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${pickupDeliveryErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Телефон <span className="text-red-500">*</span></label>
                                                            <IMaskInput
                                                                mask="+{375} (00) 000-00-00"
                                                                type="tel"
                                                                value={pickupDelivery.phone}
                                                                onAccept={(value) => handlePickupInputChange('phone', value)}
                                                                placeholder="+375 (XX) XXX-XX-XX"
                                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${pickupDeliveryErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
                                                            />
                                                        </div>
                                                        <div className="md:col-span-2">
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Комментарий</label>
                                                            <input
                                                                type="text"
                                                                value={pickupDelivery.comment}
                                                                onChange={(e) => handlePickupInputChange('comment', e.target.value)}
                                                                placeholder="Комментарий к заказу"
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {deliveryMethod === 'courier' && (
                                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                            <Icons.Truck className="w-4 h-4 text-red-500" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm text-gray-900">Доставка курьером</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                {new Date().getHours() < 19 ? 'Сегодня' : 'Завтра'} c 18:00 до 21:00
                                                            </div>
                                                            <div className="text-xs mt-1">
                                                                {getCartTotal >= 100 ? (
                                                                    <span className="text-green-600 font-bold">Бесплатно</span>
                                                                ) : (
                                                                    <span className="text-gray-900 font-bold">15 BYN</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Ваше имя <span className="text-red-500">*</span></label>
                                                            <input
                                                                type="text"
                                                                value={courierDelivery.name}
                                                                onChange={(e) => handleCourierInputChange('name', e.target.value)}
                                                                placeholder="Иван Иванов"
                                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${courierDeliveryErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">
                                                                Адрес <span className="text-red-500">*</span> <span className="text-xs text-gray-400 font-normal">(Минск)</span>
                                                            </label>
                                                            <input
                                                                type="text"
                                                                value={courierDelivery.address}
                                                                onChange={(e) => handleCourierInputChange('address', e.target.value)}
                                                                placeholder="Улица, дом, квартира"
                                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${courierDeliveryErrors.address ? 'border-red-300' : 'border-gray-200'}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Телефон <span className="text-red-500">*</span></label>
                                                            <IMaskInput
                                                                mask="+{375} (00) 000-00-00"
                                                                type="tel"
                                                                value={courierDelivery.phone}
                                                                onAccept={(value) => handleCourierInputChange('phone', value)}
                                                                placeholder="+375 (XX) XXX-XX-XX"
                                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${courierDeliveryErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Комментарий</label>
                                                            <input
                                                                type="text"
                                                                value={courierDelivery.comment}
                                                                onChange={(e) => handleCourierInputChange('comment', e.target.value)}
                                                                placeholder="Код домофона, этаж..."
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {deliveryMethod === 'post' && (
                                                <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                                                    <div className="flex items-start gap-3 mb-4">
                                                        <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                            <Icons.Mail className="w-4 h-4 text-red-500" />
                                                        </div>
                                                        <div>
                                                            <div className="font-bold text-sm text-gray-900">Отправка почтой</div>
                                                            <div className="text-xs text-gray-500 mt-1">
                                                                2-4 дня по Беларуси
                                                            </div>
                                                            <div className="text-xs mt-1">
                                                                {getCartTotal >= 200 ? (
                                                                    <span className="text-green-600 font-bold">Бесплатно</span>
                                                                ) : (
                                                                    <span className="text-gray-900 font-bold">20 BYN</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="space-y-3 pt-3 border-t border-gray-100">
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Ваше имя <span className="text-red-500">*</span></label>
                                                            <input
                                                                type="text"
                                                                value={postDelivery.name}
                                                                onChange={(e) => handlePostInputChange('name', e.target.value)}
                                                                placeholder="Иван Иванов"
                                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${postDeliveryErrors.name ? 'border-red-300' : 'border-gray-200'}`}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Индекс <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    value={postDelivery.postalCode}
                                                                    onChange={(e) => handlePostInputChange('postalCode', e.target.value)}
                                                                    maxLength="6"
                                                                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${postDeliveryErrors.postalCode ? 'border-red-300' : 'border-gray-200'}`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Район <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    value={postDelivery.region}
                                                                    onChange={(e) => handlePostInputChange('region', e.target.value)}
                                                                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${postDeliveryErrors.region ? 'border-red-300' : 'border-gray-200'}`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Город / Населенный пункт <span className="text-red-500">*</span></label>
                                                            <input
                                                                type="text"
                                                                value={postDelivery.city}
                                                                onChange={(e) => handlePostInputChange('city', e.target.value)}
                                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${postDeliveryErrors.city ? 'border-red-300' : 'border-gray-200'}`}
                                                            />
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Дом <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    value={postDelivery.house}
                                                                    onChange={(e) => handlePostInputChange('house', e.target.value)}
                                                                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${postDeliveryErrors.house ? 'border-red-300' : 'border-gray-200'}`}
                                                                />
                                                            </div>
                                                            <div>
                                                                <label className="block text-xs font-bold text-gray-700 mb-1.5">Квартира <span className="text-red-500">*</span></label>
                                                                <input
                                                                    type="text"
                                                                    value={postDelivery.apartment}
                                                                    onChange={(e) => handlePostInputChange('apartment', e.target.value)}
                                                                    className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${postDeliveryErrors.apartment ? 'border-red-300' : 'border-gray-200'}`}
                                                                />
                                                            </div>
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Телефон <span className="text-red-500">*</span></label>
                                                            <IMaskInput
                                                                mask="+{375} (00) 000-00-00"
                                                                type="tel"
                                                                value={postDelivery.phone}
                                                                onAccept={(value) => handlePostInputChange('phone', value)}
                                                                className={`w-full px-3 py-2 bg-white border rounded-lg text-sm ${postDeliveryErrors.phone ? 'border-red-300' : 'border-gray-200'}`}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs font-bold text-gray-700 mb-1.5">Комментарий</label>
                                                            <input
                                                                type="text"
                                                                value={postDelivery.comment}
                                                                onChange={(e) => handlePostInputChange('comment', e.target.value)}
                                                                placeholder="Комментарий к заказу"
                                                                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Товары ({getCartCount})</span>
                                            <span className="font-bold text-gray-900">{formatPrice(getCartTotal)} BYN</span>
                                        </div>
                                        {deliveryMethod !== 'pickup' && (
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Доставка</span>
                                                {getDeliveryCost === 0 ? (
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-gray-400 line-through text-xs">
                                                            {deliveryMethod === 'courier' ? '15' : '20'} BYN
                                                        </span>
                                                        <span className="text-green-600 font-bold">Бесплатно</span>
                                                    </div>
                                                ) : (
                                                    <span className="font-bold text-gray-900">{formatPrice(getDeliveryCost)} BYN</span>
                                                )}
                                            </div>
                                        )}

                                        {/* Payment Method */}
                                        <div className="pt-3 border-t border-gray-100">

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

                                    {/* Anonymity Assurance Block */}
                                    <div className="mb-4 flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                        <div className="flex-shrink-0">
                                            <Icons.Shield className="w-5 h-5 text-gray-400" />
                                        </div>
                                        <div className="text-xs text-gray-600 font-medium leading-tight">
                                            100% анонимно. Закрытая упаковка. Конфиденциальность покупки.
                                        </div>
                                    </div>

                                    <button
                                        disabled={!isCheckoutFormComplete()}
                                        onClick={handleOrderSubmit}
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

            <MapModal
                isOpen={isMapModalOpen}
                onClose={() => setIsMapModalOpen(false)}
            />

            <OrderSuccessModal
                isOpen={isSuccessModalOpen}
                onClose={() => {
                    setIsSuccessModalOpen(false);
                    router.visit('/');
                }}
                orderId={successOrderId}
            />
        </>
    );
};

Cart.layout = page => <MainLayout children={page} />;


export default Cart;

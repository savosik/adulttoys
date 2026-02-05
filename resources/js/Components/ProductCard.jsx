import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Link } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import useStore from '@/store/useStore';
import { generateResponsiveImageProps, getThumbnailUrl } from '@/helpers/imageHelper';
import SetCategoryIconModal from '@/Components/SetCategoryIconModal';

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
    Camera: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" /><circle cx="12" cy="13" r="3" /></svg>
    ),
};

const ProductCard = ({ product, filters = {} }) => {
    const addToCart = useStore((state) => state.addToCart);
    const incrementCartQuantity = useStore((state) => state.incrementCartQuantity);
    const decrementCartQuantity = useStore((state) => state.decrementCartQuantity);
    const toggleFavorite = useStore((state) => state.toggleFavorite);
    const favorites = useStore((state) => state.favorites);
    const isFavorite = (id) => favorites.some(f => f.id === id);

    const cart = useStore((state) => state.cart);

    // Category icon modal state
    const [showIconModal, setShowIconModal] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);
    const swiperRef = useRef(null);

    // Benefits state
    const [benefits, setBenefits] = useState(product.key_benefits || null);
    const [isLoadingBenefits, setIsLoadingBenefits] = useState(false);
    const [hasFetchedBenefits, setHasFetchedBenefits] = useState(!!product.key_benefits);

    const handleMouseEnter = () => {
        if (!benefits && !isLoadingBenefits && !hasFetchedBenefits) {
            setIsLoadingBenefits(true);
            axios.get(`/api/products/${product.slug}/benefits`)
                .then(response => {
                    setBenefits(response.data.benefits);
                    // Update hasFetchedBenefits only if we got a valid response, 
                    // but to avoid retry loops on failure we might want to set it anyway or handle verified failure.
                    // For now, assume success or don't retry immediately.
                    setHasFetchedBenefits(true);
                })
                .catch(error => {
                    console.error('Failed to fetch benefits', error);
                })
                .finally(() => {
                    setIsLoadingBenefits(false);
                });
        }
    };

    // Check for secret edit mode parameter with localStorage persistence
    const isEditIconsMode = (() => {
        if (typeof window === 'undefined') return false;

        const urlParams = new URLSearchParams(window.location.search);
        const urlParam = urlParams.get('edit_icons');

        // If URL has explicit parameter, update localStorage
        if (urlParam === '1') {
            localStorage.setItem('edit_icons_mode', '1');
            return true;
        } else if (urlParam === '0') {
            localStorage.removeItem('edit_icons_mode');
            return false;
        }

        // Otherwise, check localStorage
        return localStorage.getItem('edit_icons_mode') === '1';
    })();

    // Get category context from URL
    const getCategoryContext = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const subCategory = urlParams.get('sub_category');
        if (subCategory) {
            // Could be comma-separated, take first one
            const firstSubCat = subCategory.split(',')[0];
            return { categoryId: parseInt(firstSubCat, 10), categorySlug: null };
        }
        // Try to get slug from path
        const pathMatch = window.location.pathname.match(/\/category\/([^/]+)/);
        if (pathMatch) {
            return { categoryId: null, categorySlug: pathMatch[1] };
        }
        return { categoryId: null, categorySlug: null };
    };

    const handleOpenIconModal = (e, imageUrl) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedImageUrl(imageUrl);
        setShowIconModal(true);
    };

    const handleAddToCart = (e) => {
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

    const handleToggleFavorite = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(product);
    };



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
        <>
            <Link
                href={productUrl}
                className={`rounded-2xl overflow-hidden shadow-sm group flex flex-col cursor-pointer hover:shadow-md transition-shadow relative ${product.is_stm
                    ? 'p-[1px] bg-gradient-to-r from-[#F0D575] via-[#FFF3C4] to-[#F0D575]'
                    : 'bg-white border border-gray-100'
                    }`}
                onMouseEnter={handleMouseEnter}
            >
                <div className={`flex flex-col h-full w-full ${product.is_stm ? 'bg-white rounded-[14px] overflow-hidden' : ''}`}>
                    <div className="relative aspect-[2/3] overflow-hidden bg-gray-50">
                        <Swiper
                            modules={[Pagination, Navigation]}
                            pagination={{ clickable: true }}
                            navigation={true}
                            className="h-full w-full product-swiper"
                        >
                            {images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="relative w-full h-full">
                                        <img
                                            {...generateResponsiveImageProps(getThumbnailUrl(img), `${product.name} - ${idx + 1}`, {
                                                loading: "lazy",
                                                width: 400,
                                                height: 600,
                                                className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            })}
                                        />
                                        {/* Camera button for setting category icon - only in edit mode */}
                                        {isEditIconsMode && (
                                            <button
                                                onClick={(e) => handleOpenIconModal(e, img)}
                                                className="absolute top-2 right-2 w-8 h-8 bg-black/50 hover:bg-black/70 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
                                                title="Установить как иконку категории"
                                            >
                                                <Icons.Camera className="w-4 h-4" />
                                            </button>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {product.old_price && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                                -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                            </div>
                        )}

                        {product.is_stm && (
                            <div
                                className="absolute top-2 right-2 z-10 group/stm cursor-help focus:outline-none"
                                tabIndex="0"
                                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                            >
                                <div className="bg-gradient-to-r from-[#F0D575] via-[#FFF3C4] to-[#F0D575] text-black text-[10px] uppercase font-bold px-2 py-1 rounded-lg shadow-sm border border-yellow-400/50 hover:shadow-md transition-shadow">
                                    СТМ
                                </div>

                                {/* Tooltip */}
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white text-gray-800 text-xs p-3 rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover/stm:opacity-100 group-hover/stm:visible group-focus/stm:opacity-100 group-focus/stm:visible transition-all duration-200 z-50 text-center leading-snug">
                                    Собственная торговая марка нашей компании. Зарегистрированный торговый знак.
                                    <div className="absolute bottom-full right-3 border-[6px] border-transparent border-b-white"></div>
                                </div>
                            </div>
                        )}

                        {/* Benefits Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 pointer-events-none z-10 flex flex-col justify-end p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <div className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 border border-gray-100/50">
                                {isLoadingBenefits && !benefits ? (
                                    <div className="flex flex-col gap-1.5 animate-pulse">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                                        <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                                    </div>
                                ) : benefits && benefits.length > 0 ? (
                                    <ul className="flex flex-col gap-1">
                                        {benefits.map((benefit, idx) => (
                                            <li key={idx} className="flex items-start gap-1.5 text-xs text-gray-700 font-medium leading-tight">
                                                <div className="mt-0.5 w-1 h-1 rounded-full bg-blue-500 shrink-0 shadow-[0_0_4px_rgba(59,130,246,0.5)]"></div>
                                                <span>{benefit}</span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : null}
                            </div>
                        </div>
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
                                onClick={handleToggleFavorite}
                                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isFavorite(product.id)
                                    ? 'bg-red-50 border border-red-200'
                                    : 'bg-gray-100 hover:bg-gray-200'
                                    }`}
                            >
                                <Icons.Heart
                                    className={`w-5 h-5 transition-all ${isFavorite(product.id)
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
                                        onClick={handleAddToCart}
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


                        </div>
                    </div>
                </div>
            </Link>

            {/* Category Icon Modal */}
            <SetCategoryIconModal
                isOpen={showIconModal}
                onClose={() => setShowIconModal(false)}
                imageUrl={selectedImageUrl}
                {...getCategoryContext()}
            />
        </>
    );
};

export default ProductCard;

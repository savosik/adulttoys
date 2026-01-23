import React from 'react';
import { Link } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import useStore from '@/store/useStore';
import { generateResponsiveImageProps, getThumbnailUrl } from '@/helpers/imageHelper';

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
};

const ProductCard = ({ product, filters = {} }) => {
    const addToCart = useStore((state) => state.addToCart);
    const incrementCartQuantity = useStore((state) => state.incrementCartQuantity);
    const decrementCartQuantity = useStore((state) => state.decrementCartQuantity);
    const toggleFavorite = useStore((state) => state.toggleFavorite);
    const favorites = useStore((state) => state.favorites);
    const isFavorite = (id) => favorites.some(f => f.id === id);
    const toggleChatQueue = useStore((state) => state.toggleChatQueue);
    const cart = useStore((state) => state.cart);
    const chatQueue = useStore((state) => state.chatQueue);

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

    const handleAddToChat = (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleChatQueue(product);
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
        <Link
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
                                {...generateResponsiveImageProps(getThumbnailUrl(img), `${product.name} - ${idx + 1}`, {
                                    loading: "lazy",
                                    width: 400,
                                    height: 600,
                                    className: "w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                })}
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

                    {/* Chat Button */}
                    {(() => {
                        const isInChat = chatQueue.some(item => item.id === product.id);
                        return (
                            <button
                                onClick={handleAddToChat}
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
};

export default ProductCard;

import React from 'react';
import useStore from '@/store/useStore';

// Icons
const Icons = {
    Heart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
    ),
    ShoppingCart: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
    ),
    MessageCircle: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
    ),
};

// Product Title Component
export const ProductTitle = ({ product }) => {
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6">
                <div className="flex items-center gap-2 mb-3">
                    <span className="inline-block bg-red-50 text-red-700 text-xs font-bold px-3 py-1 rounded-full">
                        {product.category?.name}
                    </span>
                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500">★</span>
                        <span className="text-sm font-bold text-gray-900">{Number(product.reviews_avg_rating || 0).toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({product.reviews_count || 0})</span>
                    </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                    {product.name}
                </h1>
            </div>
        </div>
    );
};

// Product Actions Component (for fixed bottom bar)
export const ProductActions = ({ product }) => {
    const addToCart = useStore((state) => state.addToCart);
    const incrementCartQuantity = useStore((state) => state.incrementCartQuantity);
    const decrementCartQuantity = useStore((state) => state.decrementCartQuantity);
    const toggleFavorite = useStore((state) => state.toggleFavorite);
    const toggleChatQueue = useStore((state) => state.toggleChatQueue);
    const favorites = useStore((state) => state.favorites);
    const cart = useStore((state) => state.cart);
    const chatQueue = useStore((state) => state.chatQueue);

    const isProductFavorite = favorites.some(fav => fav.id === product.id);
    const isInChatQueue = chatQueue.some(item => item.id === product.id);
    const cartItem = cart.find(item => item.id === product.id);

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200">
            <div className="p-3">
                {/* Compact Price Line */}
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                    <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-bold text-gray-900">
                            {new Intl.NumberFormat('ru-RU').format(product.price)}
                        </span>
                        <span className="text-base font-bold text-gray-900">BYN</span>
                    </div>

                    {product.old_price && (
                        <div className="flex items-center gap-2">
                            <span className="text-sm text-gray-400 line-through">
                                {new Intl.NumberFormat('ru-RU').format(product.old_price)} BYN
                            </span>
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                -{Math.round(((product.old_price - product.price) / product.old_price) * 100)}%
                            </span>
                        </div>
                    )}
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2">
                    {/* Add to Cart Button */}
                    {cartItem ? (
                        <div className="flex-1 flex items-center bg-green-600 rounded-xl overflow-hidden h-12">
                            <button
                                onClick={() => decrementCartQuantity(product.id)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-green-700 transition-colors text-white font-bold text-lg"
                            >
                                −
                            </button>
                            <div className="flex-1 text-center">
                                <div className="text-white font-bold text-base">{cartItem.quantity}</div>
                            </div>
                            <button
                                onClick={() => incrementCartQuantity(product.id)}
                                className="w-12 h-12 flex items-center justify-center hover:bg-green-700 transition-colors text-white font-bold text-lg"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button 
                            onClick={() => product.stock > 0 && addToCart(product)}
                            className={`flex-1 h-12 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                                product.stock <= 0
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
                            }`}
                            disabled={product.stock <= 0}
                        >
                        <Icons.ShoppingCart className="w-5 h-5" />
                        <span className="text-sm">{product.stock <= 0 ? 'Нет в наличии' : 'В корзину'}</span>
                    </button>
                )}
                
                {/* Favorites Button */}
                <button 
                    onClick={() => toggleFavorite(product)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${
                        isProductFavorite 
                        ? 'bg-red-50 border-red-200' 
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                        <Icons.Heart className={`w-5 h-5 transition-all ${
                                isProductFavorite 
                                ? 'fill-red-500 stroke-red-500' 
                                : 'text-gray-600'
                        }`} />
                </button>
                
                {/* Chat Button */}
                <button 
                    onClick={() => toggleChatQueue(product)}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${
                        isInChatQueue
                        ? 'bg-red-50 border-red-200'
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}
                >
                        <Icons.MessageCircle className={`w-5 h-5 transition-all ${
                                isInChatQueue 
                                ? 'fill-red-500 stroke-red-500' 
                                : 'text-gray-600'
                        }`} />
                </button>
            </div>
        </div>
    </div>
    );
};

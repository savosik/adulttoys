import React, { useState, useEffect } from 'react';
import useStore from '@/store/useStore';
import { useChatStore } from '@/stores/chatStore';
import { Link } from '@inertiajs/react';

// Icons
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
    Truck: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2" /><path d="M15 18H9" /><path d="M19 18h2a1 1 0 0 0 1-1v-5l-4-4h-3v9Z" /><circle cx="7" cy="18" r="2" /><circle cx="17" cy="18" r="2" /></svg>
    ),
    Check: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>
    ),
    Sparkles: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
    ),
    Shield: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
    ),
};

// Product Header Component (Title, Category, Rating)
export const ProductHeader = ({ product }) => {
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-4">
                {/* Breadcrumbs & Rating Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-gray-50">
                    <nav className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-medium text-gray-400">
                        <Link href="/" className="hover:text-red-600 transition-colors uppercase tracking-wider">Главная</Link>
                        <span className="text-gray-300">/</span>
                        {product.category?.parent && (
                            <>
                                <Link href={`/category/${product.category.parent.slug}`} className="hover:text-red-600 transition-colors uppercase tracking-wider">{product.category.parent.name}</Link>
                                <span className="text-gray-300">/</span>
                            </>
                        )}
                        {product.category && (
                            <>
                                <Link href={`/category/${product.category.slug}`} className="hover:text-red-600 transition-colors uppercase tracking-wider">{product.category.name}</Link>
                            </>
                        )}
                    </nav>

                    <div className="flex items-center gap-1">
                        <span className="text-yellow-500 text-xs">★</span>
                        <span className="text-xs font-bold text-gray-900">{Number(product.reviews_avg_rating || 0).toFixed(1)}</span>
                        <span className="text-xs text-gray-400">({product.reviews_count || 0})</span>
                    </div>
                </div>

                <h1 className="text-xl font-bold text-gray-900 leading-snug">
                    {product.name}
                </h1>
            </div>
        </div>
    );
};

// Product Description Component
export const ProductDescription = ({ product }) => {
    const defaultDescription = 'Высококачественный продукт, выполненный из экологически чистых материалов. Идеально подходит для ежедневного использования. Продуманный дизайн и надежность делают этот товар отличным выбором.';

    // Initial state: prefer enhanced, then html, then raw, then default
    const [description, setDescription] = useState(
        product.description_enhanced ||
        product.description_html ||
        product.description ||
        defaultDescription
    );
    const [isEnhancing, setIsEnhancing] = useState(false);

    useEffect(() => {
        // If no enhanced description exists on the product prop, try to generate one
        if (!product.description_enhanced && !isEnhancing) {
            setIsEnhancing(true);
            window.axios.post(`/api/products/${product.slug}/description/enhance`)
                .then(response => {
                    if (response.data.description_enhanced) {
                        setDescription(response.data.description_enhanced);
                    }
                })
                .catch(error => {
                    console.error('Failed to enhance description', error);
                })
                .finally(() => {
                    setIsEnhancing(false);
                });
        }
    }, [product.slug]);

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="p-6">
                <div
                    className={`prose prose-red max-w-none text-gray-700 leading-relaxed text-base transition-opacity duration-500 ${isEnhancing ? 'opacity-80' : 'opacity-100'}`}
                    dangerouslySetInnerHTML={{ __html: description }}
                />
            </div>
        </div>
    );
};

// Kept for backward compatibility if needed, but splitting is preferred
export const ProductTitle = ({ product }) => {
    return (
        <div className="space-y-4">
            <ProductHeader product={product} />
            <ProductDescription product={product} />
        </div>
    );
};

export const ProductBenefits = ({ product }) => {
    // Benefits state
    const [benefits, setBenefits] = useState(product.key_benefits || null);
    const [isLoadingBenefits, setIsLoadingBenefits] = useState(false);

    useEffect(() => {
        if (!benefits && !isLoadingBenefits) {
            setIsLoadingBenefits(true);
            window.axios.get(`/api/products/${product.slug}/benefits`)
                .then(response => {
                    setBenefits(response.data.benefits);
                })
                .catch(error => {
                    console.error('Failed to fetch benefits', error);
                })
                .finally(() => {
                    setIsLoadingBenefits(false);
                });
        }
    }, [product.slug]); // Only re-run if slug changes and benefits missing

    if (!benefits && !isLoadingBenefits) return null;

    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-center gap-2 mb-3">
                <div className="bg-yellow-100 p-1.5 rounded-lg text-yellow-600">
                    <Icons.Sparkles className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">Ключевые преимущества</h2>
            </div>

            {isLoadingBenefits ? (
                <div className="space-y-2 animate-pulse">
                    <div className="h-6 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-6 bg-gray-100 rounded w-2/3"></div>
                    <div className="h-6 bg-gray-100 rounded w-1/2"></div>
                </div>
            ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                    {benefits && benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-3 bg-gray-50 rounded-xl p-3">
                            <div className="flex-shrink-0 mt-0.5 bg-green-100 rounded-full p-1">
                                <Icons.Check className="w-3.5 h-3.5 text-green-600 stroke-[3]" />
                            </div>
                            <span className="text-sm font-medium text-gray-700 leading-tight">
                                {benefit}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export const ImporterInfo = () => {
    return (
        <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
            <div className="flex items-start gap-3">
                <div className="flex-shrink-0 bg-red-50 p-2 rounded-xl">
                    <Icons.Truck className="w-5 h-5 text-red-600" />
                </div>
                <div>
                    <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Импортер в Республику Беларусь</div>
                    <div className="text-sm text-gray-700 leading-relaxed font-medium">
                        ООО "Адалт Тойс", УНП 192825568, Республика Беларусь г. Минск Центральный район пр-т Победителей 57 оф. 16Н
                    </div>
                </div>
            </div>
        </div>
    );
};

export const StmBlock = () => {
    return (
        <div className="w-full relative overflow-hidden rounded-2xl shadow-sm group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#F0D575] via-[#FFF3C4] to-[#F0D575] opacity-20"></div>
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px]"></div>

            <div className="relative p-4 border border-[#F0D575]/50 rounded-2xl">
                <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 bg-gradient-to-br from-[#F0D575] to-[#D4AF37] p-2.5 rounded-xl shadow-md text-white">
                        <Icons.Shield className="w-6 h-6" />
                    </div>

                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                                Собственная торговая марка
                            </h3>
                            <span className="bg-[#F0D575] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-sm">STM</span>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-700 leading-relaxed font-medium">
                            Товар произведен под нашим строгим контролем качества.
                            Мы гарантируем надежность материалов, долговечность и лучшую цену на рынке.
                        </p>
                    </div>
                </div>
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
    const favorites = useStore((state) => state.favorites);
    const cart = useStore((state) => state.cart);
    const { openChat, setDraftMessage } = useChatStore();

    const isProductFavorite = favorites.some(fav => fav.id === product.id);

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
                <div className="flex gap-2 mb-4">
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
                            className={`flex-1 h-12 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${product.stock <= 0
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
                        className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all border-2 ${isProductFavorite
                            ? 'bg-red-50 border-red-200'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        <Icons.Heart className={`w-5 h-5 transition-all ${isProductFavorite
                            ? 'fill-red-500 stroke-red-500'
                            : 'text-gray-600'
                            }`} />
                    </button>


                </div>

                {/* Discuss with AI Button */}
                {/* Discuss with AI Button */}
                <button
                    onClick={() => {
                        setDraftMessage(`Расскажи мне о товаре: ${product.name}`);
                        openChat();
                    }}
                    className="w-full mb-4 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 font-bold py-3 rounded-xl hover:bg-indigo-100 transition-colors border border-indigo-100"
                >
                    <Icons.Sparkles className="w-5 h-5" />
                    <span>Обсудить с ИИ агентом</span>
                </button>

                {/* Warranty and Service Center Block */}
                {/* Warranty and Service Center Block */}
                <div className="flex flex-col sm:flex-row gap-4 pt-3 border-t border-gray-100">
                    <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                            <Icons.Shield className="w-4 h-4 text-green-600" />
                        </div>
                        <div>
                            <div className="text-xs font-bold text-gray-900 mb-0.5">Гарантия {product.is_stm ? '2 года' : '1 год'}</div>
                            <div className="text-[10px] sm:text-xs text-gray-500 leading-tight">
                                Сервисный центр: г. Минск, пр-т Победителей 57
                            </div>
                        </div>
                    </div>

                    {product.brand?.name === 'Satisfyer' && (
                        <div className="flex items-start gap-3 border-l border-gray-100 pl-4 sm:border-l-0 sm:pl-0 sm:border-l sm:border-gray-100 sm:pl-4">
                            <div className="flex-shrink-0 mt-0.5">
                                <Icons.Shield className="w-4 h-4 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-xs font-bold text-gray-900 mb-0.5">Гарантия производителя 15 лет.</div>
                                <a
                                    href="https://www.satisfyer.com/guarantee"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[10px] sm:text-xs text-gray-500 hover:text-red-600 transition-colors leading-tight underline decoration-gray-300 underline-offset-2"
                                >
                                    Условия гарантии
                                </a>
                            </div>
                        </div>
                    )}
                </div>

                {/* Anonymity Assurance Block */}
                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-3">
                    <div className="flex-shrink-0 bg-gray-100 p-1.5 rounded-lg">
                        <Icons.Shield className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                        100% анонимно. Закрытая упаковка. Конфиденциальность покупки.
                    </div>
                </div>
            </div>
        </div>
    );
};

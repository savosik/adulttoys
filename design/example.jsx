import React, { useState } from 'react';
import { Search, X, ShoppingCart, Heart, Home, Tag, Package, Zap, Shirt, Watch, Smartphone, Headphones, Monitor, Camera, Gamepad2, Book, Dumbbell, Utensils, Sofa, Wrench, Palette, Baby, Gift, MapPin, ClipboardList, MessageCircle, Phone, Store, ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
  {
    id: 1,
    name: 'Беспроводные наушники Premium',
    price: 8990,
    oldPrice: 12990,
    images: [
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Headphones+1',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Headphones+2',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Headphones+3'
    ],
    category: 'Аудио',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 2,
    name: 'Смарт-часы SpotFit Pro',
    price: 15990,
    images: [
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Watch+1',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Watch+2',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Watch+3'
    ],
    category: 'Часы',
    rating: 4.6,
    reviews: 89
  },
  {
    id: 3,
    name: 'Рюкзак городской Modern',
    price: 3490,
    oldPrice: 4990,
    images: [
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Backpack+1',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Backpack+2',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Backpack+3'
    ],
    category: 'Аксессуары',
    rating: 4.9,
    reviews: 156
  },
  {
    id: 4,
    name: 'Кроссовки SportMax Ultra',
    price: 7990,
    images: [
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Sneakers+1',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Sneakers+2',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Sneakers+3'
    ],
    category: 'Обувь',
    rating: 4.7,
    reviews: 203
  },
  {
    id: 5,
    name: 'Портативная колонка Bass+',
    price: 4490,
    oldPrice: 5990,
    images: [
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Speaker+1',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Speaker+2',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Speaker+3'
    ],
    category: 'Аудио',
    rating: 4.5,
    reviews: 78
  },
  {
    id: 6,
    name: 'Солнцезащитные очки Ray',
    price: 2990,
    images: [
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Sunglasses+1',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Sunglasses+2',
      'https://placehold.co/400x400/e5e7eb/6b7280?text=Sunglasses+3'
    ],
    category: 'Аксессуары',
    rating: 4.8,
    reviews: 95
  }
];

const categories = [
  { name: 'Все', icon: Home },
  { name: 'Смартфоны', icon: Smartphone },
  { name: 'Компьютеры', icon: Monitor },
  { name: 'Аудио', icon: Headphones },
  { name: 'Часы', icon: Watch },
  { name: 'Камеры', icon: Camera },
  { name: 'Игры', icon: Gamepad2 },
  { name: 'Одежда', icon: Shirt },
  { name: 'Обувь', icon: Package },
  { name: 'Аксессуары', icon: Tag },
  { name: 'Книги', icon: Book },
  { name: 'Спорт', icon: Dumbbell },
  { name: 'Кухня', icon: Utensils },
  { name: 'Мебель', icon: Sofa },
  { name: 'Инструменты', icon: Wrench },
  { name: 'Творчество', icon: Palette },
  { name: 'Детское', icon: Baby },
  { name: 'Подарки', icon: Gift },
  { name: 'Электроника', icon: Zap }
];

export default function ProductCatalog() {
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [showSort, setShowSort] = useState(false);
  const [sortBy, setSortBy] = useState('default');
  const [favorites, setFavorites] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailImageIndex, setDetailImageIndex] = useState(0);

  const toggleFavorite = (id) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(id)) {
      newFavorites.delete(id);
    } else {
      newFavorites.add(id);
    }
    setFavorites(newFavorites);
  };

  const handleImageSwipe = (productId, direction, totalImages) => {
    setCurrentImageIndex(prev => {
      const current = prev[productId] || 0;
      let newIndex;
      if (direction === 'next') {
        newIndex = (current + 1) % totalImages;
      } else {
        newIndex = current === 0 ? totalImages - 1 : current - 1;
      }
      return { ...prev, [productId]: newIndex };
    });
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      case 'popular':
        return b.reviews - a.reviews;
      default:
        return 0;
    }
  });

  return (
    <div className="h-screen bg-gray-50 flex flex-col overflow-hidden">
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
      `}</style>

      {/* Header */}
      <header className="bg-white border-b border-gray-200 z-50 flex-shrink-0">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-red-200 to-red-300 rounded-xl flex items-center justify-center border border-red-400">
                <span className="text-red-700 font-bold text-base">A</span>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold text-gray-900 leading-tight">A-toys</span>
                <span className="text-[10px] text-gray-500">склад-магазин</span>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <a href="tel:+375295008990" className="flex items-center gap-2 hover:text-red-600 transition-colors">
                <Phone className="w-4 h-4 text-red-600" />
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-gray-900">+375 (29) 500-89-90</span>
                  <span className="text-[10px] text-gray-500">Позвоните нам</span>
                </div>
              </a>
              
              <div className="flex items-center gap-2">
                <Store className="w-4 h-4 text-red-600" />
                <div className="flex flex-col">
                  <span className="text-xs font-medium text-gray-900">Минск, Победителей 57</span>
                  <span className="text-[10px] text-gray-500">Пн-Вс 10:00-21:00</span>
                </div>
              </div>
            </div>

            <a href="tel:+375295008990" className="md:hidden flex items-center gap-1 text-xs font-semibold text-gray-900 hover:text-red-600">
              <Phone className="w-4 h-4 text-red-600" />
              <span>Позвонить</span>
            </a>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-20 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto sidebar-scroll">
          <nav className="py-2">
            {categories.map(cat => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.name}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSelectedProduct(null);
                  }}
                  className={`w-full flex flex-col items-center gap-1 px-2 py-3 transition-colors ${
                    selectedCategory === cat.name
                      ? 'bg-red-100 text-red-700 border-r-2 border-red-500'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  title={cat.name}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-[9px] font-medium leading-tight text-center break-all line-clamp-2 max-w-full overflow-hidden">
                    {cat.name}
                  </span>
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Search Header */}
          <div className="bg-white shadow-sm flex-shrink-0">
            <div className="px-4 py-3">
              {selectedProduct ? (
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="flex items-center gap-2 hover:text-red-600 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                  <span className="font-semibold">Назад к каталогу</span>
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Поиск товаров..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-xl border-0 focus:ring-2 focus:ring-red-400 focus:bg-white transition-all"
                    />
                  </div>
                  <button
                    onClick={() => setShowSort(true)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <ArrowUpDown className="w-6 h-6 text-gray-700" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <main className="flex-1 overflow-y-auto content-scroll">
            {selectedProduct ? (
              <div className="p-4 max-w-3xl mx-auto pb-32">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
                  <div className="relative">
                    <img
                      src={selectedProduct.images[detailImageIndex]}
                      alt={selectedProduct.name}
                      className="w-full aspect-square object-cover"
                    />
                    
                    {selectedProduct.images.length > 1 && (
                      <>
                        <button
                          onClick={() => setDetailImageIndex(prev => 
                            prev === 0 ? selectedProduct.images.length - 1 : prev - 1
                          )}
                          className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={() => setDetailImageIndex(prev => 
                            prev === selectedProduct.images.length - 1 ? 0 : prev + 1
                          )}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full shadow-lg flex items-center justify-center hover:bg-white"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                      </>
                    )}

                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                      {selectedProduct.images.map((_, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDetailImageIndex(idx)}
                          className={`w-2 h-2 rounded-full transition-all ${
                            idx === detailImageIndex ? 'bg-white w-6' : 'bg-white/60'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProduct.name}
                  </h1>
                  
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{selectedProduct.rating}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-sm text-gray-600">{selectedProduct.reviews} отзывов</span>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Описание</h3>
                    <p className="text-gray-600 text-sm">
                      Высококачественный товар из категории "{selectedProduct.category}". 
                      Отличное соотношение цены и качества. Быстрая доставка по Минску и всей Беларуси.
                    </p>
                  </div>

                  <div className="mb-4">
                    <h3 className="font-semibold mb-2">Характеристики</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-gray-600">Категория</span>
                        <span className="text-sm font-medium">{selectedProduct.category}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="text-sm text-gray-600">Рейтинг</span>
                        <span className="text-sm font-medium">{selectedProduct.rating} ★</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Fixed Bottom Panel with Price and Actions */}
                <div className="fixed bottom-0 left-20 right-0 bg-white border-t-2 border-gray-200 p-4 shadow-lg z-40">
                  <div className="max-w-3xl mx-auto">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1">
                        <div className="flex items-end gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {selectedProduct.price.toLocaleString('ru-RU')} ₽
                          </span>
                          {selectedProduct.oldPrice && (
                            <>
                              <span className="text-base text-gray-400 line-through mb-0.5">
                                {selectedProduct.oldPrice.toLocaleString('ru-RU')} ₽
                              </span>
                              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded mb-0.5">
                                -{Math.round((1 - selectedProduct.price / selectedProduct.oldPrice) * 100)}%
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-3">
                      <button
                        onClick={() => toggleFavorite(selectedProduct.id)}
                        className="w-14 h-14 border-2 border-red-300 rounded-xl flex items-center justify-center hover:border-red-500 transition-colors"
                      >
                        <Heart className={`w-6 h-6 ${favorites.has(selectedProduct.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      </button>
                      <button className="flex-1 bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl font-semibold text-lg transition-colors">
                        Добавить в корзину
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4">
                <p className="text-sm text-gray-600 mb-4">
                  Найдено {sortedProducts.length} товаров
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3">
                  {sortedProducts.map(product => {
                    const currentIdx = currentImageIndex[product.id] || 0;
                    return (
                      <div 
                        key={product.id} 
                        onClick={() => {
                          setSelectedProduct(product);
                          setDetailImageIndex(0);
                        }}
                        className="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                      >
                        <div className="relative group">
                          <img
                            src={product.images[currentIdx]}
                            alt={product.name}
                            className="w-full aspect-square object-cover"
                          />
                          
                          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                            {product.images.map((_, idx) => (
                              <button
                                key={idx}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setCurrentImageIndex(prev => ({ ...prev, [product.id]: idx }));
                                }}
                                className={`w-1.5 h-1.5 rounded-full transition-all ${
                                  idx === currentIdx ? 'bg-white w-4' : 'bg-white/60'
                                }`}
                              />
                            ))}
                          </div>

                          {product.images.length > 1 && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageSwipe(product.id, 'prev', product.images.length);
                                }}
                                className="absolute left-0 top-0 bottom-0 w-1/3 opacity-0 group-hover:opacity-100"
                              />
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageSwipe(product.id, 'next', product.images.length);
                                }}
                                className="absolute right-0 top-0 bottom-0 w-1/3 opacity-0 group-hover:opacity-100"
                              />
                            </>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(product.id);
                            }}
                            className="absolute top-2 right-2 w-9 h-9 bg-white rounded-full shadow-md flex items-center justify-center z-10"
                          >
                            <Heart className={`w-5 h-5 ${favorites.has(product.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                          </button>
                          
                          {product.oldPrice && (
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
                            </div>
                          )}
                        </div>
                        
                        <div className="p-3">
                          <h3 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 min-h-[2.5rem]">
                            {product.name}
                          </h3>
                          
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="text-xs text-gray-600">{product.rating}</span>
                            <span className="text-xs text-gray-400">({product.reviews})</span>
                          </div>

                          <div className="flex items-end gap-2 mb-3">
                            <span className="text-lg font-bold text-gray-900">
                              {product.price.toLocaleString('ru-RU')} ₽
                            </span>
                            {product.oldPrice && (
                              <span className="text-xs text-gray-400 line-through mb-0.5">
                                {product.oldPrice.toLocaleString('ru-RU')} ₽
                              </span>
                            )}
                          </div>

                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                            }}
                            className="w-full bg-red-500 hover:bg-red-600 text-white py-2.5 rounded-xl font-medium transition-colors"
                          >
                            В корзину
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <nav className="bg-white border-t border-gray-200 z-50 flex-shrink-0">
        <div className="flex items-center justify-around px-2 py-2 relative">
          <button className="flex flex-col items-center gap-1 relative group flex-1">
            <div className="relative">
              <Heart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                {favorites.size}
              </span>
            </div>
            <span className="text-[9px] font-medium text-gray-700 leading-tight text-center">Избранное</span>
          </button>

          <button className="flex flex-col items-center gap-1 relative group flex-1">
            <div className="relative">
              <ShoppingCart className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                3
              </span>
            </div>
            <span className="text-[9px] font-medium text-gray-700 leading-tight text-center">Корзина</span>
          </button>

          <button className="flex flex-col items-center gap-1 relative -mt-8 flex-1">
            <div className="w-14 h-14 bg-gradient-to-br from-red-400 to-red-600 rounded-full shadow-lg flex items-center justify-center hover:shadow-xl transition-all active:scale-95 border-4 border-white">
              <MessageCircle className="w-7 h-7 text-white" />
            </div>
            <span className="text-[9px] font-medium text-gray-700 leading-tight text-center mt-1">Чат</span>
          </button>

          <button className="flex flex-col items-center gap-1 relative group flex-1">
            <MapPin className="w-6 h-6 text-gray-700" />
            <span className="text-[9px] font-medium text-gray-700 leading-tight text-center">Доставка</span>
          </button>

          <button className="flex flex-col items-center gap-1 relative group flex-1">
            <div className="relative">
              <ClipboardList className="w-6 h-6 text-gray-700" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-[10px] flex items-center justify-center font-bold">
                2
              </span>
            </div>
            <span className="text-[9px] font-medium text-gray-700 leading-tight text-center">Заказы</span>
          </button>
        </div>
      </nav>

      {/* Sort Modal */}
      {showSort && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Сортировка</h2>
              <button onClick={() => setShowSort(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-2">
              {[
                { value: 'default', label: 'По умолчанию' },
                { value: 'price-asc', label: 'Сначала дешевле' },
                { value: 'price-desc', label: 'Сначала дороже' },
                { value: 'rating', label: 'По рейтингу' },
                { value: 'popular', label: 'Популярные' }
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => {
                    setSortBy(option.value);
                    setShowSort(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-colors ${
                    sortBy === option.value ? 'bg-red-100 text-red-700 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
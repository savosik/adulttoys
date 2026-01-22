import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import ProductImageGallery from './ProductDetail/ProductImageGallery';
import { ProductTitle, ProductActions, ImporterInfo } from './ProductDetail/ProductInfo';
import ProductSpecifications from './ProductDetail/ProductSpecifications';
import ProductReviews from './ProductDetail/ProductReviews';

// Icon for back button
const ChevronLeftIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
);

const ProductDetail = ({ product, relatedProducts = [], categories, filters = {} }) => {
    // Build back URL with preserved filters
    const backUrl = (() => {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.sub_category) params.set('sub_category', filters.sub_category);
        if (filters.brand) params.set('brand', filters.brand);
        if (filters.search) params.set('search', filters.search);
        if (filters.sort) params.set('sort', filters.sort);
        
        const queryString = params.toString();
        const baseUrl = filters.category ? `/category/${filters.category}` : '/';
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    })();

    // Schema.org Product Data
    const productSchema = {
        "@context": "https://schema.org/",
        "@type": "Product",
        "name": product.name,
        "image": [
            product.image_main,
            ...(product.additional_images || []).map(img => img.url)
        ].filter(Boolean),
        "description": product.description || product.name,
        "sku": product.sku,
        "brand": {
            "@type": "Brand",
            "name": product.brand?.name || "A-Toys"
        },
        "offers": {
            "@type": "Offer",
            "url": window.location.href,
            "priceCurrency": "BYN",
            "price": product.price,
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
            "itemCondition": "https://schema.org/NewCondition"
        },
        "aggregateRating": product.reviews_count > 0 ? {
            "@type": "AggregateRating",
            "ratingValue": product.reviews_avg_rating,
            "reviewCount": product.reviews_count
        } : undefined,
        "review": (product.reviews || []).slice(0, 5).map(review => ({
            "@type": "Review",
            "author": {
                "@type": "Person",
                "name": review.user_name || "Клиент"
            },
            "datePublished": review.created_at,
            "reviewRating": {
                "@type": "Rating",
                "ratingValue": review.rating
            },
            "reviewBody": review.comment
        }))
    };

    // Schema.org Breadcrumb Data
    const breadcrumbSchema = {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
            {
                "@type": "ListItem",
                "position": 1,
                "name": "Главная",
                "item": window.location.origin
            },
            product.category?.parent && {
                "@type": "ListItem",
                "position": 2,
                "name": product.category.parent.name,
                "item": `${window.location.origin}/category/${product.category.parent.slug}`
            },
            product.category && {
                "@type": "ListItem",
                "position": product.category?.parent ? 3 : 2,
                "name": product.category.name,
                "item": `${window.location.origin}/category/${product.category.slug}`
            },
            {
                "@type": "ListItem",
                "position": product.category?.parent ? 4 : (product.category ? 3 : 2),
                "name": product.name,
                "item": window.location.href
            }
        ].filter(Boolean)
    };

    return (
        <MainLayout filters={filters}>
            <Head title={product.name}>
                <script type="application/ld+json">
                    {JSON.stringify(productSchema)}
                </script>
                <script type="application/ld+json">
                    {JSON.stringify(breadcrumbSchema)}
                </script>
            </Head>
            
            {/* Header / Back Link */}
            <div className="bg-white shadow-sm flex-shrink-0 sticky top-0 z-10">
                <div className="px-4 py-3 max-w-7xl mx-auto flex items-center justify-between">
                    <Link
                        href={backUrl}
                        className="flex items-center gap-2 hover:text-red-600 transition-colors text-gray-900"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                        <span className="font-semibold text-sm">Назад</span>
                    </Link>

                    {/* Breadcrumbs */}
                    <nav className="hidden sm:flex items-center gap-2 text-[10px] font-medium text-gray-400">
                        <Link href="/" className="hover:text-red-600 transition-colors">Главная</Link>
                        <span>/</span>
                        {product.category?.parent && (
                            <>
                                <Link href={`/category/${product.category.parent.slug}`} className="hover:text-red-600 transition-colors max-w-[100px] truncate">{product.category.parent.name}</Link>
                                <span>/</span>
                            </>
                        )}
                        {product.category && (
                            <>
                                <Link href={`/category/${product.category.slug}`} className="hover:text-red-600 transition-colors max-w-[100px] truncate">{product.category.name}</Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-gray-900 max-w-[100px] truncate">{product.name}</span>
                    </nav>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto content-scroll bg-gray-50">
                <div className="p-4 pb-32">
                    {/* Single column layout for all screens */}
                    <div className="w-full space-y-6">
                        {/* Image Gallery */}
                        <ProductImageGallery product={product} />
                        
                        {/* Product Title & Description */}
                        <ProductTitle product={product} />
                        
                        {/* Importer Info */}
                        <ImporterInfo />
                        
                        {/* Specifications */}
                        <ProductSpecifications parameters={product.parameters} />
                        
                        {/* Reviews */}
                        <ProductReviews reviews={product.reviews} />

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="w-full space-y-4">
                                <h2 className="text-xl font-bold text-gray-900">Похожие товары</h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {relatedProducts.map(item => (
                                        <Link 
                                            key={item.id}
                                            href={`/product/${item.slug}`}
                                            className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 flex flex-col gap-2"
                                        >
                                            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                                                <img src={item.image_main} className="w-full h-full object-cover" alt={item.name} />
                                            </div>
                                            <h3 className="text-sm font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">{item.name}</h3>
                                            <div className="text-red-600 font-bold">{new Intl.NumberFormat('ru-RU').format(item.price)} BYN</div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Fixed Bottom Actions Bar */}
            <div className="fixed bottom-16 left-20 right-0 z-20">
                <div className="p-4">
                    <ProductActions product={product} />
                </div>
            </div>
        </MainLayout>
    );
};

export default ProductDetail;

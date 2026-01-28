import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import ProductImageGallery from './ProductDetail/ProductImageGallery';
import { ProductHeader, ProductDescription, ProductActions, ImporterInfo, ProductBenefits, StmBlock } from './ProductDetail/ProductInfo';
import ProductCard from '@/Components/ProductCard';
import ProductSpecifications from './ProductDetail/ProductSpecifications';
import ProductReviews from './ProductDetail/ProductReviews';

// Icon for back button
const ChevronLeftIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6" /></svg>
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


            {/* Content Area */}
            <main className="bg-gray-50">
                <div className="p-4">
                    {/* Single column layout for all screens */}
                    <div className="w-full space-y-6">
                        {/* Product Header (Category, Rating, Title) */}
                        <ProductHeader product={product} />

                        {/* Image Gallery */}
                        <ProductImageGallery product={product} />

                        {/* Buy Button Block */}
                        <ProductActions product={product} />

                        {/* STM Block */}
                        {product.is_stm && <StmBlock />}

                        {/* Benefits Block */}
                        <ProductBenefits product={product} />

                        {/* Product Description */}
                        <ProductDescription product={product} />

                        {/* Specifications */}
                        <ProductSpecifications parameters={product.parameters} />

                        {/* Importer Info */}
                        <ImporterInfo />

                        {/* Reviews */}
                        <ProductReviews reviews={product.reviews} product={product} />

                        {/* Related Products */}
                        {relatedProducts.length > 0 && (
                            <div className="w-full space-y-4">
                                <h2 className="text-xl font-bold text-gray-900">Похожие товары</h2>
                                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6 gap-4">
                                    {relatedProducts.map(item => (
                                        <ProductCard key={item.id} product={item} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </MainLayout>
    );
};

export default ProductDetail;

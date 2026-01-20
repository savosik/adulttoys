import React from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, Link } from '@inertiajs/react';
import ProductImageGallery from './ProductDetail/ProductImageGallery';
import { ProductTitle, ProductActions } from './ProductDetail/ProductInfo';
import ProductDescription from './ProductDetail/ProductDescription';
import ProductSpecifications from './ProductDetail/ProductSpecifications';
import ProductReviews from './ProductDetail/ProductReviews';

// Icon for back button
const ChevronLeftIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 18-6-6 6-6"/></svg>
);

const ProductDetail = ({ product, categories, filters = {} }) => {
    // Build back URL with preserved filters
    const backUrl = (() => {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.sub_category) params.set('sub_category', filters.sub_category);
        if (filters.brand) params.set('brand', filters.brand);
        if (filters.search) params.set('search', filters.search);
        if (filters.sort) params.set('sort', filters.sort);
        
        const queryString = params.toString();
        return queryString ? `/catalog?${queryString}` : '/catalog';
    })();

    return (
        <MainLayout filters={filters}>
            <Head title={product.name} />
            
            {/* Header / Back Link */}
            <div className="bg-white shadow-sm flex-shrink-0 sticky top-0 z-10">
                <div className="px-4 py-3 max-w-7xl mx-auto">
                    <Link
                        href={backUrl}
                        className="flex items-center gap-2 hover:text-red-600 transition-colors text-gray-900"
                    >
                        <ChevronLeftIcon className="w-6 h-6" />
                        <span className="font-semibold">Назад к каталогу</span>
                    </Link>
                </div>
            </div>

            {/* Content Area */}
            <main className="flex-1 overflow-y-auto content-scroll bg-gray-50">
                <div className="p-4 pb-32">
                    {/* Single column layout for all screens */}
                    <div className="w-full space-y-6">
                        {/* Image Gallery */}
                        <ProductImageGallery product={product} />
                        
                        {/* Product Title */}
                        <ProductTitle product={product} />
                        
                        {/* Description */}
                        <ProductDescription description={product.description} />
                        
                        {/* Specifications */}
                        <ProductSpecifications parameters={product.parameters} />
                        
                        {/* Reviews */}
                        <ProductReviews reviews={product.reviews} />
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

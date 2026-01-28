import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import { generateResponsiveImageProps, getThumbnailUrl } from '@/helpers/imageHelper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

const ProductImageGallery = ({ product }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const images = [product.image_main, ...(product.additional_images || []).map(img => img.url)].filter(Boolean);
    const hasImages = images.length > 0;

    const openModal = (index) => {
        setCurrentImageIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <>
            <div className="w-full">
                <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                    <Swiper
                        modules={[Pagination, Navigation]}
                        pagination={{
                            clickable: true,
                            dynamicBullets: true
                        }}
                        navigation={true}
                        spaceBetween={12}
                        slidesPerView={1}
                        slidesPerGroup={1}
                        breakpoints={{
                            // Mobile - 1 image
                            320: {
                                slidesPerView: 1,
                                slidesPerGroup: 1,
                            },
                            // Small - 2 images
                            480: {
                                slidesPerView: 2,
                                slidesPerGroup: 2,
                            },
                            // Medium - 3 images
                            640: {
                                slidesPerView: 3,
                                slidesPerGroup: 3,
                            },
                            // Large - 4 images
                            768: {
                                slidesPerView: 4,
                                slidesPerGroup: 4,
                            },
                            // XL and above - 5 images max
                            1024: {
                                slidesPerView: 5,
                                slidesPerGroup: 5,
                            },
                            1280: {
                                slidesPerView: 5,
                                slidesPerGroup: 5,
                            }
                        }}
                        className="product-detail-swiper"
                    >
                        {hasImages ? (
                            images.map((img, idx) => (
                                <SwiperSlide key={idx}>
                                    <div
                                        className="relative w-full overflow-hidden bg-gray-50 cursor-pointer hover:opacity-90 transition-opacity"
                                        style={{ aspectRatio: '3/4' }}
                                        onClick={() => openModal(idx)}
                                    >
                                        <img
                                            {...generateResponsiveImageProps(getThumbnailUrl(img), `${product.name} - ${idx + 1}`, {
                                                loading: idx === 0 ? "eager" : "lazy",
                                                fetchpriority: idx === 0 ? "high" : "auto",
                                                width: 400,
                                                height: 533,
                                                className: "w-full h-full object-cover"
                                            })}
                                            onError={(e) => {
                                                console.error('Image load error:', e);
                                                e.target.src = 'https://placehold.co/400x400/e5e7eb/6b7280?text=No+Image';
                                            }}
                                        />
                                    </div>
                                </SwiperSlide>
                            ))
                        ) : (
                            <SwiperSlide>
                                <div className="relative w-full overflow-hidden bg-gray-50" style={{ aspectRatio: '3/4' }}>
                                    <img
                                        {...generateResponsiveImageProps('https://placehold.co/400x400/e5e7eb/6b7280?text=No+Image', 'No Image', {
                                            loading: "eager",
                                            width: 400,
                                            height: 533,
                                            className: "w-full h-full object-cover"
                                        })}
                                        onError={(e) => {
                                            e.target.src = 'https://placehold.co/400x400/e5e7eb/6b7280?text=Error';
                                        }}
                                    />
                                </div>
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </div>

            {/* Fullscreen Modal */}
            {isModalOpen && createPortal(
                <div
                    className="fixed inset-0 z-[9999] bg-black bg-opacity-95 flex items-center justify-center animate-in fade-in duration-200"
                    onClick={closeModal}
                >
                    {/* Close button */}
                    <button
                        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
                        onClick={closeModal}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>

                    {/* Previous button */}
                    {images.length > 1 && (
                        <button
                            className="absolute left-4 text-white hover:text-gray-300 transition-colors z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                prevImage();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="15 18 9 12 15 6" />
                            </svg>
                        </button>
                    )}

                    {/* Image */}
                    <div
                        className="max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <img
                            src={images[currentImageIndex]}
                            alt={`${product.name} - ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    {/* Next button */}
                    {images.length > 1 && (
                        <button
                            className="absolute right-4 text-white hover:text-gray-300 transition-colors z-10"
                            onClick={(e) => {
                                e.stopPropagation();
                                nextImage();
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </button>
                    )}

                    {/* Counter */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-70 text-white px-4 py-2 rounded-full text-sm">
                        {currentImageIndex + 1} / {images.length}
                    </div>
                </div>,
                document.body
            )}
        </>
    );
};

export default ProductImageGallery;

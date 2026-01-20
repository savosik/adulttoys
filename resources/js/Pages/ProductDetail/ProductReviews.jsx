import React from 'react';

const ProductReviews = ({ reviews = [] }) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base text-gray-900">Отзывы</h3>
                <button className="text-red-600 text-xs font-semibold">Все ({reviews.length})</button>
            </div>
            <div className="space-y-2">
                {reviews.length > 0 ? (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                            <div className="flex justify-between mb-2">
                                <span className="font-bold text-sm">{review.user_name}</span>
                                <div className="flex text-yellow-500 text-xs">
                                    {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                                </div>
                            </div>
                            <p className="text-gray-600 text-xs leading-relaxed">
                                {review.text}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-gray-500 text-xs text-center py-4">Отзывов пока нет</p>
                )}
            </div>
        </div>
    );
};

export default ProductReviews;

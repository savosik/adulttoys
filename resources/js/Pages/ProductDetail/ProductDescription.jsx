import React from 'react';

const ProductDescription = ({ description }) => {
    const defaultDescription = 'Высококачественный продукт, выполненный из экологически чистых материалов. Идеально подходит для ежедневного использования. Продуманный дизайн и надежность делают этот товар отличным выбором.';

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-base text-gray-900 mb-2">Описание</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
                {description || defaultDescription}
            </p>
        </div>
    );
};

export default ProductDescription;

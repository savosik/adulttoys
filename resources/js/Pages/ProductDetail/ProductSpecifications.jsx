import React from 'react';

const ProductSpecifications = ({ parameters }) => {
    if (!parameters || parameters.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-base text-gray-900 mb-3">Характеристики</h3>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                {parameters.map((param, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1">
                        <span className="text-gray-600">{param.name}</span>
                        <span className="font-semibold text-gray-900">{param.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductSpecifications;

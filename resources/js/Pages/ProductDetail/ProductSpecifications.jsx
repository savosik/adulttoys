import React from 'react';

const ProductSpecifications = ({ parameters }) => {
    const [isExpanded, setIsExpanded] = React.useState(false);

    // Filter out parameters with value "Нет"
    const filteredParameters = (parameters || []).filter(param => param.value !== 'Нет');

    if (filteredParameters.length === 0) {
        return null;
    }

    // Always show at least 3 items, otherwise 30%
    const initialCount = Math.max(3, Math.ceil(filteredParameters.length * 0.3));
    const displayedParams = isExpanded ? filteredParameters : filteredParameters.slice(0, initialCount);
    const hasMore = filteredParameters.length > initialCount;

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-base text-gray-900 mb-3">Характеристики</h3>
            <div className="bg-gray-50 rounded-xl p-4 grid grid-cols-1 lg:grid-cols-2 lg:gap-x-12 gap-y-1">
                {displayedParams.map((param, idx) => (
                    <div key={idx} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0 lg:[&:nth-last-child(-n+2)]:border-0">
                        <span className="text-gray-600">{param.name}</span>
                        <span className="font-semibold text-gray-900 text-right ml-4">{param.value}</span>
                    </div>
                ))}
            </div>

            {hasMore && (
                <div className="mt-3 text-center">
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                    >
                        {isExpanded ? 'Скрыть' : `Показать все (${filteredParameters.length})`}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProductSpecifications;

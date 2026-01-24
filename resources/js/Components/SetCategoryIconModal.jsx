import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import axios from 'axios';

const SetCategoryIconModal = ({ isOpen, onClose, imageUrl, categoryId, categorySlug }) => {
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [message, setMessage] = useState('');

    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels);
    }, []);

    const handleSetIcon = async () => {
        if (!croppedAreaPixels) return;

        setIsLoading(true);
        setStatus(null);

        try {
            const response = await axios.post('/api/category/set-icon', {
                image_url: imageUrl,
                crop_data: croppedAreaPixels,
                zoom_level: zoom,
                category_id: categoryId || null,
                category_slug: categorySlug || null,
            });

            if (response.data.success) {
                setStatus('success');
                setMessage(response.data.message);
                setTimeout(() => {
                    onClose();
                    setStatus(null);
                    // Reset state
                    setCrop({ x: 0, y: 0 });
                    setZoom(1);
                }, 1500);
            }
        } catch (error) {
            setStatus('error');
            setMessage(error.response?.data?.message || 'Произошла ошибка');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        onClose();
        setStatus(null);
        setCrop({ x: 0, y: 0 });
        setZoom(1);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={handleClose}
        >
            <div
                className="bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full mx-4 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-4 border-b border-gray-800 flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Выбор области иконки</h3>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-lg bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                    >
                        <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative h-80 bg-white">
                    <Cropper
                        image={imageUrl}
                        crop={crop}
                        zoom={zoom}
                        minZoom={0.3}
                        maxZoom={3}
                        aspect={1}
                        onCropChange={setCrop}
                        onCropComplete={onCropComplete}
                        onZoomChange={setZoom}
                        cropShape="rect"
                        showGrid={true}
                        restrictPosition={false}
                        style={{
                            containerStyle: {
                                background: '#ffffff',
                            },
                            cropAreaStyle: {
                                border: '2px solid #ef4444',
                            },
                            mediaStyle: {
                                background: '#ffffff',
                            },
                        }}
                    />
                </div>

                {/* Zoom Slider */}
                <div className="p-4 border-t border-gray-800">
                    <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                        </svg>
                        <input
                            type="range"
                            min={0.3}
                            max={3}
                            step={0.05}
                            value={zoom}
                            onChange={(e) => setZoom(Number(e.target.value))}
                            className="flex-1 h-2 bg-gray-700 rounded-full appearance-none cursor-pointer accent-red-500"
                        />
                        <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                        </svg>
                    </div>
                    <p className="text-center text-xs text-gray-500 mt-2">
                        Перетащите изображение и используйте слайдер для масштабирования
                    </p>
                </div>

                {/* Status Message */}
                {status && (
                    <div className={`mx-4 mb-4 p-3 rounded-lg text-sm font-medium text-center ${status === 'success'
                        ? 'bg-green-900/50 text-green-400 border border-green-800'
                        : 'bg-red-900/50 text-red-400 border border-red-800'
                        }`}>
                        {status === 'success' ? '✓ ' : '✕ '}{message}
                    </div>
                )}

                {/* Action Buttons */}
                <div className="p-4 border-t border-gray-800 flex gap-3">
                    <button
                        onClick={handleClose}
                        className="flex-1 py-3 px-4 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl font-medium transition-colors"
                    >
                        Отмена
                    </button>
                    <button
                        onClick={handleSetIcon}
                        disabled={isLoading || !croppedAreaPixels}
                        className="flex-1 py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                                Установить иконку
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SetCategoryIconModal;

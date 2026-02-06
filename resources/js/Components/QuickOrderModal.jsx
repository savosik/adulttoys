import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { IMaskInput } from 'react-imask';
import axios from 'axios';

const Icons = {
    Phone: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>
    ),
    X: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>
    ),
    Zap: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z" /></svg>
    ),
    Check: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12" /></svg>
    ),
    Loader: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg>
    ),
};

const QuickOrderModal = ({ isOpen, onClose, product }) => {
    const [phone, setPhone] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [orderId, setOrderId] = useState(null);
    const [error, setError] = useState(null);

    // Phone is valid if it has all digits filled (19 characters with mask)
    const isPhoneValid = phone.replace(/\D/g, '').length === 12; // 375 + 9 digits

    const handleSubmit = async () => {
        if (!isPhoneValid || isSubmitting) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await axios.post('/order/quick', {
                product_id: product.id,
                customer_phone: phone,
            });

            if (response.data.success) {
                setOrderId(response.data.order_id);
                setIsSuccess(true);
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Произошла ошибка при оформлении заказа');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        // Reset state when closing
        setPhone('');
        setIsSuccess(false);
        setOrderId(null);
        setError(null);
        onClose();
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('ru-RU').format(price);
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={handleClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-xl transition-all relative">
                                {/* Close button */}
                                <button
                                    onClick={handleClose}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
                                >
                                    <Icons.X className="w-5 h-5" />
                                </button>

                                {isSuccess ? (
                                    // Success state
                                    <div className="text-center">
                                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-in zoom-in duration-300">
                                            <Icons.Check className="w-10 h-10 text-green-500" strokeWidth={3} />
                                        </div>

                                        <Dialog.Title as="h3" className="text-2xl font-bold text-gray-900 mb-2">
                                            Заказ оформлен!
                                        </Dialog.Title>

                                        <div className="mt-2 mb-6">
                                            <p className="text-gray-500">
                                                Ваш заказ <span className="font-bold text-gray-900">#{orderId}</span> успешно оформлен.
                                            </p>
                                            <p className="text-sm text-gray-400 mt-2">
                                                Мы свяжемся с вами по указанному номеру для подтверждения.
                                            </p>
                                        </div>

                                        <button
                                            type="button"
                                            className="w-full inline-flex justify-center rounded-2xl border border-transparent bg-red-500 px-4 py-3 text-sm font-bold text-white hover:bg-red-600 focus:outline-none transition-all active:scale-95 shadow-lg shadow-red-500/20"
                                            onClick={handleClose}
                                        >
                                            Отлично
                                        </button>
                                    </div>
                                ) : (
                                    // Order form
                                    <>
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center text-white">
                                                <Icons.Zap className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <Dialog.Title as="h3" className="text-lg font-bold text-gray-900">
                                                    Быстрый заказ
                                                </Dialog.Title>
                                                <p className="text-sm text-gray-500">Оформите заказ за 30 секунд</p>
                                            </div>
                                        </div>

                                        {/* Product preview */}
                                        <div className="flex gap-4 p-4 bg-gray-50 rounded-2xl mb-6">
                                            <div className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                                                <img
                                                    src={product.image_main || 'https://placehold.co/200x200?text=No+Image'}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-sm line-clamp-2 mb-2">
                                                    {product.name}
                                                </h4>
                                                <div className="text-lg font-bold text-red-600">
                                                    {formatPrice(product.price)} BYN
                                                </div>
                                            </div>
                                        </div>

                                        {/* Phone input */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-bold text-gray-700 mb-2">
                                                Номер телефона <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                    <Icons.Phone className="w-5 h-5" />
                                                </div>
                                                <IMaskInput
                                                    mask="+{375} (00) 000-00-00"
                                                    type="tel"
                                                    value={phone}
                                                    onAccept={(value) => setPhone(value)}
                                                    placeholder="+375 (XX) XXX-XX-XX"
                                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-base focus:ring-2 focus:ring-red-400 focus:border-transparent focus:bg-white transition-all"
                                                />
                                            </div>
                                            <p className="text-xs text-gray-400 mt-2">
                                                Мы позвоним для подтверждения заказа
                                            </p>
                                        </div>

                                        {/* Error message */}
                                        {error && (
                                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
                                                {error}
                                            </div>
                                        )}

                                        {/* Submit button */}
                                        <button
                                            type="button"
                                            disabled={!isPhoneValid || isSubmitting}
                                            onClick={handleSubmit}
                                            className={`w-full py-4 rounded-2xl font-bold text-base transition-all flex items-center justify-center gap-2 ${isPhoneValid && !isSubmitting
                                                    ? 'bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/20 active:scale-95'
                                                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <Icons.Loader className="w-5 h-5 animate-spin" />
                                                    <span>Оформляем...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Icons.Zap className="w-5 h-5" />
                                                    <span>Оформить заказ</span>
                                                </>
                                            )}
                                        </button>

                                        {/* Info text */}
                                        <p className="text-xs text-gray-400 text-center mt-4 leading-relaxed">
                                            Самовывоз: г. Минск, пр-т Победителей 57, оф. 16Н
                                        </p>
                                    </>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
};

export default QuickOrderModal;

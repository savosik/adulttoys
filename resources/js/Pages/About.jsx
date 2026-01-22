import React, { useState, useEffect } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head, usePage } from '@inertiajs/react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const AccordionItem = ({ question, answer, children, isOpen, onClick }) => {
    return (
        <div className="border-b border-gray-200">
            <button
                className="w-full py-4 px-6 flex items-center justify-between hover:bg-gray-50 transition-colors text-left"
                onClick={onClick}
            >
                <span className="text-lg font-medium text-gray-900">{question}</span>
                <svg
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-gray-600 animate-fadeIn">
                    {children ? children : <p className="whitespace-pre-line">{answer}</p>}
                </div>
            )}
        </div>
    );
};

const About = ({ faqs }) => {
    const { url } = usePage();
    const [openId, setOpenId] = useState('delivery'); // Open delivery by default if no hash
    const [isWeAreHere, setIsWeAreHere] = useState(false);

    const toggleItem = (id) => {
        setOpenId(openId === id ? null : id);
    };

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section');
        setIsWeAreHere(section === 'we-are-here');
        
        // Handle scrolling to sections if specified
        if (section) {
            const element = document.getElementById(section);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }
    }, [url]);

    const howToGetImages = [
        'https://placehold.co/800x600/e5e7eb/6b7280?text=Как+добраться+1',
        'https://placehold.co/800x600/e5e7eb/6b7280?text=Как+добраться+2',
        'https://placehold.co/800x600/e5e7eb/6b7280?text=Как+добраться+3',
    ];

    return (
        <MainLayout>
            <Head title={isWeAreHere ? "Мы здесь" : "О нас и FAQ"} />
            
            <div className="bg-white pb-20">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    {isWeAreHere ? (
                        <section className="animate-fadeIn">
                            <h1 className="text-3xl font-bold text-gray-900 mb-8 px-4 flex items-center gap-4">
                                <div className="w-2 h-10 bg-red-500 rounded-full"></div>
                                Мы здесь
                            </h1>
                            
                            <div className="space-y-12">
                                <div className="rounded-2xl overflow-hidden shadow-lg border border-gray-200 h-64 md:h-[500px] relative bg-gray-50 mx-4">
                                    <iframe 
                                        src="https://yandex.ru/map-widget/v1/-/CHe9n0p-" 
                                        width="100%" 
                                        height="100%" 
                                        frameBorder="0"
                                        title="Yandex Map"
                                    ></iframe>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4">
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Наш адрес</h4>
                                            <p className="text-gray-900 font-bold text-xl leading-tight">г. Минск, ул. Тимирязева, 123/2</p>
                                            <p className="text-gray-500 text-base mt-1">ТЦ "Град", павильон 123</p>
                                        </div>
                                    </div>
                                    <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-start gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-md flex-shrink-0">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Телефон</h4>
                                            <a href="tel:+375295008990" className="text-gray-900 font-bold text-xl hover:text-red-600 transition-colors tracking-tight">+375 (29) 500-89-90</a>
                                            <p className="text-gray-500 text-base mt-1">Ежедневно с 10:00 до 20:00</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-4">
                                    <div className="rounded-3xl overflow-hidden border border-gray-100 shadow-lg bg-gray-50 p-3">
                                        <Swiper
                                            modules={[Navigation, Pagination]}
                                            spaceBetween={16}
                                            slidesPerView={1}
                                            navigation
                                            pagination={{ clickable: true }}
                                            breakpoints={{
                                                640: { slidesPerView: 2 },
                                                1024: { slidesPerView: 3 }
                                            }}
                                            className="rounded-2xl"
                                        >
                                            {howToGetImages.map((src, index) => (
                                                <SwiperSlide key={index}>
                                                    <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white border border-gray-100 group">
                                                        <img 
                                                            src={src} 
                                                            alt={`Как добраться ${index + 1}`}
                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    </div>
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                    </div>
                                </div>
                            </div>
                        </section>
                    ) : (
                        <>
                            <section className="mb-12 px-4 animate-fadeIn">
                                <h1 className="text-3xl font-bold text-gray-900 mb-8 flex items-center gap-4">
                                    <div className="w-2 h-10 bg-red-500 rounded-full"></div>
                                    Информация
                                </h1>
                                <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                                    Добро пожаловать в наш интернет-магазин. Мы стремимся предоставлять лучшие товары и качественный сервис. Наша миссия — сделать ваши покупки удобными и приятными.
                                </p>
                            </section>

                            <section className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div id="delivery">
                                        <AccordionItem
                                            question="Доставка"
                                            isOpen={openId === 'delivery'}
                                            onClick={() => toggleItem('delivery')}
                                        >
                                            <div className="space-y-4 text-sm leading-relaxed">
                                                <div className="p-4 bg-red-50 rounded-xl border border-red-100">
                                                    <p className="font-bold text-red-800">Доставка по Минску:</p>
                                                    <ul className="list-disc ml-5 mt-2 space-y-1">
                                                        <li>При заказе до 19:00 — <span className="font-bold">день в день</span>.</li>
                                                        <li>Бесплатная доставка при заказе от 100 BYN.</li>
                                                        <li>Стоимость доставки заказов до 100 BYN — 10 BYN.</li>
                                                    </ul>
                                                </div>
                                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                    <p className="font-bold text-gray-800">Доставка по Беларуси:</p>
                                                    <ul className="list-disc ml-5 mt-2 space-y-1">
                                                        <li>Европочта (до отделения) — 2-4 дня.</li>
                                                        <li>Белпочта (наложенный платеж) — 3-5 дней.</li>
                                                        <li>Курьерская служба — 1-2 дня.</li>
                                                    </ul>
                                                </div>
                                                <p className="text-gray-500 italic">Все заказы упаковываются в непрозрачную упаковку без опознавательных знаков.</p>
                                            </div>
                                        </AccordionItem>
                                    </div>

                                    <div id="payment">
                                        <AccordionItem
                                            question="Оплата"
                                            isOpen={openId === 'payment'}
                                            onClick={() => toggleItem('payment')}
                                        >
                                            <div className="space-y-4 text-sm leading-relaxed">
                                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <li className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                                                        <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center text-green-600 font-bold">BYN</div>
                                                        <span>Наличными курьеру</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                                                        <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold">💳</div>
                                                        <span>Картой через терминал</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                                                        <div className="w-8 h-8 bg-orange-50 rounded-full flex items-center justify-center text-orange-600 font-bold">🔗</div>
                                                        <span>Онлайн на сайте (ЕРИП)</span>
                                                    </li>
                                                    <li className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl">
                                                        <div className="w-8 h-8 bg-purple-50 rounded-full flex items-center justify-center text-purple-600 font-bold">🏷️</div>
                                                        <span>Карты рассрочки (Халва, Черепаха)</span>
                                                    </li>
                                                </ul>
                                            </div>
                                        </AccordionItem>
                                    </div>

                                    {faqs.map((faq) => (
                                        <AccordionItem
                                            key={faq.id}
                                            question={faq.question}
                                            answer={faq.answer}
                                            isOpen={openId === faq.id}
                                            onClick={() => toggleItem(faq.id)}
                                        />
                                    ))}
                                    {faqs.length === 0 && (
                                        <div className="p-8 text-center text-gray-500 italic">
                                            На данный момент вопросов и ответов нет.
                                        </div>
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </div>
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.3s ease-out forwards;
                }
                .swiper-button-next, .swiper-button-prev {
                    color: #ef4444 !important;
                }
                .swiper-pagination-bullet-active {
                    background: #ef4444 !important;
                }
            `}</style>
        </MainLayout>
    );
};

export default About;

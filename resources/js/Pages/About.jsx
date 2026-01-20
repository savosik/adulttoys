import React, { useState } from 'react';
import MainLayout from '@/Layouts/MainLayout';
import { Head } from '@inertiajs/react';

const AccordionItem = ({ question, answer, isOpen, onClick }) => {
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
                <div className="px-6 pb-4 text-gray-600 animate-fadeIn">
                    <p className="whitespace-pre-line">{answer}</p>
                </div>
            )}
        </div>
    );
};

const About = ({ faqs }) => {
    const [openId, setOpenId] = useState(null);

    const toggleItem = (id) => {
        setOpenId(openId === id ? null : id);
    };

    return (
        <MainLayout>
            <Head title="О нас и FAQ" />
            
            <div className="flex-1 overflow-y-auto content-scroll bg-white">
                <div className="max-w-4xl mx-auto px-4 py-12">
                    <section className="mb-12 px-4">
                        <p className="text-xl text-gray-600 max-w-2xl leading-relaxed">
                            Добро пожаловать в наш интернет-магазин. Мы стремимся предоставлять лучшие товары и качественный сервис. Наша миссия — сделать ваши покупки удобными и приятными.
                        </p>
                    </section>

                    <section>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
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
            `}</style>
        </MainLayout>
    );
};

export default About;

import React, { useState, useEffect } from 'react';

const AGE_VERIFIED_KEY = 'age_verified';
const SESSION_DURATION = 60 * 60 * 1000; // 1 hour in milliseconds

export const isAgeVerified = () => {
    if (typeof window === 'undefined') return true; // SSR safe

    const stored = localStorage.getItem(AGE_VERIFIED_KEY);
    if (!stored) return false;

    try {
        const { verified, timestamp } = JSON.parse(stored);
        const now = Date.now();

        // Check if session is still valid (within 1 hour)
        if (verified && (now - timestamp) < SESSION_DURATION) {
            return true;
        }

        // Session expired, clear it
        localStorage.removeItem(AGE_VERIFIED_KEY);
        return false;
    } catch {
        localStorage.removeItem(AGE_VERIFIED_KEY);
        return false;
    }
};

export const setAgeVerified = () => {
    localStorage.setItem(AGE_VERIFIED_KEY, JSON.stringify({
        verified: true,
        timestamp: Date.now()
    }));
};

const AgeVerification = ({ onVerified }) => {
    const [day, setDay] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [error, setError] = useState('');
    const [isVisible, setIsVisible] = useState(true);

    const validateAge = () => {
        setError('');

        const dayNum = parseInt(day, 10);
        const monthNum = parseInt(month, 10);
        const yearNum = parseInt(year, 10);

        // Validate input
        if (!day || !month || !year) {
            setError('Пожалуйста, заполните все поля');
            return;
        }

        if (isNaN(dayNum) || isNaN(monthNum) || isNaN(yearNum)) {
            setError('Введите корректную дату');
            return;
        }

        if (dayNum < 1 || dayNum > 31) {
            setError('Некорректный день');
            return;
        }

        if (monthNum < 1 || monthNum > 12) {
            setError('Некорректный месяц');
            return;
        }

        if (yearNum < 1900 || yearNum > new Date().getFullYear()) {
            setError('Некорректный год');
            return;
        }

        // Create birth date
        const birthDate = new Date(yearNum, monthNum - 1, dayNum);

        // Check if date is valid
        if (birthDate.getDate() !== dayNum) {
            setError('Некорректная дата');
            return;
        }

        // Calculate age
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        if (age < 18) {
            // Close site for users under 18
            setError('Доступ запрещён. Вам должно быть 18 лет или больше.');
            setTimeout(() => {
                // Close the browser tab/window or redirect away
                window.location.href = 'https://www.google.com';
            }, 1500);
            return;
        }

        // Age verified - save to localStorage and notify parent
        setAgeVerified();
        setIsVisible(false);
        onVerified?.();
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            validateAge();
        }
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl border border-gray-700">
                {/* Header */}
                <div className="p-8 text-center">
                    {/* Warning Icon */}
                    <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-500/30">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="w-10 h-10 text-white"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                            <line x1="12" y1="9" x2="12" y2="13" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold text-white mb-3">
                        Подтвердите возраст
                    </h2>

                    {/* Description */}
                    <p className="text-gray-400 text-sm leading-relaxed mb-8">
                        Этот сайт содержит материалы, предназначенные только для лиц старше 18 лет.
                        Пожалуйста, введите дату своего рождения.
                    </p>

                    {/* Date Input */}
                    <div className="flex gap-3 mx-auto justify-center mb-6">
                        <input
                            type="text"
                            placeholder="ДД"
                            maxLength={2}
                            value={day}
                            onChange={(e) => setDay(e.target.value.replace(/\D/g, ''))}
                            onKeyDown={handleKeyDown}
                            className="w-16 h-14 text-center text-xl font-bold bg-gray-800/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-0 focus:outline-none transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="ММ"
                            maxLength={2}
                            value={month}
                            onChange={(e) => setMonth(e.target.value.replace(/\D/g, ''))}
                            onKeyDown={handleKeyDown}
                            className="w-16 h-14 text-center text-xl font-bold bg-gray-800/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-0 focus:outline-none transition-colors"
                        />
                        <input
                            type="text"
                            placeholder="ГГГГ"
                            maxLength={4}
                            value={year}
                            onChange={(e) => setYear(e.target.value.replace(/\D/g, ''))}
                            onKeyDown={handleKeyDown}
                            className="w-20 h-14 text-center text-xl font-bold bg-gray-800/50 border-2 border-gray-600 rounded-xl text-white placeholder-gray-500 focus:border-red-500 focus:ring-0 focus:outline-none transition-colors"
                        />
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 text-red-400 text-sm font-medium bg-red-500/10 px-4 py-3 rounded-xl border border-red-500/20">
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={validateAge}
                        className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-4 rounded-2xl transition-all shadow-lg shadow-red-500/30 active:scale-95"
                    >
                        Подтвердить
                    </button>

                    {/* Legal Text */}
                    <p className="mt-6 text-gray-500 text-xs leading-relaxed">
                        Продолжая, вы подтверждаете, что вам исполнилось 18 лет и вы согласны с условиями использования сайта.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AgeVerification;

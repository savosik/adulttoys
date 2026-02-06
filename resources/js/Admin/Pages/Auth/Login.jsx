import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/login');
    };

    return (
        <>
            <Head title="Вход в админ-панель" />

            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4">
                <div className="w-full max-w-md">
                    {/* Logo/Brand */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
                        <p className="text-white/70">Войдите в свой аккаунт</p>
                    </div>

                    {/* Login Card */}
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none`}
                                    placeholder="admin@example.com"
                                    autoComplete="email"
                                />
                                {errors.email && (
                                    <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Пароль
                                </label>
                                <input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'
                                        } focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none`}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                />
                                {errors.password && (
                                    <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            {/* Remember me */}
                            <div className="flex items-center">
                                <input
                                    id="remember"
                                    type="checkbox"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                />
                                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                                    Запомнить меня
                                </label>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:from-indigo-700 hover:to-purple-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {processing ? 'Вход...' : 'Войти'}
                            </button>
                        </form>
                    </div>

                    {/* Back to site */}
                    <div className="text-center mt-6">
                        <a href="/" className="text-white/80 hover:text-white text-sm transition-colors">
                            ← Вернуться на сайт
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

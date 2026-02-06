import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

export default function UserCreate() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_admin: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post('/admin/users');
    };

    return (
        <AdminLayout title="Новый пользователь">
            <Head title="Новый пользователь" />

            <div className="max-w-2xl">
                <div className="bg-white rounded-2xl shadow-sm p-6">
                    <form onSubmit={submit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none`}
                            />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none`}
                            />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Пароль</label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.password ? 'border-red-500' : 'border-gray-200'} focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none`}
                            />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                        </div>

                        {/* Password Confirmation */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Подтверждение пароля</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                            />
                        </div>

                        {/* Is Admin */}
                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="is_admin"
                                checked={data.is_admin}
                                onChange={(e) => setData('is_admin', e.target.checked)}
                                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="is_admin" className="text-sm font-medium text-gray-700">
                                Администратор
                            </label>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Сохранение...' : 'Создать'}
                            </button>
                            <Link
                                href="/admin/users"
                                className="px-6 py-3 text-gray-600 hover:text-gray-900 font-medium"
                            >
                                Отмена
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}

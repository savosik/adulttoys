import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '../Layouts/AdminLayout';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
            </div>
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
                {Icon}
            </div>
        </div>
    </div>
);

export default function Dashboard({ stats }) {
    return (
        <AdminLayout title="Dashboard">
            <Head title="Dashboard" />

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <StatCard
                    title="Пользователи"
                    value={stats?.users_count || 0}
                    color="bg-indigo-100"
                    icon={
                        <svg className="w-7 h-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Товары"
                    value={stats?.products_count || 0}
                    color="bg-green-100"
                    icon={
                        <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                    }
                />
                <StatCard
                    title="Заказы"
                    value={stats?.orders_count || 0}
                    color="bg-orange-100"
                    icon={
                        <svg className="w-7 h-7 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                />
            </div>

            {/* Welcome Message */}
            <div className="bg-white rounded-2xl shadow-sm p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Добро пожаловать в админ-панель!</h2>
                <p className="text-gray-600">
                    Здесь вы можете управлять пользователями и настройками сайта.
                </p>
            </div>
        </AdminLayout>
    );
}

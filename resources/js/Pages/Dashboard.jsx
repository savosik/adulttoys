import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="min-h-screen bg-gray-100">
                <nav className="bg-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex items-center">
                                <h1 className="text-2xl font-bold text-gray-800">
                                    E-Commerce Dashboard
                                </h1>
                            </div>
                            <div className="flex items-center">
                                <Link
                                    href="/"
                                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                                >
                                    Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </nav>

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6 bg-white border-b border-gray-200">
                                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                                    Welcome to Your Dashboard
                                </h2>
                                <p className="text-gray-600 mb-8">
                                    This is a sample dashboard page built with Laravel, Inertia.js, and React.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                        <h3 className="text-xl font-semibold text-blue-800 mb-2">
                                            Products
                                        </h3>
                                        <p className="text-3xl font-bold text-blue-600">0</p>
                                        <p className="text-sm text-blue-600 mt-2">Total products</p>
                                    </div>

                                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                        <h3 className="text-xl font-semibold text-green-800 mb-2">
                                            Orders
                                        </h3>
                                        <p className="text-3xl font-bold text-green-600">0</p>
                                        <p className="text-sm text-green-600 mt-2">Total orders</p>
                                    </div>

                                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                        <h3 className="text-xl font-semibold text-purple-800 mb-2">
                                            Customers
                                        </h3>
                                        <p className="text-3xl font-bold text-purple-600">0</p>
                                        <p className="text-sm text-purple-600 mt-2">Total customers</p>
                                    </div>
                                </div>

                                <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                    <h4 className="text-lg font-semibold text-yellow-800 mb-2">
                                        🚀 Quick Start
                                    </h4>
                                    <ul className="list-disc list-inside text-yellow-700 space-y-1">
                                        <li>Run <code className="bg-yellow-100 px-2 py-1 rounded">docker-compose up -d</code> to start all services</li>
                                        <li>Run <code className="bg-yellow-100 px-2 py-1 rounded">docker-compose exec app composer install</code> to install PHP dependencies</li>
                                        <li>Run <code className="bg-yellow-100 px-2 py-1 rounded">docker-compose exec app php artisan key:generate</code> to generate app key</li>
                                        <li>Run <code className="bg-yellow-100 px-2 py-1 rounded">docker-compose exec app php artisan migrate</code> to run migrations</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

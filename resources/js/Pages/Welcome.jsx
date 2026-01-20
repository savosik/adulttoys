import React from 'react';
import { Head, Link } from '@inertiajs/react';

export default function Welcome({ message }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="max-w-4xl mx-auto p-8">
                    <div className="bg-white rounded-lg shadow-2xl p-12 text-center">
                        <h1 className="text-5xl font-bold text-gray-800 mb-4">
                            Welcome to Laravel + Inertia + React
                        </h1>
                        <p className="text-2xl text-gray-600 mb-8">
                            {message}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link
                                href="/catalog"
                                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105 shadow-lg shadow-green-200"
                            >
                                Go to Catalog
                            </Link>
                            <Link
                                href="/dashboard"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
                            >
                                Go to Dashboard
                            </Link>
                            <a
                                href="https://laravel.com/docs"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
                            >
                                Laravel Docs
                            </a>
                            <a
                                href="https://inertiajs.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105"
                            >
                                Inertia.js Docs
                            </a>
                        </div>
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                                Tech Stack
                            </h2>
                            <div className="flex flex-wrap justify-center gap-4 text-gray-600">
                                <span className="bg-red-100 text-red-800 px-4 py-2 rounded-full font-medium">
                                    Laravel 11
                                </span>
                                <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-medium">
                                    React 18
                                </span>
                                <span className="bg-purple-100 text-purple-800 px-4 py-2 rounded-full font-medium">
                                    Inertia.js
                                </span>
                                <span className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-medium">
                                    Tailwind CSS
                                </span>
                                <span className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-medium">
                                    Vite
                                </span>
                                <span className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-full font-medium">
                                    Docker
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

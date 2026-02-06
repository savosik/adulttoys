import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';

const Icons = {
    Dashboard: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
        </svg>
    ),
    Users: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    ),
    Logout: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" x2="9" y1="12" y2="12" />
        </svg>
    ),
    Menu: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <line x1="4" x2="20" y1="12" y2="12" />
            <line x1="4" x2="20" y1="6" y2="6" />
            <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
    ),
    X: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    ),
};

const NavItem = ({ href, icon: Icon, children, active }) => (
    <Link
        href={href}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${active
                ? 'bg-indigo-600 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
    >
        <Icon className={active ? 'text-white' : 'text-gray-400'} />
        <span className="font-medium">{children}</span>
    </Link>
);

export default function AdminLayout({ children, title }) {
    const { auth } = usePage().props;
    const { url } = usePage();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: Icons.Dashboard },
        { name: 'Пользователи', href: '/admin/users', icon: Icons.Users },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <Link href="/admin" className="text-xl font-bold text-indigo-600">
                            Admin Panel
                        </Link>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
                        >
                            <Icons.X />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        {navigation.map((item) => (
                            <NavItem
                                key={item.name}
                                href={item.href}
                                icon={item.icon}
                                active={url === item.href || (item.href !== '/admin' && url.startsWith(item.href))}
                            >
                                {item.name}
                            </NavItem>
                        ))}
                    </nav>

                    {/* User info & Logout */}
                    <div className="p-4 border-t">
                        <div className="flex items-center gap-3 px-4 py-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                <span className="text-indigo-600 font-bold">
                                    {auth?.user?.name?.charAt(0)?.toUpperCase() || 'A'}
                                </span>
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-gray-900 truncate">
                                    {auth?.user?.name}
                                </p>
                                <p className="text-xs text-gray-500 truncate">
                                    {auth?.user?.is_admin ? 'Администратор' : 'Пользователь'}
                                </p>
                            </div>
                        </div>
                        <Link
                            href="/admin/logout"
                            method="post"
                            as="button"
                            className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Icons.Logout />
                            <span className="font-medium">Выйти</span>
                        </Link>
                    </div>
                </div>
            </aside>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top bar */}
                <header className="sticky top-0 z-30 h-16 bg-white shadow-sm flex items-center px-4 lg:px-8">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 mr-4"
                    >
                        <Icons.Menu />
                    </button>
                    <h1 className="text-lg font-semibold text-gray-900">{title}</h1>
                </header>

                {/* Page content */}
                <main className="p-4 lg:p-8">
                    {children}
                </main>
            </div>
        </div>
    );
}

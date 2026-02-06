import React from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '../../Layouts/AdminLayout';

const Icons = {
    Search: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
        </svg>
    ),
    Plus: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M5 12h14" />
            <path d="M12 5v14" />
        </svg>
    ),
    Edit: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            <path d="m15 5 4 4" />
        </svg>
    ),
    Trash: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
        </svg>
    ),
    Shield: (props) => (
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
        </svg>
    ),
};

export default function UsersIndex({ users, filters }) {
    const handleSearch = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        router.get('/admin/users', { search: formData.get('search') }, { preserveState: true });
    };

    const handleDelete = (user) => {
        if (confirm(`Удалить пользователя ${user.name}?`)) {
            router.delete(`/admin/users/${user.id}`);
        }
    };

    return (
        <AdminLayout title="Пользователи">
            <Head title="Пользователи" />

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                {/* Search */}
                <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
                    <Icons.Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        name="search"
                        defaultValue={filters?.search || ''}
                        placeholder="Поиск по имени, email, телефону..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all outline-none"
                    />
                </form>

                {/* Add button */}
                <Link
                    href="/admin/users/create"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors"
                >
                    <Icons.Plus />
                    Добавить
                </Link>
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Пользователь</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Телефон</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Роль</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">Дата</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">Действия</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.data?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                                <span className="text-indigo-600 font-bold">
                                                    {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-900">{user.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                    <td className="px-6 py-4 text-gray-600">{user.phone || '—'}</td>
                                    <td className="px-6 py-4">
                                        {user.is_admin ? (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 text-xs font-medium rounded-full">
                                                <Icons.Shield />
                                                Админ
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
                                                Пользователь
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500 text-sm">
                                        {new Date(user.created_at).toLocaleDateString('ru-RU')}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <Link
                                                href={`/admin/users/${user.id}/edit`}
                                                className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            >
                                                <Icons.Edit />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(user)}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                            >
                                                <Icons.Trash />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Empty state */}
                {(!users.data || users.data.length === 0) && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">Пользователи не найдены</p>
                    </div>
                )}

                {/* Pagination */}
                {users.links && users.links.length > 3 && (
                    <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                        <p className="text-sm text-gray-500">
                            Показано {users.from} - {users.to} из {users.total}
                        </p>
                        <div className="flex gap-1">
                            {users.links.map((link, index) => (
                                <Link
                                    key={index}
                                    href={link.url || '#'}
                                    className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${link.active
                                            ? 'bg-indigo-600 text-white'
                                            : link.url
                                                ? 'text-gray-600 hover:bg-gray-100'
                                                : 'text-gray-300 cursor-not-allowed'
                                        }`}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}

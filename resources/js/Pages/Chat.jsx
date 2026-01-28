import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ChatWindow from '@/Components/Chat/ChatWindow';

export default function Chat() {
    return (
        <MainLayout>
            <Head title="AI Assistant Chat" />
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg h-[600px] flex flex-col">
                        <div className="p-6 border-b border-gray-200">
                            <h2 className="text-xl font-semibold text-gray-800">
                                Чат с ИИ Агентом
                            </h2>
                            <p className="text-sm text-gray-500">
                                Задайте вопрос о товарах или получите помощь в подборе.
                            </p>
                        </div>
                        <div className="flex-1 overflow-hidden p-6">
                            <ChatWindow />
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

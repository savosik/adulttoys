import { Head } from '@inertiajs/react';
import MainLayout from '@/Layouts/MainLayout';
import ChatWindow from '@/Components/Chat/ChatWindow';

export default function Chat() {
    return (
        <MainLayout>
            <Head title="AI Assistant Chat" />
            <div className="max-w-4xl mx-auto h-[calc(100vh-65px)] sm:pt-4 sm:pb-4 flex flex-col">
                <ChatWindow />
            </div>
        </MainLayout>
    );
}

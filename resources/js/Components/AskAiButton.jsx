import React from 'react';
import { useChatStore } from '@/stores/chatStore';

const SparklesIcon = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
    </svg>
);

const AskAiButton = ({ productName, className = '' }) => {
    const { openChat, setDraftMessage } = useChatStore();

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDraftMessage(`Расскажи мне о товаре: ${productName}`, true);
        openChat();
    };

    return (
        <div className="relative group/ai">
            <button
                onClick={handleClick}
                className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 ${className}`}
                title="Спросить у ИИ помощника"
            >
                <SparklesIcon className="w-5 h-5 text-indigo-700" />
            </button>
        </div>
    );
};

export default AskAiButton;

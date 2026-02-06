import { createInertiaApp } from '@inertiajs/react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import './bootstrap';

const appName = import.meta.env.VITE_APP_NAME || 'Admin';

createInertiaApp({
    title: (title) => `${title} - ${appName}`,
    resolve: (name) => {
        const pages = import.meta.glob('./Admin/Pages/**/*.jsx', { eager: true });
        return pages[`./Admin/Pages/${name}.jsx`];
    },
    setup({ el, App, props }) {
        if (import.meta.env.SSR) {
            hydrateRoot(el, <App {...props} />);
        } else {
            createRoot(el).render(<App {...props} />);
        }
    },
    progress: {
        color: '#4F46E5',
    },
});

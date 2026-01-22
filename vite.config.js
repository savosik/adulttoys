import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [
        laravel({
            input: ['resources/css/app.css', 'resources/js/app.jsx'],
            refresh: true,
        }),
        react(),
    ],
    server: {
        host: '0.0.0.0',
        port: 5173,
        strictPort: true,
        cors: true,
        hmr: {
            host: 'localhost',
        },
        watch: {
            usePolling: true,
        }
    },
    build: {
        // Production optimizations
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: true, // Remove console.logs in production
                drop_debugger: true,
            },
        },
        // Code splitting for better caching
        rollupOptions: {
            output: {
                manualChunks: {
                    // Split vendor chunks
                    'vendor-react': ['react', 'react-dom'],
                    'vendor-inertia': ['@inertiajs/react'],
                    'vendor-swiper': ['swiper'],
                },
            },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
        // Enable CSS code splitting
        cssCodeSplit: true,
    },
});

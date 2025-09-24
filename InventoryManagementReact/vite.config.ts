import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';
import { createHtmlPlugin } from 'vite-plugin-html';

// https://vite.dev/config/
export default defineConfig({
    plugins: [
        react({
            // Enable React 18 features
            jsxRuntime: 'automatic',
        }),
        tailwindcss(),
        // HTML optimization plugin
        createHtmlPlugin({
            minify: process.env.NODE_ENV === 'production',
            inject: {
                data: {
                    title: 'Inventory Management System - Modern Business Solution',
                    description:
                        'A comprehensive inventory management system built with React, TypeScript, and modern web technologies.',
                },
            },
        }),
        // Only show visualizer in development
        process.env.NODE_ENV === 'development' &&
            visualizer({
                open: false,
                filename: 'dist/stats.html',
            }),
    ].filter(Boolean),
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
    optimizeDeps: {
        include: [
            '@stomp/stompjs',
            'react',
            'react-dom',
            'react-router-dom',
            '@tanstack/react-query',
            'axios',
            'zustand',
            'framer-motion',
            'lucide-react',
            'date-fns',
            'zod',
            'react-hook-form',
            '@hookform/resolvers',
        ],
        exclude: ['@tanstack/react-query-devtools'],
    },
    server: {
        port: 5173,
        host: true,
        hmr: {
            overlay: false, // Disable error overlay for better UX
        },
    },
    define: {
        global: 'window',
        __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    },
    build: {
        sourcemap: process.env.NODE_ENV === 'development',
        minify: 'terser',
        terserOptions: {
            compress: {
                drop_console: process.env.NODE_ENV === 'production',
                drop_debugger: process.env.NODE_ENV === 'production',
            },
        },
        chunkSizeWarningLimit: 1000,
        cssCodeSplit: true,
        cssMinify: 'lightningcss',
        rollupOptions: {
            output: {
                manualChunks: {
                    // Vendor chunks for better caching
                    'react-vendor': ['react', 'react-dom', 'react-router-dom'],
                    'query-vendor': ['@tanstack/react-query'],
                    'ui-vendor': [
                        '@radix-ui/react-avatar',
                        '@radix-ui/react-checkbox',
                        '@radix-ui/react-collapsible',
                        '@radix-ui/react-dialog',
                        '@radix-ui/react-dropdown-menu',
                        '@radix-ui/react-label',
                        '@radix-ui/react-popover',
                        '@radix-ui/react-progress',
                        '@radix-ui/react-scroll-area',
                        '@radix-ui/react-select',
                        '@radix-ui/react-separator',
                        '@radix-ui/react-slider',
                        '@radix-ui/react-slot',
                        '@radix-ui/react-switch',
                        '@radix-ui/react-tabs',
                        '@radix-ui/react-toast',
                        '@radix-ui/react-tooltip',
                    ],
                    'form-vendor': [
                        'react-hook-form',
                        '@hookform/resolvers',
                        'zod',
                    ],
                    'utils-vendor': [
                        'axios',
                        'date-fns',
                        'clsx',
                        'tailwind-merge',
                        'class-variance-authority',
                    ],
                    'animation-vendor': ['framer-motion'],
                    'icons-vendor': ['lucide-react'],
                    'websocket-vendor': ['@stomp/stompjs', 'sockjs-client'],
                    'state-vendor': ['zustand'],
                    'theme-vendor': ['next-themes'],
                    'ui-components': ['sonner', 'cmdk', 'input-otp'],
                    'file-vendor': ['react-dropzone'],
                    'date-vendor': ['react-day-picker'],
                },
                // Optimize chunk naming
                chunkFileNames: 'js/[name]-[hash].js',
                entryFileNames: 'js/[name]-[hash].js',
                assetFileNames: (assetInfo) => {
                    if (!assetInfo.name) return 'assets/[name]-[hash].[ext]';

                    const info = assetInfo.name.split('.');
                    const ext = info[info.length - 1];

                    if (/\.(css)$/.test(assetInfo.name)) {
                        return `css/[name]-[hash].${ext}`;
                    }
                    if (
                        /\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(
                            assetInfo.name
                        )
                    ) {
                        return `images/[name]-[hash].${ext}`;
                    }
                    return `assets/[name]-[hash].${ext}`;
                },
            },
        },
    },
    esbuild: {
        // Optimize for production
        drop:
            process.env.NODE_ENV === 'production'
                ? ['console', 'debugger']
                : [],
    },
});

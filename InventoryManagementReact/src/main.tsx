import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Register service worker in production
if (import.meta.env.PROD && 'serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker
            .register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Hide loading fallback when React app loads
const hideLoadingFallback = () => {
    const fallback = document.getElementById('loading-fallback');
    if (fallback) {
        fallback.style.display = 'none';
    }
};

// Create root and render app
const root = createRoot(document.getElementById('root')!);

root.render(
    <StrictMode>
        <App />
    </StrictMode>
);

// Hide loading fallback after React renders
setTimeout(hideLoadingFallback, 100);

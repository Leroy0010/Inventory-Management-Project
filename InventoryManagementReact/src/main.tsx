import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

// Listen for navigation messages from service worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'NAVIGATE') {
            console.log(
                'Service worker requested navigation to:',
                event.data.url
            );
            window.location.href = event.data.url;
        }
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

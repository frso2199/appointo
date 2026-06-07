import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// Register custom PWA offline service worker only in production to prevent caching-loops during development
if ('serviceWorker' in navigator) {
  if ((import.meta as any).env?.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('[AppointO] Dev Service Worker unregistered successfully to prevent caching loops.');
          }
        });
      }
    });
  } else {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[AppointO] Service Worker dynamic load registered scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[AppointO] Service Worker registry failed:', err);
        });
    });
  }
}


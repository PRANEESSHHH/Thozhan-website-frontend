import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from './components/ui/sonner.jsx'
import { Provider } from 'react-redux'
import store from './redux/store.js'
import { persistStore } from 'redux-persist'
import { PersistGate } from 'redux-persist/integration/react'

// Clean any leftover service workers
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    registrations.forEach(registration => {
      registration.unregister();
      console.log('Service worker unregistered');
    });
  });
}

// Clear any potentially corrupted persisted state
const clearStorage = () => {
  try {
    // Remove any redux-persist data
    Object.keys(localStorage)
      .filter(key => key.startsWith('persist:'))
      .forEach(key => localStorage.removeItem(key));
    
    // Remove any service worker caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      });
    }
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

// Clear storage on fresh load if there are issues
if (localStorage.getItem('redux-persist-error') === 'true') {
  clearStorage();
  localStorage.removeItem('redux-persist-error');
}

// Create persistor with error handling
let persistor;
try {
  persistor = persistStore(store, null, () => {
    console.log('Redux persist rehydration complete');
  });
} catch (error) {
  console.error('Redux persist initialization failed:', error);
  // Mark for cleanup on next load
  localStorage.setItem('redux-persist-error', 'true');
  // Create a dummy persistor that does nothing
  persistor = {
    persist: () => {},
    flush: () => Promise.resolve(),
    pause: () => {},
    purge: () => Promise.resolve(),
    getState: () => ({ registry: [], bootstrapped: true }),
    dispatch: store.dispatch
  };
}

// Render app with error boundary
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate 
        loading={<div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>} 
        persistor={persistor}
        onBeforeLift={() => {
          // Additional cleanup before app starts
          if (localStorage.getItem('redux-state-corrupted') === 'true') {
            clearStorage();
          }
        }}
      >
        <App />
        <Toaster />
      </PersistGate>
    </Provider>
  </React.StrictMode>,
)

import React, { StrictMode, Component } from 'react'
import { createRoot } from 'react-dom/client'
import { registerSW } from 'virtual:pwa-register'
import './index.css'
import App from './App.jsx'

// Register Vite PWA Service Worker
registerSW({ immediate: true })

// Error Boundary to prevent any blank screen crash
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CarePill Application Error:", error, errorInfo);
  }

  handleResetStorage = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();

      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map(key => caches.delete(key)));
      }

      if ('serviceWorker' in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (let registration of registrations) {
          await registration.unregister();
        }
      }
    } catch (e) {
      console.warn("Storage reset cleanup error:", e);
    }
    // Hard bypass cache reload
    window.location.href = window.location.origin + window.location.pathname + '?clear=' + Date.now();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'system-ui, sans-serif',
          background: '#f8fafc',
          color: '#0f172a'
        }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>💊</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.5rem' }}>
            CarePill AI — Réinitialisation de Sécurité
          </h1>
          <p style={{ color: '#64748b', maxWidth: '480px', marginBottom: '1.5rem', fontWeight: 600 }}>
            Une version mise à jour a été installée. Cliquez ci-dessous pour vider le cache du navigateur et relancer l'application.
          </p>
          <button
            onClick={this.handleResetStorage}
            style={{
              padding: '0.9rem 1.85rem',
              borderRadius: '16px',
              background: '#0284c7',
              color: '#ffffff',
              border: 'none',
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 16px rgba(2, 132, 199, 0.35)'
            }}
          >
            🔄 Vider le Cache & Relancer l'App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)

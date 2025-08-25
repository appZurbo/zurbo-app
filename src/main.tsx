// ULTIMATE CACHE BREAKER v66.0 - SW DISABLED
import { createRoot } from 'react-dom/client'

console.log('🔥 CACHE BREAKER v66.0 - SERVICE WORKER DISABLED, NO CSS, PURE REACT');

// Unregister service worker to prevent caching
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('🗑️ Unregistered SW:', registration);
    }
  });
}

function PureReact() {
  return (
    <div style={{ 
      padding: '30px', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#333', marginBottom: '20px' }}>
        🔥 Pure React v66.0 - NO TOAST, NO SW, NO CACHE
      </h1>
      <p style={{ color: '#666', fontSize: '18px', marginBottom: '10px' }}>
        Successfully bypassed all caching mechanisms
      </p>
      <p style={{ color: '#888', fontSize: '14px' }}>
        Time: {new Date().toLocaleString()}
      </p>
      <p style={{ color: '#888', fontSize: '14px' }}>
        Random: {Math.random()}
      </p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <PureReact />
)

import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { AuthProvider } from '@/hooks/useAuth'
import { initializeCapacitor } from '@/utils/capacitor'

// Initialize Capacitor when app starts
initializeCapacitor();

createRoot(document.getElementById("root")!).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);

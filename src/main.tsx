
// Emergency cache breaker - useToast completely removed v4
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🚨 CREATED TEMPORARY PLACEHOLDERS - Cache-breaking fix v10.0');

createRoot(document.getElementById("root")!).render(
  <App />
);

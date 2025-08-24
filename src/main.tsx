
// Complete cache reset - deleted problematic files
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

console.log('🔥 COMPLETE CLEANUP - Deleted toast files to break cache v12.0');

createRoot(document.getElementById("root")!).render(
  <App />
);

// ULTIMATE MINIMAL ENTRY POINT
import { createRoot } from 'react-dom/client'
import MinimalApp from './MinimalApp.tsx'
import './index.css'

console.log('🎯 MINIMAL APP v64.0 - NO TOAST WHATSOEVER');

createRoot(document.getElementById("root")!).render(
  <MinimalApp />
)
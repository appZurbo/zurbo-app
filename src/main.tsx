// ULTRA MINIMAL CACHE BREAKER v65.0
import { createRoot } from 'react-dom/client'
import './index.css'

console.log('🚀 CACHE BREAKER v65.0 - ZERO EXTERNAL COMPONENTS');

function UltraMinimal() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Ultra Minimal Test v65.0</h1>
      <p>Testing React without ANY external imports</p>
      <p>Current time: {new Date().toLocaleString()}</p>
    </div>
  );
}

createRoot(document.getElementById("root")!).render(
  <UltraMinimal />
)
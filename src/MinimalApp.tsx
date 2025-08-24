// MINIMAL APP - ZERO TOAST SYSTEM
import { BrowserRouter, Routes, Route } from "react-router-dom";

function MinimalApp() {
  return (
    <div>
      <h1>Minimal App - No Toast System</h1>
      <p>Testing if basic React app works without any toast system</p>
      
      <BrowserRouter>
        <Routes>
          <Route path="/" element={
            <div>
              <h2>Homepage</h2>
              <p>If you see this, the cache issue is resolved!</p>
            </div>
          } />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default MinimalApp;
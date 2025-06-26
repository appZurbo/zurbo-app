
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import Index from './pages/Index';
import AuthPage from './pages/AuthPage';
import Settings from './pages/Settings';
import PrestadoresPage from './pages/PrestadoresPage';
import PrestadorDashboard from './pages/PrestadorDashboard';
import AgendaPrestador from './pages/AgendaPrestador';
import TrabalheConosco from './pages/TrabalheConosco';
import { MobileLayoutImproved } from './components/mobile/MobileLayoutImproved';
import Pedidos from './pages/Pedidos';
import Planos from './pages/Planos';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <MobileLayoutImproved>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/prestadores" element={<PrestadoresPage />} />
            <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
            <Route path="/agenda-prestador" element={<AgendaPrestador />} />
            <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/planos" element={<Planos />} />
          </Routes>
        </MobileLayoutImproved>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

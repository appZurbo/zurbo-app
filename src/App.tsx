
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
import { MobileLayout } from './components/mobile/MobileLayout';
import Pedidos from './pages/Pedidos';
import PlanoPremium from './pages/PlanoPremium';
import Planos from './pages/Planos';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster />
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/prestadores" element={<PrestadoresPage />} />
            <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
            <Route path="/agenda-prestador" element={<AgendaPrestador />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/plano-premium" element={<PlanoPremium />} />
            <Route path="/planos" element={<Planos />} />
          </Routes>
        </MobileLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

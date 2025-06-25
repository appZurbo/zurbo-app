import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient } from 'react-query';

import Home from './pages/Home';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import Prestadores from './pages/Prestadores';
import PrestadorDashboard from './pages/PrestadorDashboard';
import AgendaPrestador from './pages/AgendaPrestador';
import Servicos from './pages/Servicos';
import Perfil from './pages/Perfil';
import Notificacoes from './pages/Notificacoes';
import Pedidos from './pages/Pedidos';
import PlanoPremium from './pages/PlanoPremium';
import Planos from './pages/Planos';

function App() {
  return (
    <QueryClient>
      <BrowserRouter>
        <Toaster />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/configuracoes" element={<Settings />} />
          <Route path="/prestadores" element={<Prestadores />} />
          <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
          <Route path="/agenda-prestador" element={<AgendaPrestador />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/notificacoes" element={<Notificacoes />} />
          <Route path="/pedidos" element={<Pedidos />} />
          <Route path="/plano-premium" element={<PlanoPremium />} />
          <Route path="/planos" element={<Planos />} />
        </Routes>
      </BrowserRouter>
    </QueryClient>
  );
}

export default App;

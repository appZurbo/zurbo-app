
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ImprovedHeader } from '@/components/layout/ImprovedHeader';
import { ModernFooter } from '@/components/layout/ModernFooter';
import Index from '@/pages/Index';
import Settings from '@/pages/Settings';
import PrestadoresPage from '@/pages/PrestadoresPage';
import NotFound from '@/pages/NotFound';
import Pedidos from '@/pages/Pedidos';
import Conversas from '@/pages/Conversas';
import AuthPage from '@/pages/AuthPage';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <ImprovedHeader />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/prestadores" element={<PrestadoresPage />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/conversas" element={<Conversas />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <ModernFooter />
        <Toaster />
      </div>
    </Router>
  );
}

export default App;

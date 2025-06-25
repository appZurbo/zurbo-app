
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { ImprovedHeader } from '@/components/layout/ImprovedHeader';
import { ModernFooter } from '@/components/layout/ModernFooter';
import { MobileLayout } from '@/components/mobile/MobileLayout';
import { useMobile } from '@/hooks/useMobile';
import { useSecurity } from '@/hooks/useSecurity';
import Index from '@/pages/Index';
import Settings from '@/pages/Settings';
import PrestadoresPage from '@/pages/PrestadoresPage';
import PrestadorProfile from '@/pages/PrestadorProfile';
import NotFound from '@/pages/NotFound';
import Pedidos from '@/pages/Pedidos';
import Conversas from '@/pages/Conversas';
import AuthPage from '@/pages/AuthPage';
import NotificacoesPage from '@/pages/NotificacoesPage';
import ReportPage from '@/pages/ReportPage';
import PrestadorDashboard from '@/pages/PrestadorDashboard';
import AgendaPrestador from '@/pages/AgendaPrestador';
import FavoritosPage from '@/pages/FavoritosPage';
import SobreNos from '@/pages/SobreNos';
import ComoFunciona from '@/pages/ComoFunciona';
import CentralAjuda from '@/pages/CentralAjuda';
import PlanoPremium from '@/pages/PlanoPremium';
import TermosUso from '@/pages/TermosUso';
import PoliticaPrivacidade from '@/pages/PoliticaPrivacidade';
import RegrasComunidade from '@/pages/RegrasComunidade';

function App() {
  const isMobile = useMobile();
  
  // Integrar hook de segurança
  const { logSecurityEvent } = useSecurity();

  if (isMobile) {
    return (
      <Router>
        <MobileLayout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/configuracoes" element={<Settings />} />
            <Route path="/prestadores" element={<PrestadoresPage />} />
            <Route path="/prestador/:id" element={<PrestadorProfile />} />
            <Route path="/servicos" element={<PrestadoresPage />} />
            <Route path="/perfil" element={<Settings />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/conversas" element={<Conversas />} />
            <Route path="/notificacoes" element={<NotificacoesPage />} />
            <Route path="/denuncia/:id" element={<ReportPage />} />
            <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
            <Route path="/agenda-prestador" element={<AgendaPrestador />} />
            <Route path="/favoritos" element={<FavoritosPage />} />
            
            {/* Páginas do rodapé */}
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/central-ajuda" element={<CentralAjuda />} />
            <Route path="/plano-premium" element={<PlanoPremium />} />
            <Route path="/termos-uso" element={<TermosUso />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/regras-comunidade" element={<RegrasComunidade />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MobileLayout>
        <Toaster />
      </Router>
    );
  }

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
            <Route path="/prestador/:id" element={<PrestadorProfile />} />
            <Route path="/pedidos" element={<Pedidos />} />
            <Route path="/conversas" element={<Conversas />} />
            <Route path="/notificacoes" element={<NotificacoesPage />} />
            <Route path="/denuncia/:id" element={<ReportPage />} />
            <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
            <Route path="/agenda-prestador" element={<AgendaPrestador />} />
            <Route path="/favoritos" element={<FavoritosPage />} />
            
            {/* Páginas do rodapé */}
            <Route path="/sobre-nos" element={<SobreNos />} />
            <Route path="/como-funciona" element={<ComoFunciona />} />
            <Route path="/central-ajuda" element={<CentralAjuda />} />
            <Route path="/plano-premium" element={<PlanoPremium />} />
            <Route path="/termos-uso" element={<TermosUso />} />
            <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
            <Route path="/regras-comunidade" element={<RegrasComunidade />} />
            
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

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/hooks/useAuth';
import Index from '@/pages/Index';
import AuthPage from '@/pages/AuthPage';
import PrestadoresPage from '@/pages/PrestadoresPage';
import PrestadorProfile from '@/pages/PrestadorProfile';
import PrestadorDashboard from '@/pages/PrestadorDashboard';
import AgendaPrestador from '@/pages/AgendaPrestador';
import Pedidos from '@/pages/Pedidos';
import Conversas from '@/pages/Conversas';
import FavoritosPage from '@/pages/FavoritosPage';
import NotificacoesPage from '@/pages/NotificacoesPage';
import Settings from '@/pages/Settings';
import WorkerSettings from '@/pages/WorkerSettings';
import ClientSettings from '@/pages/ClientSettings';
import PrestadorSettingsImproved from '@/pages/PrestadorSettingsImproved';
import Planos from '@/pages/Planos';
import PremiumOverview from '@/pages/PremiumOverview';
import ComoFunciona from '@/pages/ComoFunciona';
import SobreNos from '@/pages/SobreNos';
import RegrasComunidade from '@/pages/RegrasComunidade';
import PoliticaPrivacidade from '@/pages/PoliticaPrivacidade';
import TermosUso from '@/pages/TermosUso';
import CentralAjuda from '@/pages/CentralAjuda';
import TrabalheConosco from '@/pages/TrabalheConosco';
import InformacoesUnificada from '@/pages/InformacoesUnificada';
import AdsPage from '@/pages/AdsPage';
import TestingDashboard from '@/pages/TestingDashboard';
import SystemSettings from '@/pages/SystemSettings';
import AdminDashboard from '@/pages/AdminDashboard';
import AdminContentModeration from '@/pages/AdminContentModeration';
import NotFound from '@/pages/NotFound';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-background">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/prestadores" element={<PrestadoresPage />} />
              <Route path="/prestador/:id" element={<PrestadorProfile />} />
              <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
              <Route path="/dashboard" element={<PrestadorDashboard />} />
              <Route path="/agenda" element={<AgendaPrestador />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/conversas" element={<Conversas />} />
              <Route path="/favoritos" element={<FavoritosPage />} />
              <Route path="/notificacoes" element={<NotificacoesPage />} />
              
              {/* New separated settings routes */}
              <Route path="/workersettings" element={<WorkerSettings />} />
              <Route path="/clientsettings" element={<ClientSettings />} />
              
              {/* Keep original settings route for fallback */}
              <Route path="/settings" element={<Settings />} />
              <Route path="/prestador-settings" element={<PrestadorSettingsImproved />} />
              
              <Route path="/planos" element={<Planos />} />
              <Route path="/premium" element={<PremiumOverview />} />
              <Route path="/como-funciona" element={<ComoFunciona />} />
              <Route path="/sobre-nos" element={<SobreNos />} />
              <Route path="/regras-comunidade" element={<RegrasComunidade />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/termos-uso" element={<TermosUso />} />
              <Route path="/central-ajuda" element={<CentralAjuda />} />
              <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
              <Route path="/informacoes" element={<InformacoesUnificada />} />
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/testing" element={<TestingDashboard />} />
              <Route path="/system-settings" element={<SystemSettings />} />
              
              {/* Admin routes */}
              <Route path="/admin/relatorios" element={<AdminDashboard />} />
              <Route path="/admin/usuarios" element={<AdminDashboard />} />
              <Route path="/admin/moderacao" element={<AdminContentModeration />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

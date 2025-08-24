
import { SimpleToaster } from "@/components/ui/simple-toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import { NotificationSound } from "@/components/notifications/NotificationSound";
import { PWAInstallPrompt } from "@/components/mobile/PWAInstallPrompt";
import { initializeCapacitor } from "@/utils/capacitor";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import PrestadoresPage from "./pages/PrestadoresPage";
import Conversas from "./pages/Conversas";
import Settings from "./pages/Settings";
import PrestadorProfile from "./pages/PrestadorProfile";
import Pedidos from "./pages/Pedidos";
import AdminDashboard from "./pages/AdminDashboard";
import NotFound from "./pages/NotFound";
import NotificacoesPage from "./pages/NotificacoesPage";
import FavoritosPage from "./pages/FavoritosPage";
import AgendaPrestador from "./pages/AgendaPrestador";
import PrestadorDashboard from "./pages/PrestadorDashboard";
import PrestadorSettingsImproved from "./pages/PrestadorSettingsImproved";
import AdsPage from "./pages/AdsPage";
import Planos from "./pages/Planos";
import PremiumOverview from "./pages/PremiumOverview";
import ComoFunciona from "./pages/ComoFunciona";
import TrabalheConosco from "./pages/TrabalheConosco";
import CentralAjuda from "./pages/CentralAjuda";
import TermosUso from "./pages/TermosUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import RegrasComunidade from "./pages/RegrasComunidade";
import SobreNos from "./pages/SobreNos";

import InformacoesUnificada from "./pages/InformacoesUnificada";
import UserManagement from "./pages/admin/UserManagement";
import PrestadorManagement from "./pages/admin/PrestadorManagement";
import Moderacao from "./pages/admin/Moderacao";
import Relatorios from "./pages/admin/Relatorios";
import AdminContentModeration from "./pages/AdminContentModeration";
import ImageManager from "./pages/admin/ImageManager";
import BannerImageManager from "./pages/admin/BannerImageManager";

const queryClient = new QueryClient();

// Initialize Capacitor immediately
initializeCapacitor();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <SimpleToaster />
        <BrowserRouter>
          <AuthProvider>
            <NotificationSound enabled={true} volume={0.3} />
            <PWAInstallPrompt />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/prestadores" element={<PrestadoresPage />} />
              <Route path="/conversas" element={<Conversas />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/prestador/:id" element={<PrestadorProfile />} />
              <Route path="/pedidos" element={<Pedidos />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<UserManagement />} />
              <Route path="/admin/prestadores" element={<PrestadorManagement />} />
              <Route path="/admin/moderacao" element={<Moderacao />} />
              <Route path="/admin/relatorios" element={<Relatorios />} />
              <Route path="/admin/content-moderation" element={<AdminContentModeration />} />
              <Route path="/admin/image-manager" element={<ImageManager />} />
              <Route path="/admin/banner-image-manager" element={<BannerImageManager />} />
              <Route path="/notificacoes" element={<NotificacoesPage />} />
              <Route path="/favoritos" element={<FavoritosPage />} />
              <Route path="/agenda" element={<AgendaPrestador />} />
              <Route path="/dashboard" element={<PrestadorDashboard />} />
              
              <Route path="/ads" element={<AdsPage />} />
              <Route path="/planos" element={<Planos />} />
              <Route path="/premium-overview" element={<PremiumOverview />} />
              <Route path="/como-funciona" element={<ComoFunciona />} />
              <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
              <Route path="/central-ajuda" element={<CentralAjuda />} />
              <Route path="/termos-uso" element={<TermosUso />} />
              <Route path="/politica-privacidade" element={<PoliticaPrivacidade />} />
              <Route path="/regras-comunidade" element={<RegrasComunidade />} />
              <Route path="/sobre-nos" element={<SobreNos />} />
              <Route path="/informacoes" element={<InformacoesUnificada />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

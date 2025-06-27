
import './App.css';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import PrestadoresPage from "./pages/PrestadoresPage";
import PrestadorProfile from "./pages/PrestadorProfile";
import AuthPage from "./pages/AuthPage";
import Settings from "./pages/Settings";
import PrestadorSettings from "./pages/PrestadorSettings";
import PrestadorDashboard from "./pages/PrestadorDashboard";
import AgendaPrestador from "./pages/AgendaPrestador";
import Pedidos from "./pages/Pedidos";
import Conversas from "./pages/Conversas";
import NotificacoesPage from "./pages/NotificacoesPage";
import FavoritosPage from "./pages/FavoritosPage";
import Planos from "./pages/Planos";
import { PremiumOverview } from "./pages/PremiumOverview";
import TrabalheConosco from "./pages/TrabalheConosco";
import ComoFunciona from "./pages/ComoFunciona";
import SobreNos from "./pages/SobreNos";
import TermosUso from "./pages/TermosUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import RegrasComunidade from "./pages/RegrasComunidade";
import CentralAjuda from "./pages/CentralAjuda";
import ReportPage from "./pages/ReportPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import AdminContentModeration from "./pages/AdminContentModeration";
import SystemSettings from "./pages/SystemSettings";
import { Relatorios } from "./pages/admin/Relatorios";
import NotFound from "./pages/NotFound";
import MobileLayoutImproved from "./components/mobile/MobileLayoutImproved";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Toaster />
              <Sonner />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/prestadores" element={<PrestadoresPage />} />
                <Route path="/prestador/:id" element={<PrestadorProfile />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/configuracoes" element={<Settings />} />
                <Route path="/prestador-settings" element={<PrestadorSettings />} />
                <Route path="/prestador-dashboard" element={<PrestadorDashboard />} />
                <Route path="/agenda-prestador" element={<AgendaPrestador />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/conversas" element={<Conversas />} />
                <Route path="/notificacoes" element={<NotificacoesPage />} />
                <Route path="/favoritos" element={<FavoritosPage />} />
                <Route path="/planos" element={<Planos />} />
                <Route path="/premium-overview" element={<PremiumOverview />} />
                <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
                <Route path="/como-funciona" element={<ComoFunciona />} />
                <Route path="/sobre-nos" element={<SobreNos />} />
                <Route path="/termos" element={<TermosUso />} />
                <Route path="/privacidade" element={<PoliticaPrivacidade />} />
                <Route path="/regras" element={<RegrasComunidade />} />
                <Route path="/central-ajuda" element={<CentralAjuda />} />
                <Route path="/report" element={<ReportPage />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/moderacao" element={<AdminContentModeration />} />
                <Route path="/admin/sistema" element={<SystemSettings />} />
                <Route path="/admin/relatorios" element={<Relatorios />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <MobileLayoutImproved />
            </div>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

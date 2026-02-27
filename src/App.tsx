
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import { NotificationSound } from "@/components/notifications/NotificationSound";
import { ProtectedRoute } from "@/components/security/ProtectedRoute";
// Lazy load pages for better performance and code splitting
const Index = lazy(() => import("./pages/Index"));
const AuthPage = lazy(() => import("./pages/AuthPage"));
const PrestadoresPage = lazy(() => import("./pages/PrestadoresPage"));
const Conversas = lazy(() => import("./pages/Conversas"));
const Settings = lazy(() => import("./pages/Settings"));
const PrestadorProfile = lazy(() => import("./pages/PrestadorProfile"));
const Pedidos = lazy(() => import("./pages/Pedidos"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const NotificacoesPage = lazy(() => import("./pages/NotificacoesPage"));
const FavoritosPage = lazy(() => import("./pages/FavoritosPage"));
const AgendaPrestador = lazy(() => import("./pages/AgendaPrestador"));
const PrestadorDashboard = lazy(() => import("./pages/PrestadorDashboard"));
const PrestadorSettingsImproved = lazy(() => import("./pages/PrestadorSettingsImproved"));
const AdsPage = lazy(() => import("./pages/AdsPage"));
const Planos = lazy(() => import("./pages/Planos"));
const PremiumOverview = lazy(() => import("./pages/PremiumOverview"));
const ComoFunciona = lazy(() => import("./pages/ComoFunciona"));
const TrabalheConosco = lazy(() => import("./pages/TrabalheConosco"));
const CentralAjuda = lazy(() => import("./pages/CentralAjuda"));
const TermosUso = lazy(() => import("./pages/TermosUso"));
const PoliticaPrivacidade = lazy(() => import("./pages/PoliticaPrivacidade"));
const RegrasComunidade = lazy(() => import("./pages/RegrasComunidade"));
const SobreNos = lazy(() => import("./pages/SobreNos"));
const OnboardingPage = lazy(() => import("./pages/OnboardingPage"));

import InformacoesUnificada from "./pages/InformacoesUnificada";
import UserManagement from "./pages/admin/UserManagement";
import PrestadorManagement from "./pages/admin/PrestadorManagement";
import ImageManager from "./pages/admin/ImageManager";

const CreateServiceRequest = lazy(() => import("./pages/client/CreateServiceRequest"));
const OpportunitiesMap = lazy(() => import("./pages/provider/OpportunitiesMap"));

const queryClient = new QueryClient();

import { useNativeBridge } from "@/hooks/useNativeBridge";
import { OnboardingGuard } from "@/components/onboarding/OnboardingGuard";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

// Loading component for lazy loaded pages
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-orange-50 to-white">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      <p className="text-gray-600">Carregando...</p>
    </div>
  </div>
);

function App() {
  const { isMobileApp } = useNativeBridge();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <NotificationSound enabled={true} volume={0.3} />
        <Toaster />
        <Sonner />
        {/* Debug indicator for Mobile */}
        {isMobileApp && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            background: '#22c55e',
            color: 'white',
            textAlign: 'center',
            fontSize: '10px',
            padding: '2px',
            zIndex: 9999
          }}>
            📱 Modo App Ativo
          </div>
        )}
        <BrowserRouter>
          <AnalyticsTracker />
          <OnboardingGuard>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/prestadores" element={<PrestadoresPage />} />
                <Route path="/conversas" element={<Conversas />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/prestador/:id" element={<PrestadorProfile />} />
                <Route path="/pedidos" element={<Pedidos />} />
                <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
                <Route path="/admin/users" element={<ProtectedRoute requireAdmin><UserManagement /></ProtectedRoute>} />
                <Route path="/admin/prestadores" element={<ProtectedRoute requireAdmin><PrestadorManagement /></ProtectedRoute>} />
                <Route path="/admin/image-manager" element={<ProtectedRoute requireAdmin><ImageManager /></ProtectedRoute>} />
                <Route path="/notificacoes" element={<NotificacoesPage />} />
                <Route path="/favoritos" element={<FavoritosPage />} />
                <Route path="/agenda" element={<ProtectedRoute requirePrestador><AgendaPrestador /></ProtectedRoute>} />
                <Route path="/dashboard" element={<ProtectedRoute requirePrestador><PrestadorDashboard /></ProtectedRoute>} />
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

                {/* Service Requests */}
                <Route path="/solicitar-servico" element={<ProtectedRoute><CreateServiceRequest /></ProtectedRoute>} />
                <Route path="/mapa-servicos" element={<OpportunitiesMap />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </OnboardingGuard>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

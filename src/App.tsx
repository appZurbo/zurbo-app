
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
import { WelcomeLanding } from "@/components/landing/WelcomeLanding";
import AuthPage from "@/components/auth/AuthPage";
import Index from "./pages/Index";
import { ProfilePageFixed } from "./components/profile/ProfilePageFixed";
import ServiceSelectionPage from "./components/services/ServiceSelectionPage";
import { UserSettings } from "./components/settings/UserSettings";
import TermosUso from "./pages/TermosUso";
import PoliticaPrivacidade from "./pages/PoliticaPrivacidade";
import RegrasComunidade from "./pages/RegrasComunidade";
import PlanoPremium from "./pages/PlanoPremium";
import NotFound from "./pages/NotFound";
import { MobileLayout } from "./components/mobile/MobileLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import PrestadorSettings from "./pages/PrestadorSettings";
import AdminContentModeration from "./pages/AdminContentModeration";
import SystemSettings from "./pages/SystemSettings";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const isMobile = useMobile();
  const [showServiceSelection, setShowServiceSelection] = useState(false);
  const [showWelcome, setShowWelcome] = useState(!isAuthenticated);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Mostrar landing de boas-vindas para usuários não autenticados apenas na primeira visita
  if (!isAuthenticated && showWelcome) {
    return (
      <WelcomeLanding 
        onEnter={() => setShowWelcome(false)}
      />
    );
  }

  // Verificar se precisa mostrar seleção de serviços
  if (isAuthenticated && profile?.tipo === 'prestador' && showServiceSelection) {
    return (
      <ServiceSelectionPage 
        onComplete={() => setShowServiceSelection(false)} 
      />
    );
  }

  const AppRoutes = () => (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/auth" element={
        isAuthenticated ? (
          <Navigate to="/" replace />
        ) : (
          <AuthPage 
            onAuthSuccess={(userType) => {
              if (userType === 'prestador') {
                setShowServiceSelection(true);
              }
            }} 
          />
        )
      } />
      <Route path="/perfil" element={
        isAuthenticated ? (
          <ProfilePageFixed />
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route path="/configuracoes" element={
        isAuthenticated ? (
          <UserSettings />
        ) : (
          <Navigate to="/auth" replace />
        )
      } />
      <Route path="/servicos" element={
        isAuthenticated && profile?.tipo === 'prestador' ? (
          <ServiceSelectionPage onComplete={() => {}} />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/prestador/configuracoes" element={
        isAuthenticated && profile?.tipo === 'prestador' ? (
          <PrestadorSettings />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/admin" element={
        isAuthenticated && (profile?.tipo === 'admin' || profile?.tipo === 'moderator') ? (
          <AdminDashboard />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/admin/moderacao" element={
        isAuthenticated && (profile?.tipo === 'admin' || profile?.tipo === 'moderator') ? (
          <AdminContentModeration />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/admin/sistema" element={
        isAuthenticated && profile?.tipo === 'admin' ? (
          <SystemSettings />
        ) : (
          <Navigate to="/" replace />
        )
      } />
      <Route path="/termos" element={<TermosUso />} />
      <Route path="/privacidade" element={<PoliticaPrivacidade />} />
      <Route path="/regras-comunidade" element={<RegrasComunidade />} />
      <Route path="/premium" element={<PlanoPremium />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );

  // Usar layout mobile se for dispositivo móvel
  if (isMobile) {
    return (
      <BrowserRouter>
        <MobileLayout>
          <AppRoutes />
        </MobileLayout>
      </BrowserRouter>
    );
  }

  // Layout desktop padrão
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthenticatedApp />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

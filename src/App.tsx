import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useMobile } from "@/hooks/useMobile";
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
import { useState } from "react";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const isMobile = useMobile();
  const [showServiceSelection, setShowServiceSelection] = useState(false);

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

  if (!isAuthenticated) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/termos" element={<TermosUso />} />
          <Route path="/privacidade" element={<PoliticaPrivacidade />} />
          <Route path="/regras-comunidade" element={<RegrasComunidade />} />
          <Route path="/premium" element={<PlanoPremium />} />
          <Route path="*" element={
            <AuthPage 
              onAuthSuccess={(userType) => {
                if (userType === 'prestador') {
                  setShowServiceSelection(true);
                }
              }} 
            />} 
          />
        </Routes>
      </BrowserRouter>
    );
  }

  // Verificar se precisa mostrar seleção de serviços
  if (profile?.tipo === 'prestador' && showServiceSelection) {
    return (
      <ServiceSelectionPage 
        onComplete={() => setShowServiceSelection(false)} 
      />
    );
  }

  const AppContent = () => (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/perfil" element={<ProfilePageFixed />} />
        <Route path="/configuracoes" element={<UserSettings />} />
        <Route path="/servicos" element={
          profile?.tipo === 'prestador' ? (
            <ServiceSelectionPage onComplete={() => {}} />
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
    </BrowserRouter>
  );

  // Usar layout mobile se for dispositivo móvel
  if (isMobile) {
    return (
      <MobileLayout>
        <AppContent />
      </MobileLayout>
    );
  }

  // Layout desktop padrão
  return <AppContent />;
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

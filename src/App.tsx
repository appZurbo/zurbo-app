
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import AuthPage from "@/components/auth/AuthPage";
import Index from "./pages/Index";
import ProfilePage from "./components/profile/ProfilePage";
import ServiceSelectionPage from "./components/services/ServiceSelectionPage";
import SettingsPage from "./components/settings/SettingsPage";
import NotFound from "./pages/NotFound";
import { useState } from "react";

const queryClient = new QueryClient();

const AuthenticatedApp = () => {
  const { user, profile, loading, isAuthenticated } = useAuth();
  const [showServiceSelection, setShowServiceSelection] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 orange-gradient rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <AuthPage 
        onAuthSuccess={(userType) => {
          if (userType === 'prestador') {
            setShowServiceSelection(true);
          }
        }} 
      />
    );
  }

  if (showServiceSelection && profile?.tipo === 'prestador') {
    return (
      <ServiceSelectionPage 
        onComplete={() => setShowServiceSelection(false)} 
      />
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/perfil" element={<ProfilePage />} />
        <Route path="/configuracoes" element={
          <SettingsPage onLogout={() => window.location.reload()} />
        } />
        <Route path="/servicos" element={
          profile?.tipo === 'prestador' ? (
            <ServiceSelectionPage onComplete={() => {}} />
          ) : (
            <Navigate to="/" replace />
          )
        } />
        <Route path="*" element={<NotFound />} />
      </Routes>
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

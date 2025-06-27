
import { Suspense, lazy } from 'react';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { MobileDock } from '@/components/mobile/MobileDock';

// Lazy loading das páginas
const Index = lazy(() => import('@/pages/Index'));
const Settings = lazy(() => import('@/pages/Settings'));
const Pedidos = lazy(() => import('@/pages/Pedidos'));
const Conversas = lazy(() => import('@/pages/Conversas'));
const AdminRelatorios = lazy(() => import('@/pages/admin/Relatorios'));
const PrestadoresPage = lazy(() => import('@/pages/PrestadoresPage'));
const AuthPage = lazy(() => import('@/pages/AuthPage'));
const TrabalheConosco = lazy(() => import('@/pages/TrabalheConosco'));
const PrestadorSettings = lazy(() => import('@/pages/PrestadorSettings'));
const Planos = lazy(() => import('@/pages/Planos'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-background font-sans antialiased">
              <Suspense fallback={
                <div className="flex items-center justify-center min-h-screen">
                  <div className="w-16 h-16 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
                    <span className="text-white font-bold text-2xl">Z</span>
                  </div>
                </div>
              }>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/configuracoes" element={<Settings />} />
                  <Route path="/pedidos" element={<Pedidos />} />
                  <Route path="/conversas" element={<Conversas />} />
                  <Route path="/prestadores" element={<PrestadoresPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/trabalhe-conosco" element={<TrabalheConosco />} />
                  <Route path="/prestador-settings" element={<PrestadorSettings />} />
                  <Route path="/planos" element={<Planos />} />
                  <Route path="/admin/relatorios" element={<AdminRelatorios />} />
                </Routes>
              </Suspense>
              <Toaster />
              <MobileDock />
            </div>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

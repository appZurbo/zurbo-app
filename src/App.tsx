
import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/Index";
import AuthPage from "@/pages/AuthPage";
import PrestadoresPage from "@/pages/PrestadoresPage";
import AdminDashboard from "@/pages/AdminDashboard";
import Relatorios from "@/pages/admin/Relatorios";
import Moderacao from "@/pages/admin/Moderacao";
import Conversas from "@/pages/Conversas";
import Settings from "@/pages/Settings";
import AdsPage from "@/pages/AdsPage";
import PrestadorDashboard from "@/pages/PrestadorDashboard";
import AgendaPrestador from "@/pages/AgendaPrestador";
import PrestadorSettings from "@/pages/PrestadorSettings";
import PrestadorProfile from "@/pages/PrestadorProfile";
import Pedidos from "@/pages/Pedidos";
import Planos from "@/pages/Planos";
import PremiumOverview from "@/pages/PremiumOverview";
import FavoritosPage from "@/pages/FavoritosPage";
import NotificacoesPage from "@/pages/NotificacoesPage";
import NotFound from "@/pages/NotFound";
import SobreNos from "@/pages/SobreNos";
import ComoFunciona from "@/pages/ComoFunciona";
import CentralAjuda from "@/pages/CentralAjuda";
import PoliticaPrivacidade from "@/pages/PoliticaPrivacidade";
import RegrasComunidade from "@/pages/RegrasComunidade";
import TermosUso from "@/pages/TermosUso";
import TrabalheConosco from "@/pages/TrabalheConosco";
import ReportPage from "@/pages/ReportPage";
import { AuthProvider } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  {
    path: "/prestadores",
    element: <PrestadoresPage />,
  },
  {
    path: "/prestador/:id",
    element: <PrestadorProfile />,
  },
  {
    path: "/configuracoes",
    element: <Settings />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/relatorios",
    element: <Relatorios />,
  },
  {
    path: "/admin/moderacao",
    element: <Moderacao />,
  },
  {
    path: "/conversas",
    element: <Conversas />,
  },
  {
    path: "/ads",
    element: <AdsPage />,
  },
  {
    path: "/prestador-dashboard",
    element: <PrestadorDashboard />,
  },
  {
    path: "/prestador-settings",
    element: <PrestadorSettings />,
  },
  {
    path: "/agenda",
    element: <AgendaPrestador />,
  },
  {
    path: "/pedidos",
    element: <Pedidos />,
  },
  {
    path: "/planos",
    element: <Planos />,
  },
  {
    path: "/premium-overview",
    element: <PremiumOverview />,
  },
  {
    path: "/premium-dashboard",
    element: <PremiumOverview />,
  },
  {
    path: "/favoritos",
    element: <FavoritosPage />,
  },
  {
    path: "/notificacoes",
    element: <NotificacoesPage />,
  },
  {
    path: "/enderecos",
    element: <Settings />,
  },
  {
    path: "/sobre-nos",
    element: <SobreNos />,
  },
  {
    path: "/como-funciona",
    element: <ComoFunciona />,
  },
  {
    path: "/central-ajuda",
    element: <CentralAjuda />,
  },
  {
    path: "/politica-privacidade",
    element: <PoliticaPrivacidade />,
  },
  {
    path: "/regras-comunidade",
    element: <RegrasComunidade />,
  },
  {
    path: "/termos-uso",
    element: <TermosUso />,
  },
  {
    path: "/trabalhe-conosco",
    element: <TrabalheConosco />,
  },
  {
    path: "/report",
    element: <ReportPage />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
      <Toaster />
    </AuthProvider>
  );
}

export default App;

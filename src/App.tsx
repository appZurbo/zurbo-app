
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
import PrestadorSettingsImproved from "@/pages/PrestadorSettingsImproved";
import PrestadorProfile from "@/pages/PrestadorProfile";
import Pedidos from "@/pages/Pedidos";
import Planos from "@/pages/Planos";
import PremiumOverview from "@/pages/PremiumOverview";
import FavoritosPage from "@/pages/FavoritosPage";
import NotificacoesPage from "@/pages/NotificacoesPage";
import InformacoesPage from "@/pages/InformacoesPage";
import NotFound from "@/pages/NotFound";
import SobreNos from "@/pages/SobreNos";
import TrabalheConosco from "@/pages/TrabalheConosco";
import TestingDashboard from "@/pages/TestingDashboard";
import UserManagement from "@/pages/admin/UserManagement";
import { Toaster } from '@/components/ui/toaster';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';

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
    path: "/admin/testing",
    element: <TestingDashboard />,
  },
  {
    path: "/admin/usuarios",
    element: <UserManagement />,
  },
  {
    path: "/conversas",
    element: <Conversas />,
  },
  {
    path: "/mensagens",
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
    element: <PrestadorSettingsImproved />,
  },
  {
    path: "/agenda-prestador",
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
    path: "/favoritos",
    element: <FavoritosPage />,
  },
  {
    path: "/notificacoes",
    element: <NotificacoesPage />,
  },
  {
    path: "/informacoes",
    element: <InformacoesPage />,
  },
  {
    path: "/sobre-nos",
    element: <SobreNos />,
  },
  {
    path: "/trabalhe-conosco",
    element: <TrabalheConosco />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
      <Toaster />
    </ErrorBoundary>
  );
}

export default App;

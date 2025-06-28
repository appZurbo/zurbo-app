
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
import InformacoesPage from "@/pages/InformacoesPage";
import NotFound from "@/pages/NotFound";
import SobreNos from "@/pages/SobreNos";
import TrabalheConosco from "@/pages/TrabalheConosco";
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
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;

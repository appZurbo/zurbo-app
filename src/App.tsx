
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
import Conversas from "@/pages/Conversas";
import Settings from "@/pages/Settings";
import AdsPage from "@/pages/AdsPage";
import PrestadorDashboard from "@/pages/PrestadorDashboard";
import AgendaPrestador from "@/pages/AgendaPrestador";
import Pedidos from "@/pages/Pedidos";
import Planos from "@/pages/Planos";
import PremiumOverview from "@/pages/PremiumOverview";
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

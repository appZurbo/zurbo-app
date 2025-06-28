import React from 'react';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Profile from "@/pages/Profile";
import Prestadores from "@/pages/Prestadores";
import AdminDashboard from "@/pages/AdminDashboard";
import Relatorios from "@/pages/admin/Relatorios";
import Conversas from "@/pages/Conversas";
import ProtectedRoute from '@/components/ProtectedRoute';
import { AuthProvider } from '@/hooks/useAuth';
import { ToastProvider } from '@/hooks/use-toast';
import { ThemeProvider } from '@/components/theme-provider';
import AdsPage from '@/pages/AdsPage';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: "/prestadores",
    element: (
      <ProtectedRoute>
        <Prestadores />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute requiredAdmin={true}>
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin/relatorios",
    element: (
      <ProtectedRoute requiredAdmin={true}>
        <Relatorios />
      </ProtectedRoute>
    ),
  },
  {
    path: "/conversas",
    element: (
      <ProtectedRoute>
        <Conversas />
      </ProtectedRoute>
    ),
  },
  {
    path: "/ads",
    element: <AdsPage />,
  },
]);

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="zurbo-theme">
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;

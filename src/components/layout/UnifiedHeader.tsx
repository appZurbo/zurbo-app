import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { User, Settings, LogOut, Bell, Home, Users, Crown, MessageCircle, Calendar, BarChart3, Shield, ShoppingBag, Wrench, Newspaper, Heart, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
export const UnifiedHeader = () => {
  const navigate = useNavigate();
  const {
    profile,
    isAuthenticated,
    logout,
    isAdmin,
    isPrestador
  } = useAuth();
  const isMobile = useMobile();
  const {
    toast
  } = useToast();
  const [emServico, setEmServico] = useState(profile?.em_servico ?? true);
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };
  const handleServiceToggle = async (checked: boolean) => {
    if (!profile) return;
    try {
      const {
        error
      } = await supabase.from('users').update({
        em_servico: checked
      } as any).eq('id', profile.id);
      if (error) throw error;
      setEmServico(checked);
      toast({
        title: checked ? "Em serviço" : "Fora de serviço",
        description: checked ? "Você está disponível para novos pedidos" : "Você não receberá novos pedidos"
      });
    } catch (error) {
      console.error('Error updating service status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status de serviço",
        variant: "destructive"
      });
    }
  };
  const isPremium = profile?.premium || false;
  const getPremiumLabel = () => {
    if (!isPremium) return null;
    if (isPrestador) return "PRO - Prestador";
    if (isAdmin) return "PRO - Admin";
    return "PRO - Cliente";
  };
  return <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      
    </header>;
};
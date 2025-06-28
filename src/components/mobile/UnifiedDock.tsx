import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Search, Calendar, User, MessageCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile, useTablet } from '@/hooks/useMobile';

export const UnifiedDock = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profile, isAuthenticated, isPrestador } = useAuth();
  const isMobile = useMobile();
  const isTablet = useTablet();
  
  // This component is now deprecated in favor of ZurboDock
  // Keeping for backward compatibility but returning null
  return null;
};

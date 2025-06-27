
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PrestadorCardImproved } from './PrestadorCardImproved';
import { Crown, Star, Loader2 } from 'lucide-react';
import { UserProfile } from '@/utils/database/types';
import { getPrestadoresPremiumDestaque } from '@/utils/database/prestadores';

interface PremiumHighlightSectionProps {
  onContact: (prestador: UserProfile) => void;
  onViewProfile: (prestador: UserProfile) => void;
}

export const PremiumHighlightSection: React.FC<PremiumHighlightSectionProps> = ({
  onContact,
  onViewProfile
}) => {
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPremiumHighlight();
  }, []);

  const loadPremiumHighlight = async () => {
    try {
      const data = await getPrestadoresPremiumDestaque();
      setPrestadores(data);
    } catch (error) {
      console.error('Error loading premium/highlight prestadores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Carregando destaques...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (prestadores.length === 0) {
    return null;
  }

  return (
    <Card className="mb-8 border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <div className="flex items-center gap-1">
            <Crown className="h-5 w-5 text-yellow-600" />
            <Star className="h-5 w-5 text-orange-600" />
          </div>
          Prestadores Premium e em Destaque
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {prestadores.map(prestador => (
            <PrestadorCardImproved
              key={prestador.id}
              prestador={prestador}
              onContact={onContact}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

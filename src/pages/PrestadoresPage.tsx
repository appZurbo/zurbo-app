
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Users, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ModernFilters } from '@/components/filters/ModernFilters';
import { PrestadorCardImproved } from '@/components/prestadores/PrestadorCardImproved';
import { PrestadorMiniProfileModal } from '@/components/prestadores/PrestadorMiniProfileModal';
import { ContactModal } from '@/components/contact/ContactModal';
import { EmergencyButton } from '@/components/emergency/EmergencyButton';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { getPrestadores } from '@/utils/database/prestadores';
import { UserProfile } from '@/utils/database/types';
import { useToast } from '@/hooks/use-toast';
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';

const PrestadoresPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useMobile();
  const { isAuthenticated } = useAuth();
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPrestador, setSelectedPrestador] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const [filters, setFilters] = useState({
    cidade: '',
    servico: '',
    precoMin: undefined as number | undefined,
    precoMax: undefined as number | undefined,
    notaMin: undefined as number | undefined
  });

  useEffect(() => {
    loadPrestadores();
  }, [filters]);

  const loadPrestadores = async () => {
    setLoading(true);
    try {
      const data = await getPrestadores(filters);
      setPrestadores(data);
    } catch (error) {
      console.error('Error loading prestadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prestadores.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (prestador: UserProfile) => {
    setSelectedPrestador(prestador);
    setShowContactModal(true);
  };

  const handleViewProfile = (prestador: UserProfile) => {
    setSelectedPrestador(prestador);
    setShowProfileModal(true);
  };

  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      <div className={`${isMobile ? 'px-4 py-4 pb-20' : 'max-w-7xl mx-auto p-6'}`}>
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {!isMobile && 'Voltar'}
          </Button>
          
          <div className="flex-1">
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
              Prestadores de Serviços
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
              Encontre o profissional ideal para suas necessidades
            </p>
          </div>
        </div>

        {/* Emergency SOS Button - moved from Index page */}
        {isAuthenticated && (
          <div className="mb-8">
            <EmergencyButton />
          </div>
        )}

        {/* Filtros */}
        <div className="mb-8">
          <ModernFilters onFiltersChange={handleFiltersChange} servicos={[]} />
        </div>

        {/* Lista de Prestadores */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
            <span className="ml-2 text-gray-600">Carregando prestadores...</span>
          </div>
        ) : prestadores.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold mb-2">Nenhum prestador encontrado</h3>
              <p className="text-gray-600 mb-4">
                Não encontramos prestadores que correspondam aos seus filtros.
              </p>
              <Button onClick={() => setFilters({
                cidade: '',
                servico: '',
                precoMin: undefined,
                precoMax: undefined,
                notaMin: undefined
              })}>
                Limpar Filtros
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
            {prestadores.map(prestador => (
              <PrestadorCardImproved
                key={prestador.id}
                prestador={prestador}
                onContact={handleContact}
                onViewProfile={handleViewProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      {selectedPrestador && (
        <>
          <PrestadorMiniProfileModal
            prestador={selectedPrestador}
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            onContact={handleContact}
          />

          <ContactModal
            prestador={selectedPrestador}
            open={showContactModal}
            onOpenChange={setShowContactModal}
          />
        </>
      )}
    </div>
  );
};

export default PrestadoresPage;

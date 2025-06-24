
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ModernFooter } from '@/components/layout/ModernFooter';
import { PrestadorCard } from '@/components/prestadores/PrestadorCard';
import { PrestadorProfileModal } from '@/components/prestadores/PrestadorProfileModal';
import { MapFilter } from '@/components/maps/MapFilter';
import { getPrestadores, type UserProfile } from '@/utils/database';
import { useToast } from '@/hooks/use-toast';
import { useChat } from '@/hooks/useChat';
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Filter,
  Grid3X3,
  List,
  ArrowLeft
} from 'lucide-react';

export default function PrestadoresPage() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { createChat } = useChat();
  const [prestadores, setPrestadores] = useState<UserProfile[]>([]);
  const [filteredPrestadores, setFilteredPrestadores] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [selectedBairros, setSelectedBairros] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedPrestador, setSelectedPrestador] = useState<UserProfile | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const servicos = [
    { id: '', nome: 'Todos os Serviços' },
    { id: 'limpeza', nome: 'Limpeza' },
    { id: 'jardinagem', nome: 'Jardinagem' },
    { id: 'pintura', nome: 'Pintura' },
    { id: 'eletrica', nome: 'Elétrica' },
    { id: 'encanamento', nome: 'Encanamento' },
    { id: 'construcao', nome: 'Construção' },
    { id: 'beleza', nome: 'Beleza' },
  ];

  useEffect(() => {
    loadPrestadores();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [prestadores, searchTerm, selectedService, selectedBairros]);

  const loadPrestadores = async () => {
    try {
      const data = await getPrestadores();
      setPrestadores(data);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prestadores",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = prestadores.filter(prestador => {
      const matchesSearch = prestador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prestador.endereco_cidade?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesService = !selectedService || 
                            prestador.prestador_servicos?.some(s => 
                              s.servicos?.nome?.toLowerCase().includes(selectedService.toLowerCase())
                            );

      // Filtro por bairros (simulado - na prática você teria os bairros específicos de cada prestador)
      const matchesBairros = selectedBairros.length === 0 || 
                            selectedBairros.some(bairro => 
                              prestador.endereco_bairro?.includes(bairro) ||
                              prestador.endereco_cidade?.includes('Sinop') // Simplificação
                            );

      return matchesSearch && matchesService && matchesBairros;
    });

    setFilteredPrestadores(filtered);
  };

  const handleViewProfile = (prestador: UserProfile) => {
    setSelectedPrestador(prestador);
    setShowProfileModal(true);
  };

  const handleContact = async (prestador: UserProfile) => {
    try {
      const chat = await createChat(prestador.id);
      if (chat) {
        navigate('/conversas', { state: { openChatId: chat.id } });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível iniciar a conversa",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao contatar prestador",
        variant: "destructive",
      });
    }
  };

  const handleBairroFilter = (bairros: string[]) => {
    setSelectedBairros(bairros);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-gray-600 hover:text-orange-500"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Prestadores de Serviço
                </h1>
                <p className="text-gray-600">
                  Encontre o profissional ideal para suas necessidades
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nome ou cidade..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2 flex-wrap">
              {servicos.map((servico) => (
                <Button
                  key={servico.id}
                  variant={selectedService === servico.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedService(servico.id)}
                  className="whitespace-nowrap"
                >
                  {servico.nome}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Filtro de Mapa */}
        <MapFilter
          prestadores={filteredPrestadores}
          onBairroFilter={handleBairroFilter}
          selectedBairros={selectedBairros}
        />

        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            {loading ? 'Carregando...' : `${filteredPrestadores.length} prestadores encontrados`}
            {selectedBairros.length > 0 && (
              <span className="ml-2 text-orange-600">
                • Filtrado por: {selectedBairros.join(', ')}
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-md animate-pulse">
                <div className="aspect-[4/3] bg-gray-200 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredPrestadores.length > 0 ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
              : 'grid-cols-1 max-w-4xl mx-auto'
          }`}>
            {filteredPrestadores.map((prestador) => (
              <PrestadorCard 
                key={prestador.id} 
                prestador={prestador}
                onViewProfile={handleViewProfile}
                onContact={handleContact}
                onCardClick={handleViewProfile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum prestador encontrado
            </h3>
            <p className="text-gray-600 mb-4">
              Tente ajustar os filtros ou buscar em outra região
            </p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedService('');
                setSelectedBairros([]);
              }}
            >
              Limpar filtros
            </Button>
          </div>
        )}
      </main>

      {/* Modal do Perfil do Prestador */}
      <PrestadorProfileModal
        prestador={selectedPrestador}
        isOpen={showProfileModal}
        onClose={() => {
          setShowProfileModal(false);
          setSelectedPrestador(null);
        }}
        onContact={handleContact}
      />

      <ModernFooter />
    </div>
  );
}

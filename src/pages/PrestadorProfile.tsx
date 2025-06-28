import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { ModernFooter } from '@/components/layout/ModernFooter';
import { getUserProfile, getAvaliacoes, getPortfolioFotos } from '@/utils/database';
import { CommentsList } from '@/components/profile/CommentsList';
import { AddCommentDialog } from '@/components/profile/AddCommentDialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { 
  ArrowLeft,
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Award,
  ThumbsUp,
  Zap,
  CheckCircle,
  Calendar,
  MessageCircle,
  Share2,
  Crown,
  Shield
} from 'lucide-react';

export default function PrestadorProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { isAuthenticated, profile: currentUser } = useAuth();
  const [prestador, setPrestador] = useState<any>(null);
  const [avaliacoes, setAvaliacoes] = useState<any[]>([]);
  const [portfolio, setPortfolio] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadPrestadorData();
    }
  }, [id]);

  const loadPrestadorData = async () => {
    try {
      const [prestadorData, avaliacoesData, portfolioData] = await Promise.all([
        getUserProfile(id!),
        getAvaliacoes(id!),
        getPortfolioFotos(id!)
      ]);
      
      setPrestador(prestadorData);
      setAvaliacoes(avaliacoesData);
      setPortfolio(portfolioData);
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível carregar os dados do prestador",
        variant: "destructive",
      });
      navigate('/prestadores');
    } finally {
      setLoading(false);
    }
  };

  const handleContact = () => {
    if (!isAuthenticated) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para contatar um prestador",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    // Implementar lógica de contato
    toast({
      title: "Em breve",
      description: "Funcionalidade de contato será implementada em breve",
    });
  };

  const calculateRatings = () => {
    if (avaliacoes.length === 0) return null;
    
    const total = avaliacoes.length;
    const mediaGeral = avaliacoes.reduce((acc, av) => acc + av.nota, 0) / total;
    
    // Simular métricas baseadas nas avaliações
    const pontualidade = Math.min(5, mediaGeral + (Math.random() * 0.5 - 0.25));
    const qualidade = Math.min(5, mediaGeral + (Math.random() * 0.3 - 0.15));
    const atendimento = Math.min(5, mediaGeral + (Math.random() * 0.4 - 0.2));
    
    return {
      geral: mediaGeral,
      pontualidade,
      qualidade,
      atendimento,
      total
    };
  };

  const ratings = calculateRatings();

  const bairrosAtendidos = [
    'Centro', 'Jardim Botânico', 'Residencial Anaterra', 
    'Vila Rica', 'Jardim Primavera', 'Setor Industrial',
    'Jardim das Flores', 'Cidade Alta'
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando perfil...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!prestador) {
    return (
      <div className="min-h-screen bg-gray-50">
        <UnifiedHeader />
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Prestador não encontrado
            </h3>
            <Button onClick={() => navigate('/prestadores')}>
              Voltar para listagem
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <UnifiedHeader />
      
      {/* Hero Section */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/prestadores')}
              className="text-gray-600 hover:text-orange-500"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                    <AvatarImage src={prestador.foto_url} alt={prestador.nome} />
                    <AvatarFallback className="text-3xl bg-orange-100 text-orange-600">
                      {prestador.nome?.[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <div className="flex-grow">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-bold text-gray-900">{prestador.nome}</h1>
                    {prestador.premium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                        <Crown className="h-4 w-4 mr-1" />
                        Premium
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-1">
                      <Star className="h-5 w-5 text-yellow-500 fill-current" />
                      <span className="font-semibold text-lg">
                        {prestador.nota_media?.toFixed(1) || '0.0'}
                      </span>
                      <span className="text-gray-600">
                        ({avaliacoes.length} avaliações)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-4 text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{prestador.endereco_cidade || 'Sinop, MT'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-green-600">Disponível</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {prestador.prestador_servicos?.map((servico: any, index: number) => (
                      <Badge key={index} variant="secondary" className="bg-orange-50 text-orange-700">
                        {servico.servicos?.nome}
                      </Badge>
                    ))}
                  </div>
                  
                  {prestador.bio && (
                    <p className="text-gray-700 leading-relaxed">
                      {prestador.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Contact Card */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="text-center">Entre em Contato</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleContact}
                    className="w-full bg-orange-500 hover:bg-orange-600"
                    size="lg"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Enviar Mensagem
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      // Logic for scheduling
                      handleContact();
                    }}
                  >
                    <Calendar className="h-5 w-5 mr-2" />
                    Agendar Serviço
                  </Button>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={() => {
                      navigator.share?.({
                        title: `${prestador.nome} - Zurbo`,
                        text: `Confira o perfil de ${prestador.nome}`,
                        url: window.location.href
                      });
                    }}
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Compartilhar
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Status Premium */}
      {prestador.premium && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-b">
          <div className="max-w-6xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center gap-3 text-center">
              <Shield className="h-6 w-6 text-yellow-600" />
              <div>
                <h3 className="font-semibold text-yellow-800">✅ Prestador Premium</h3>
                <p className="text-sm text-yellow-700">
                  Perfil verificado com garantia de qualidade e prioridade no atendimento
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Tabs defaultValue="sobre" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="sobre">Sobre</TabsTrigger>
            <TabsTrigger value="servicos">Serviços</TabsTrigger>
            <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
            <TabsTrigger value="portfolio">Portfólio</TabsTrigger>
            <TabsTrigger value="localizacao">Localização</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sobre" className="space-y-6">
            {/* Ratings */}
            {ratings && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-orange-500" />
                    Avaliações por Categoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <Zap className="h-5 w-5 text-blue-500" />
                        <span className="font-medium">Pontualidade</span>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {ratings.pontualidade.toFixed(1)}
                      </div>
                      <div className="flex justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(ratings.pontualidade) 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <span className="font-medium">Qualidade</span>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {ratings.qualidade.toFixed(1)}
                      </div>
                      <div className="flex justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(ratings.qualidade) 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <ThumbsUp className="h-5 w-5 text-purple-500" />
                        <span className="font-medium">Atendimento</span>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {ratings.atendimento.toFixed(1)}
                      </div>
                      <div className="flex justify-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.floor(ratings.atendimento) 
                                ? 'text-yellow-500 fill-current' 
                                : 'text-gray-300'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="servicos" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Serviços Oferecidos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {prestador.prestador_servicos?.map((servico: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{servico.servicos?.nome}</h4>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600">
                          R$ {servico.preco_min} - R$ {servico.preco_max}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="avaliacoes" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Avaliações dos Clientes</span>
                  <AddCommentDialog userId={prestador.id} userName={prestador.nome} />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CommentsList userId={prestador.id} />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="portfolio" className="space-y-4">
            {portfolio.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.map((foto, index) => (
                  <Card key={index} className="overflow-hidden">
                    <div className="aspect-square">
                      <img
                        src={foto.foto_url}
                        alt={foto.titulo || `Trabalho ${index + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    {foto.titulo && (
                      <CardContent className="p-4">
                        <h4 className="font-medium">{foto.titulo}</h4>
                        {foto.descricao && (
                          <p className="text-sm text-gray-600 mt-1">{foto.descricao}</p>
                        )}
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Este prestador ainda não adicionou fotos ao portfólio.</p>
                  {!prestador.premium && (
                    <p className="text-sm text-orange-600 mt-2">
                      Prestadores Premium podem adicionar até 10 fotos
                    </p>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="localizacao">
            <Card>
              <CardHeader>
                <CardTitle>Área de Atendimento - Sinop, MT</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center gap-2 text-gray-700">
                    <MapPin className="h-5 w-5" />
                    <span>Base de operação: {prestador.endereco_cidade || 'Sinop, MT'}</span>
                  </div>
                  
                  {/* Mini mapa placeholder */}
                  <div className="w-full h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-lg flex items-center justify-center border-2 border-dashed border-green-300">
                    <div className="text-center text-green-700">
                      <MapPin className="h-12 w-12 mx-auto mb-2" />
                      <p className="font-medium">Mapa de Sinop - MT</p>
                      <p className="text-sm">Bairros atendidos destacados</p>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-3">Bairros Atendidos:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {bairrosAtendidos.map((bairro) => (
                        <div key={bairro} className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{bairro}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ModernFooter />
    </div>
  );
}

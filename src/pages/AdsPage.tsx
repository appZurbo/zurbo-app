
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Filter, 
  Search,
  Crown,
  Zap,
  Heart,
  Eye
} from 'lucide-react';
import { useMobile } from '@/hooks/useMobile';

const AdsPage = () => {
  const isMobile = useMobile();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Fake ads data
  const fakeAds = [
    {
      id: 1,
      title: "Eletricista Especializado - Emergências 24h",
      provider: "João Silva",
      category: "eletrica",
      rating: 4.9,
      reviews: 156,
      location: "Centro, São Paulo",
      phone: "(11) 99999-0001",
      image: "/placeholder.svg",
      price: "A partir de R$ 80",
      description: "Especialista em instalações elétricas residenciais e comerciais. Atendimento de emergência 24 horas.",
      sponsored: true,
      premium: true,
      views: 1234,
      likes: 89
    },
    {
      id: 2,
      title: "Encanador Profissional - Serviços Completos",
      provider: "Maria Santos",
      category: "encanamento",
      rating: 4.8,
      reviews: 98,
      location: "Vila Madalena, São Paulo",
      phone: "(11) 99999-0002",
      image: "/placeholder.svg",
      price: "A partir de R$ 60",
      description: "Todos os tipos de serviços hidráulicos. Desentupimento, instalação e manutenção.",
      sponsored: true,
      premium: false,
      views: 987,
      likes: 67
    },
    {
      id: 3,
      title: "Limpeza Residencial Premium",
      provider: "Ana Oliveira",
      category: "limpeza",
      rating: 4.7,
      reviews: 203,
      location: "Pinheiros, São Paulo",
      phone: "(11) 99999-0003",
      image: "/placeholder.svg",
      price: "A partir de R$ 120",
      description: "Serviços de limpeza residencial completa. Equipe treinada e produtos ecológicos.",
      sponsored: false,
      premium: true,
      views: 756,
      likes: 45
    },
    {
      id: 4,
      title: "Jardinagem e Paisagismo",
      provider: "Pedro Costa",
      category: "jardinagem",
      rating: 4.6,
      reviews: 87,
      location: "Jardins, São Paulo",
      phone: "(11) 99999-0004",
      image: "/placeholder.svg",
      price: "A partir de R$ 150",
      description: "Criação e manutenção de jardins. Design de paisagismo personalizado.",
      sponsored: true,
      premium: true,
      views: 543,
      likes: 32
    },
    {
      id: 5,
      title: "Pintura Residencial e Comercial",
      provider: "Carlos Mendes",
      category: "pintura",
      rating: 4.5,
      reviews: 134,
      location: "Moema, São Paulo",
      phone: "(11) 99999-0005",
      image: "/placeholder.svg",
      price: "A partir de R$ 25/m²",
      description: "Pintura interna e externa. Acabamentos especiais e texturas.",
      sponsored: false,
      premium: false,
      views: 432,
      likes: 28
    },
    {
      id: 6,
      title: "Marcenaria Sob Medida",
      provider: "Roberto Silva",
      category: "marcenaria",
      rating: 4.8,
      reviews: 76,
      location: "Vila Olímpia, São Paulo",
      phone: "(11) 99999-0006",
      image: "/placeholder.svg",
      price: "Orçamento personalizado",
      description: "Móveis planejados e marcenaria personalizada. 15 anos de experiência.",
      sponsored: true,
      premium: false,
      views: 321,
      likes: 19
    }
  ];

  const categories = [
    { id: 'all', name: 'Todas as Categorias' },
    { id: 'eletrica', name: 'Elétrica' },
    { id: 'encanamento', name: 'Encanamento' },
    { id: 'limpeza', name: 'Limpeza' },
    { id: 'jardinagem', name: 'Jardinagem' },
    { id: 'pintura', name: 'Pintura' },
    { id: 'marcenaria', name: 'Marcenaria' }
  ];

  const filteredAds = fakeAds.filter(ad => {
    const matchesCategory = selectedCategory === 'all' || ad.category === selectedCategory;
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ad.provider.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const sponsoredAds = filteredAds.filter(ad => ad.sponsored);
  const regularAds = filteredAds.filter(ad => !ad.sponsored);

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gradient-to-b from-orange-50 to-white ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="mb-8">
            <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-4xl'} mb-2`}>
              Anúncios Premium
            </h1>
            <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-lg'}`}>
              Encontre os melhores prestadores com anúncios destacados
            </p>
          </div>

          {/* Filters */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por serviço ou prestador..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sponsored Section */}
          {sponsoredAds.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-6">
                <Zap className="h-6 w-6 text-yellow-500" />
                <h2 className="text-2xl font-bold text-gray-900">Anúncios Patrocinados</h2>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                  Sponsored
                </Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sponsoredAds.map(ad => (
                  <Card key={ad.id} className="relative overflow-hidden hover:shadow-lg transition-shadow border-2 border-yellow-200">
                    {/* Sponsored Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <Badge className="bg-yellow-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Patrocinado
                      </Badge>
                    </div>

                    {ad.premium && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-1">{ad.title}</CardTitle>
                          <p className="text-sm text-gray-600 mb-2">{ad.provider}</p>
                          <div className="flex items-center gap-1 mb-2">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            <span className="text-sm font-medium">{ad.rating}</span>
                            <span className="text-sm text-gray-500">({ad.reviews} avaliações)</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {ad.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {ad.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-orange-600">{ad.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          {ad.views} visualizações
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-3 w-3" />
                          {ad.likes} curtidas
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contatar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Regular Ads Section */}
          {regularAds.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Outros Anúncios</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {regularAds.map(ad => (
                  <Card key={ad.id} className="hover:shadow-lg transition-shadow">
                    {ad.premium && (
                      <div className="absolute top-4 right-4 z-10">
                        <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          <Crown className="h-3 w-3 mr-1" />
                          Premium
                        </Badge>
                      </div>
                    )}

                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg mb-1">{ad.title}</CardTitle>
                      <p className="text-sm text-gray-600 mb-2">{ad.provider}</p>
                      <div className="flex items-center gap-1 mb-2">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{ad.rating}</span>
                        <span className="text-sm text-gray-500">({ad.reviews} avaliações)</span>
                      </div>
                    </CardHeader>

                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {ad.description}
                      </p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          {ad.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-orange-600">{ad.price}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
                        <div className="flex items-center gap-2">
                          <Eye className="h-3 w-3" />
                          {ad.views} visualizações
                        </div>
                        <div className="flex items-center gap-2">
                          <Heart className="h-3 w-3" />
                          {ad.likes} curtidas
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1 bg-orange-500 hover:bg-orange-600">
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Contatar
                        </Button>
                        <Button size="sm" variant="outline">
                          <Phone className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* No results */}
          {filteredAds.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <h3 className="text-xl font-semibold mb-2">Nenhum anúncio encontrado</h3>
                <p className="text-gray-600 mb-4">
                  Tente ajustar os filtros ou termo de busca.
                </p>
                <Button onClick={() => {
                  setSelectedCategory('all');
                  setSearchTerm('');
                }}>
                  Limpar Filtros
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdsPage;

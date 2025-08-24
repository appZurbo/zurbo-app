import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { toast } from "@/hooks/use-toast";
import { useMobile } from '@/hooks/useMobile';
import { useAuth } from '@/hooks/useAuth';
import { 
  Star, 
  MapPin, 
  MessageCircle, 
  Filter, 
  Search,
  Crown,
  Zap,
  Heart,
  Eye,
  ChevronLeft,
  ChevronRight,
  X,
  Plus,
  Upload,
  AlertTriangle
} from 'lucide-react';

const AdsPage = () => {
  const isMobile = useMobile();
  const { user, profile } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAd, setSelectedAd] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showCreateAd, setShowCreateAd] = useState(false);
  const [adForm, setAdForm] = useState({
    title: '',
    description: '',
    price: '',
    category: '',
    location: '',
    images: [],
    adType: 'normal'
  });

  // Phone number validation
  const validateDescription = (text) => {
    const phonePattern = /(\(?\d{2}\)?\s?9?\d{4}-?\d{4})|(\d{10,11})|(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/;
    return phonePattern.test(text);
  };

  const handleDescriptionChange = (e) => {
    const text = e.target.value;
    if (validateDescription(text)) {
      toast({
        title: "Conteúdo não permitido",
        description: "Não é permitido incluir números de telefone no anúncio. Use o chat da plataforma para contato.",
        variant: "destructive"
      });
      return;
    }
    setAdForm({ ...adForm, description: text });
  };

  const handleTitleChange = (e) => {
    const text = e.target.value;
    if (validateDescription(text)) {
      toast({
        title: "Conteúdo não permitido",
        description: "Não é permitido incluir números de telefone no título. Use o chat da plataforma para contato.",
        variant: "destructive"
      });
      return;
    }
    setAdForm({ ...adForm, title: text });
  };

  // Fake ads data with photo carousel
  const fakeAds = [
    {
      id: 1,
      title: "Eletricista Especializado - Emergências 24h",
      provider: "João Silva",
      category: "eletrica",
      rating: 4.9,
      reviews: 156,
      location: "Centro, São Paulo",
      images: [
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=400&h=300&fit=crop"
      ],
      price: "A partir de R$ 80",
      description: "Especialista em instalações elétricas residenciais e comerciais. Atendimento de emergência 24 horas com equipamentos modernos e garantia total.",
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
      images: [
        "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop"
      ],
      price: "A partir de R$ 60",
      description: "Todos os tipos de serviços hidráulicos. Desentupimento, instalação e manutenção com ferramentas profissionais.",
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
      images: [
        "https://images.unsplash.com/photo-1558618666-e5c1ac2c2f5e?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1556909075-f3dc11dd9ba0?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=400&h=300&fit=crop"
      ],
      price: "A partir de R$ 120",
      description: "Serviços de limpeza residencial completa. Equipe treinada e produtos ecológicos para sua segurança e bem-estar.",
      sponsored: false,
      premium: true,
      views: 756,
      likes: 45
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

  const handleAdClick = (ad) => {
    setSelectedAd(ad);
    setSelectedImageIndex(0);
  };

  const nextImage = () => {
    if (selectedAd && selectedImageIndex < selectedAd.images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  const handleCreateAd = () => {
    if (!adForm.title || !adForm.description || !adForm.price || !adForm.category) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    // Mock payment processing
    if (adForm.adType === 'premium') {
      toast({
        title: "Pagamento necessário",
        description: "Redirecionando para pagamento do anúncio premium...",
      });
      // Here would integrate with payment system
    } else {
      toast({
        title: "Anúncio criado!",
        description: "Seu anúncio foi publicado e ficará visível por 3 dias.",
      });
    }
    
    setShowCreateAd(false);
    setAdForm({
      title: '',
      description: '',
      price: '',
      category: '',
      location: '',
      images: [],
      adType: 'normal'
    });
  };

  const AdCard = ({ ad, isSponsored = false }) => (
    <Card 
      className={`relative overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
        isSponsored ? 'border-2 border-yellow-200' : ''
      } ${ad.premium ? 'border-2 border-golden-300 shadow-lg bg-gradient-to-br from-yellow-50 to-amber-50' : ''}`}
      onClick={() => handleAdClick(ad)}
      style={ad.premium ? {
        boxShadow: '0 0 20px rgba(251, 191, 36, 0.3), 0 0 40px rgba(251, 191, 36, 0.1)',
        border: '2px solid #fbbf24'
      } : {}}
    >
      {/* Photo Carousel */}
      {ad.images && ad.images.length > 0 && (
        <div className="relative h-48 bg-gray-200">
          <img 
            src={ad.images[0]} 
            alt={ad.title}
            className="w-full h-full object-cover"
          />
          {ad.images.length > 1 && (
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
              +{ad.images.length - 1} fotos
            </div>
          )}
        </div>
      )}

      {/* Badges */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        {isSponsored && (
          <Badge className="bg-yellow-500 text-white">
            <Zap className="h-3 w-3 mr-1" />
            Patrocinado
          </Badge>
        )}
        {ad.premium && (
          <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
            <Crown className="h-3 w-3 mr-1" />
            PRO
          </Badge>
        )}
      </div>

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
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gradient-to-b from-orange-50 to-white ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-7xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-2xl' : 'text-4xl'} mb-2`}>
                  Anúncios PRO
                </h1>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-lg'}`}>
                  Encontre os melhores prestadores com anúncios destacados
                </p>
              </div>
              
              {user && (
                <Button 
                  onClick={() => setShowCreateAd(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Anúncio
                </Button>
              )}
            </div>
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
                  <AdCard key={ad.id} ad={ad} isSponsored={true} />
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
                  <AdCard key={ad.id} ad={ad} />
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

      {/* Create Ad Modal */}
      <Dialog open={showCreateAd} onOpenChange={setShowCreateAd}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Novo Anúncio</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Image Upload Area */}
            <div>
              <label className="block text-sm font-medium mb-2">Fotos do Anúncio (até 10)</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm text-gray-600">Clique para adicionar fotos ou arraste aqui</p>
                <p className="text-xs text-gray-500 mt-1">Máximo 10 fotos, formatos: JPG, PNG</p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Título *</label>
                <Input
                  value={adForm.title}
                  onChange={handleTitleChange}
                  placeholder="Ex: Eletricista Especializado"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Categoria *</label>
                <Select value={adForm.category} onValueChange={(value) => setAdForm({...adForm, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.id !== 'all').map(category => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Descrição *</label>
              <Textarea
                value={adForm.description}
                onChange={handleDescriptionChange}
                placeholder="Descreva seus serviços... (não inclua números de telefone)"
                rows={4}
              />
              <div className="flex items-center gap-2 mt-2 text-sm text-amber-600">
                <AlertTriangle className="h-4 w-4" />
                <span>Não inclua números de telefone. Use o chat da plataforma.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Preço *</label>
                <Input
                  value={adForm.price}
                  onChange={(e) => setAdForm({...adForm, price: e.target.value})}
                  placeholder="Ex: A partir de R$ 50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Localização</label>
                <Input
                  value={adForm.location}
                  onChange={(e) => setAdForm({...adForm, location: e.target.value})}
                  placeholder="Bairro, Cidade"
                />
              </div>
            </div>

            {/* Ad Type Selection */}
            <div>
              <label className="block text-sm font-medium mb-4">Tipo de Anúncio</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card 
                  className={`cursor-pointer border-2 ${adForm.adType === 'normal' ? 'border-orange-500 bg-orange-50' : 'border-gray-200'}`}
                  onClick={() => setAdForm({...adForm, adType: 'normal'})}
                >
                  <CardContent className="p-4">
                    <h3 className="font-medium mb-2">Normal - Gratuito</h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Visível por 3 dias</li>
                      <li>• Visibilidade normal</li>
                      <li>• Suporte padrão</li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card 
                  className={`cursor-pointer border-2 ${adForm.adType === 'premium' ? 'border-yellow-500 bg-yellow-50' : 'border-gray-200'}`}
                  onClick={() => setAdForm({...adForm, adType: 'premium'})}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Crown className="h-4 w-4 text-yellow-600" />
                      <h3 className="font-medium">Premium - R$ 19,90</h3>
                    </div>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Visível por 7 dias</li>
                      <li>• Prioridade na exibição</li>
                      <li>• Destaque especial</li>
                      <li>• Suporte prioritário</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => setShowCreateAd(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleCreateAd}
                className="flex-1 bg-orange-500 hover:bg-orange-600"
              >
                {adForm.adType === 'premium' ? 'Pagar e Publicar' : 'Publicar Grátis'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expanded Ad Modal */}
      <Dialog open={!!selectedAd} onOpenChange={() => setSelectedAd(null)}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          {selectedAd && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center justify-between">
                  <span>{selectedAd.title}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setSelectedAd(null)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </DialogTitle>
              </DialogHeader>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Image Carousel */}
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={selectedAd.images[selectedImageIndex]} 
                      alt={selectedAd.title}
                      className="w-full h-96 object-cover rounded-lg"
                    />
                    
                    {selectedAd.images.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={prevImage}
                          disabled={selectedImageIndex === 0}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                          onClick={nextImage}
                          disabled={selectedImageIndex === selectedAd.images.length - 1}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnails */}
                  {selectedAd.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedAd.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`${selectedAd.title} ${index + 1}`}
                          className={`w-16 h-16 object-cover rounded cursor-pointer flex-shrink-0 ${
                            index === selectedImageIndex ? 'ring-2 ring-orange-500' : 'opacity-70'
                          }`}
                          onClick={() => setSelectedImageIndex(index)}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Ad Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {selectedAd.sponsored && (
                      <Badge className="bg-yellow-500 text-white">
                        <Zap className="h-3 w-3 mr-1" />
                        Patrocinado
                      </Badge>
                    )}
                    {selectedAd.premium && (
                      <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white">
                        <Crown className="h-3 w-3 mr-1" />
                        PRO
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="text-xl font-bold mb-2">{selectedAd.provider}</h3>
                    <div className="flex items-center gap-2 mb-4">
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{selectedAd.rating}</span>
                      <span className="text-gray-500">({selectedAd.reviews} avaliações)</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-5 w-5" />
                      {selectedAd.location}
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      {selectedAd.price}
                    </div>
                  </div>

                  <p className="text-gray-700 leading-relaxed">
                    {selectedAd.description}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      {selectedAd.views} visualizações
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      {selectedAd.likes} curtidas
                    </div>
                  </div>

                  <Button className="w-full bg-orange-500 hover:bg-orange-600 mt-6">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contatar Prestador
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdsPage;

import React, { useEffect, useState } from 'react';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { LeafletMapComponent } from '@/components/maps/LeafletMapComponent';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Locate, List, Map as MapIcon, Calendar, Clock, ChevronRight, Filter } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { serviceCategories } from '@/config/serviceCategories';

const MOCK_REQUESTS: ServiceRequest[] = [
    {
        id: 'mock-1',
        user_id: 'user-1',
        category_id: 'Limpeza',
        description: 'Diarista para limpeza residencial completa',
        details: { additional_info: 'Necessário foco em vidros e organização de armários.', location_type: 'house' },
        location_lat: -11.8542,
        location_lng: -55.5123,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'João Silva', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Joao' } as any
    },
    {
        id: 'mock-2',
        user_id: 'user-2',
        category_id: 'Reparos',
        description: 'Montagem de guarda-roupa 6 portas',
        details: { additional_info: 'Móvel novo na caixa. Possuo as ferramentas básicas.', location_type: 'building' },
        location_lat: -11.8765,
        location_lng: -55.4987,
        status: 'open',
        created_at: new Date(Date.now() - 3600000).toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Maria Oliveira', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria' } as any
    },
    {
        id: 'mock-3',
        user_id: 'user-3',
        category_id: 'Elétrica',
        description: 'Instalação de 3 ventiladores de teto',
        details: { additional_info: 'Fiação já está no local, falta apenas a montagem e fixação.', location_type: 'house' },
        location_lat: -11.8621,
        location_lng: -55.5212,
        status: 'open',
        created_at: new Date(Date.now() - 7200000).toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Pedro Santos', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pedro' } as any
    },
    {
        id: 'mock-4',
        user_id: 'user-4',
        category_id: 'Beleza',
        description: 'Manicure e Pedicure em domicílio',
        details: { additional_info: 'Preciso para hoje à tarde. Tenho meus próprios esmaltes.', location_type: 'house' },
        location_lat: -11.8890,
        location_lng: -55.5050,
        status: 'open',
        created_at: new Date(Date.now() - 10800000).toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Ana Costa', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ana' } as any
    },
    {
        id: 'mock-5',
        user_id: 'user-5',
        category_id: 'Construção',
        description: 'Pintura de muro e portão',
        details: { additional_info: 'Muro de aproximadamente 15 metros lineares.', location_type: 'house' },
        location_lat: -11.8710,
        location_lng: -55.4820,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Ricardo Lima', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ricardo' } as any
    },
    {
        id: 'mock-6',
        user_id: 'user-6',
        category_id: 'Jardinagem',
        description: 'Poda de grama e limpeza de canteiros',
        details: { additional_info: 'Terreno de 250m². Grama esmeralda.', location_type: 'house' },
        location_lat: -11.8420,
        location_lng: -55.4950,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Beatriz Lima', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Beatriz' } as any
    },
    {
        id: 'mock-7',
        user_id: 'user-7',
        category_id: 'Fretes',
        description: 'Mudança pequena dentro do bairro',
        details: { additional_info: 'Apenas uma geladeira, uma máquina de lavar e caixas.', location_type: 'building' },
        location_lat: -11.8950,
        location_lng: -55.5320,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Carlos Souza', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos' } as any
    },
    {
        id: 'mock-8',
        user_id: 'user-8',
        category_id: 'Chaveiro',
        description: 'Abertura de porta de apartamento',
        details: { additional_info: 'Esqueci a chave dentro. Porta de madeira simples.', location_type: 'building' },
        location_lat: -11.8650,
        location_lng: -55.5450,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Marcos Veras', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marcos' } as any
    },
    {
        id: 'mock-9',
        user_id: 'user-9',
        category_id: 'Cozinha',
        description: 'Cozinheira para evento familiar',
        details: { additional_info: 'Almoço para 15 pessoas. Comida brasileira.', location_type: 'house' },
        location_lat: -11.8320,
        location_lng: -55.5150,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Dona Neide', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Neide' } as any
    },
    {
        id: 'mock-10',
        user_id: 'user-10',
        category_id: 'Tecnologia',
        description: 'Configuração de rede Wi-Fi e roteador',
        details: { additional_info: 'Sinal não chega no andar de cima. Tenho repetidor.', location_type: 'house' },
        location_lat: -11.8820,
        location_lng: -55.5550,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Lucas Tech', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas' } as any
    },
    {
        id: 'mock-11',
        user_id: 'user-11',
        category_id: 'Cuidados',
        description: 'Cuidador de idosos para período noturno',
        details: { additional_info: 'Apenas acompanhamento e auxílio com medicação.', location_type: 'house' },
        location_lat: -11.8480,
        location_lng: -55.4650,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Fernanda Luz', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Fernanda' } as any
    },
    {
        id: 'mock-12',
        user_id: 'user-12',
        category_id: 'Refrigeração',
        description: 'Limpeza e recarga de gás ar-condicionado',
        details: { additional_info: 'Aparelho Split 12.000 BTU. Parou de gelar.', location_type: 'building' },
        location_lat: -11.9050,
        location_lng: -55.4950,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Gelado Ar', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Gelado' } as any
    },
    {
        id: 'mock-13',
        user_id: 'user-13',
        category_id: 'Mecânico',
        description: 'Troca de pastilha de freio e óleo',
        details: { additional_info: 'Carro popular. Posso levar na oficina local.', location_type: 'house' },
        location_lat: -11.8590,
        location_lng: -55.4750,
        status: 'open',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: { nome: 'Auto Reparo', foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Auto' } as any
    }
];

const OpportunitiesMap = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);
    const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            // Filter: Created within the last 7 days
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

            const { data, error } = await supabase
                .from('service_requests')
                .select(`
                    *,
                    user:profiles(nome, foto_url)
                `)
                .eq('status', 'open')
                .gt('created_at', sevenDaysAgo.toISOString())
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests([...MOCK_REQUESTS, ...(data || [])]);
        } catch (error) {
            console.error('Error fetching requests:', error);
            setRequests(MOCK_REQUESTS);
        } finally {
            setLoading(false);
        }
    };

    // Convert requests to markers
    const markers = requests.map(req => {
        const category = serviceCategories.find(c =>
            c.name.toLowerCase() === req.category_id.toLowerCase() ||
            c.id.toLowerCase() === req.category_id.toLowerCase()
        );

        // Default to service icons 3D if match, otherwise generic category icon
        let iconUrl = category ? `/icons/${category.image}` : undefined;

        if (req.category_id.toLowerCase() === 'reparos') {
            iconUrl = '/icons/reparos_3d.png';
        } else if (req.category_id.toLowerCase() === 'limpeza') {
            iconUrl = '/icons/limpeza_3d.png';
        } else if (req.category_id.toLowerCase() === 'mecânico') {
            iconUrl = '/icons/mecanico_3d.png';
        } else if (req.category_id.toLowerCase() === 'construção') {
            iconUrl = '/icons/construcao_3d.png';
        }

        return {
            lng: req.location_lng,
            lat: req.location_lat,
            title: req.description,
            description: req.category_id,
            color: '#f97316',
            id: req.id,
            iconUrl
        };
    });

    const handleMarkerClick = (markerData: any) => {
        const req = requests.find(r => r.id === markerData.id);
        if (req) {
            setSelectedRequest(req);
        }
    };

    const formatDate = (dateStr: string, details?: any) => {
        // If it's a "real" request (has scheduled_date) or is not a mock ID, show real date
        // Otherwise, show the literal placeholder if requested by user previously,
        // but the user now said "quando for algo real, exiba a data de exibição".
        if (details?.scheduled_date) {
            const date = new Date(`${details.scheduled_date}T${details.scheduled_time || '00:00'}`);
            const datePart = date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            const timePart = details.scheduled_time || '--:--';
            return `data ${datePart}, hora ${timePart}`;
        }

        // Literal placeholder for mocks as previously requested
        return `data tal, hora tal`;
    };

    const toggleViewMode = () => {
        setViewMode(prev => prev === 'map' ? 'list' : 'map');
    };

    return (
        <UnifiedLayout>
            <div className="relative h-[calc(100vh-64px)] w-full flex flex-col bg-[#FDFDFD]">

                {/* Map Header Overlay */}
                <div className="absolute top-4 left-4 right-4 z-20 md:left-8 md:w-96 pointer-events-none">
                    <Card className="shadow-2xl border-none bg-white/90 backdrop-blur-md pointer-events-auto overflow-hidden">
                        <div className="h-1 w-full bg-gradient-to-r from-orange-400 to-orange-600"></div>
                        <CardContent className="p-5">
                            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2 uppercase tracking-tighter">
                                <MapPin className="text-orange-500" size={20} /> Mapa de Serviços
                            </h1>
                            <p className="text-xs text-gray-500 font-medium mt-1">
                                Explore oportunidades de trabalho em tempo real na sua região.
                            </p>

                            <div className="mt-6 flex flex-col gap-3">
                                <div className="flex gap-2">
                                    <Button
                                        className={`flex-1 gap-2 font-black uppercase text-[10px] tracking-widest transition-all h-10 rounded-xl ${viewMode === 'list' ? 'bg-orange-500 text-white shadow-lg shadow-orange-200' : 'bg-white text-gray-400 border border-gray-100 hover:text-orange-500 hover:border-orange-100'}`}
                                        onClick={toggleViewMode}
                                        size="sm"
                                    >
                                        <List size={16} /> VER LISTA
                                    </Button>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                        <Locate className="w-3 h-3 text-orange-400" />
                                        <span>Sinop, MT</span>
                                    </div>
                                    <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black uppercase text-orange-500 hover:text-orange-600 hover:bg-orange-50" onClick={fetchRequests} disabled={loading}>
                                        {loading ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
                                        Atualizar
                                    </Button>
                                </div>

                                <div className="border-t border-gray-100 pt-3">
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="w-full flex items-center justify-between group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-lg transition-colors ${showFilters ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-500 group-hover:bg-orange-100'}`}>
                                                <Filter size={12} />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-700">Filtros</span>
                                        </div>
                                        <ChevronRight size={14} className={`text-gray-400 transition-transform duration-300 ${showFilters ? 'rotate-90' : ''}`} />
                                    </button>

                                    <div className={`overflow-hidden transition-all duration-500 ease-in-out ${showFilters ? 'max-h-64 mt-4 opacity-100' : 'max-h-0 opacity-0'}`}>
                                        <div className="space-y-4 pb-2">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Categoria</label>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {['Todos', 'Reparos', 'Limpeza', 'Mecânico', 'Construção'].map(cat => (
                                                        <Badge
                                                            key={cat}
                                                            variant="secondary"
                                                            className="cursor-pointer bg-white border border-gray-100 text-gray-400 hover:border-orange-200 hover:text-orange-500 font-bold text-[9px] uppercase px-2 py-0.5 rounded-full transition-all"
                                                        >
                                                            {cat}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400">Distância Máxima</label>
                                                <div className="px-1">
                                                    <div className="h-1 w-full bg-gray-100 rounded-full relative">
                                                        <div className="absolute top-0 left-0 h-1 w-1/2 bg-orange-500 rounded-full"></div>
                                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-orange-500 rounded-full shadow-sm"></div>
                                                    </div>
                                                    <div className="flex justify-between mt-2 text-[9px] font-bold text-gray-400 uppercase tracking-tighter">
                                                        <span>1km</span>
                                                        <span className="text-orange-600">5km</span>
                                                        <span>15km+</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content Area */}
                <div className="flex-1 w-full relative">
                    {/* The Map Layer */}
                    <div className="absolute inset-0 z-0">
                        <LeafletMapComponent
                            height="100%"
                            center={{ lat: -11.87, lng: -55.5 }}
                            zoom={13}
                            markers={markers}
                            onMarkerClick={handleMarkerClick}
                            showControls={true}
                        />
                    </div>

                    {/* Mobile Overlay */}
                    <div
                        className={`absolute inset-0 bg-black/20 backdrop-blur-sm z-25 md:hidden transition-opacity duration-500 ${viewMode === 'list' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        onClick={() => setViewMode('map')}
                    />

                    {/* The List Layer - Sidebar Right */}
                    <div className={`absolute top-0 right-0 z-30 h-full w-full md:w-[450px] bg-white/40 backdrop-blur-xl shadow-2xl transition-all duration-500 ease-in-out border-l border-white/20 overflow-y-auto ${viewMode === 'list' ? 'translate-x-0' : 'translate-x-full'}`}>
                        <div className="p-6 pt-32 md:pt-6 pb-24 space-y-4">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-xl font-black text-gray-900 uppercase tracking-tighter">
                                    Disponíveis <span className="text-orange-500 ml-1">({requests.length})</span>
                                </h2>
                                <Button variant="ghost" size="sm" onClick={() => setViewMode('map')} className="md:hidden text-gray-400">
                                    <MapIcon size={20} />
                                </Button>
                            </div>

                            {requests.map((req) => (
                                <Card
                                    key={req.id}
                                    className="group hover:shadow-lg transition-all duration-300 border border-white/50 bg-white/80 backdrop-blur-sm cursor-pointer overflow-hidden rounded-3xl"
                                    onClick={() => setSelectedRequest(req)}
                                >
                                    <CardContent className="p-0">
                                        <div className="flex items-stretch">
                                            <div className="w-2 bg-orange-100 group-hover:bg-orange-500 transition-colors"></div>
                                            <div className="flex-1 p-5">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <Badge variant="secondary" className="bg-orange-100 text-orange-600 hover:bg-orange-200 border-none font-bold text-[10px] uppercase mb-2">
                                                            {req.category_id}
                                                        </Badge>
                                                        <h3 className="text-lg font-black text-gray-900 group-hover:text-orange-500 transition-colors uppercase tracking-tight leading-tight">
                                                            {req.description}
                                                        </h3>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase mb-1">
                                                            <Clock size={10} />
                                                            {formatDate(req.created_at, req.details)}
                                                        </div>
                                                    </div>
                                                </div>

                                                <p className="text-sm text-gray-500 font-medium line-clamp-2 mb-4">
                                                    {req.details?.additional_info || 'Sem informações adicionais.'}
                                                </p>

                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-8 h-8 rounded-full bg-orange-100 overflow-hidden border border-orange-200">
                                                            <img
                                                                src={req.user?.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${req.id}`}
                                                                alt={req.user?.nome}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-bold text-gray-700">{req.user?.nome || 'Cliente Zurbo'}</span>
                                                    </div>
                                                    <Button variant="ghost" size="sm" className="text-orange-500 font-black uppercase text-[10px] tracking-widest gap-1 group-hover:translate-x-1 transition-transform">
                                                        Ver Detalhes <ChevronRight size={14} />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}

                            {requests.length === 0 && !loading && (
                                <div className="text-center py-20 bg-white rounded-[40px] shadow-sm">
                                    <MapIcon className="w-16 h-16 mx-auto text-gray-200 mb-4" />
                                    <p className="text-gray-500 font-medium">Nenhum pedido encontrado no momento.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Selected Request Modal - Refined */}
                <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                    <DialogContent className="max-w-md p-0 overflow-hidden border-none rounded-[32px] bg-white">
                        <div className="h-32 bg-gradient-to-br from-orange-400 to-orange-600 p-8 relative">
                            <div className="absolute top-4 right-4 text-white/50 text-8xl font-black select-none pointer-events-none opacity-20 uppercase -rotate-12">
                                ZURBO
                            </div>
                            <Badge className="bg-white/20 text-white border-none backdrop-blur-sm mb-2">{selectedRequest?.category_id}</Badge>
                            <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-tighter leading-none mt-1">
                                {selectedRequest?.description}
                            </h2>
                        </div>

                        <div className="p-8">
                            <div className="flex gap-4 items-center mb-8 bg-gray-50 p-4 rounded-2xl">
                                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow-sm">
                                    <img src={selectedRequest?.user?.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${selectedRequest?.id}`} alt="User" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest leading-none mb-1">Cliente</p>
                                    <p className="font-bold text-gray-900">{selectedRequest?.user?.nome || 'Usuário Zurbo'}</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Descrição do Pedido</h4>
                                    <p className="text-sm text-gray-600 font-medium leading-relaxed">
                                        {selectedRequest?.details?.additional_info || 'Sem detalhes adicionais fornecidos pelo cliente.'}
                                    </p>
                                </div>

                                <div className="flex flex-wrap gap-4 pt-4 border-t border-gray-100">
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <Calendar size={14} className="text-orange-500" />
                                        {selectedRequest && formatDate(selectedRequest.created_at, selectedRequest.details)}
                                    </div>
                                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500">
                                        <MapPin size={14} className="text-orange-500" />
                                        Sinop, MT
                                    </div>
                                </div>
                            </div>

                            <div className="mt-10 flex gap-3">
                                <Button variant="outline" className="flex-1 rounded-2xl h-12 font-bold" onClick={() => setSelectedRequest(null)}>
                                    Voltar
                                </Button>
                                <Button className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-12 font-bold shadow-lg shadow-orange-100 transition-all hover:scale-[1.02]">
                                    Candidatar-me
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </UnifiedLayout>
    );
};

export default OpportunitiesMap;


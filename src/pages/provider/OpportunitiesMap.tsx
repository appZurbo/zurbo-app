import React, { useEffect, useState } from 'react';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { LeafletMapComponent } from '@/components/maps/LeafletMapComponent';
import { supabase } from '@/integrations/supabase/client';
import { ServiceRequest } from '@/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, MapPin, Locate } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

const OpportunitiesMap = () => {
    const [requests, setRequests] = useState<ServiceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('service_requests')
                .select('*')
                .eq('status', 'open');

            if (error) throw error;
            setRequests(data || []);
        } catch (error) {
            console.error('Error fetching requests:', error);
        } finally {
            setLoading(false);
        }
    };

    // Convert requests to markers
    const markers = requests.map(req => ({
        lng: req.location_lng,
        lat: req.location_lat,
        title: req.description,
        description: req.category_id,
        color: '#f97316',
        id: req.id
    }));

    const handleMarkerClick = (markerData: any) => {
        const req = requests.find(r => r.id === markerData.id);
        if (req) {
            setSelectedRequest(req);
        }
    };

    return (
        <UnifiedLayout>
            <div className="relative h-[calc(100vh-64px)] w-full flex flex-col">

                {/* Map Header / Overlay */}
                <div className="absolute top-4 left-4 right-4 z-10 md:left-8 md:w-96">
                    <Card className="shadow-lg border-none bg-white/95 backdrop-blur">
                        <CardContent className="p-4">
                            <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <MapPin className="text-orange-500" /> Mapa de Serviços
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Pedidos de serviço disponíveis na sua região
                            </p>
                            <div className="mt-4 flex gap-2 items-center">
                                <Button variant="outline" size="sm" onClick={fetchRequests} disabled={loading}>
                                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Atualizar'}
                                </Button>
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Locate className="w-3 h-3" />
                                    <span>Usando sua localização</span>
                                </div>
                            </div>
                            <div className="mt-2 text-xs text-gray-400">
                                {requests.length} {requests.length === 1 ? 'pedido encontrado' : 'pedidos encontrados'}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* The Map */}
                <div className="flex-1 w-full bg-gray-100">
                    <LeafletMapComponent
                        height="100%"
                        center={{ lat: -11.87, lng: -55.5 }}
                        zoom={13}
                        markers={markers}
                        onMarkerClick={handleMarkerClick}
                        showControls={true}
                    />
                </div>

                {/* Selected Request Modal */}
                <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{selectedRequest?.description}</DialogTitle>
                            <DialogDescription>
                                Categoria: {selectedRequest?.category_id}
                            </DialogDescription>
                        </DialogHeader>
                        <div className="py-4">
                            <p className="text-sm text-gray-700">
                                <strong>Detalhes:</strong> {selectedRequest?.details?.additional_info || 'Sem detalhes adicionais.'}
                            </p>
                            <div className="mt-4 text-xs text-gray-500">
                                Criado em: {selectedRequest && new Date(selectedRequest.created_at).toLocaleDateString('pt-BR')}
                            </div>
                        </div>
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Fechar</Button>
                            <Button className="bg-orange-500 hover:bg-orange-600">Aceitar / Contatar</Button>
                        </div>
                    </DialogContent>
                </Dialog>

            </div>
        </UnifiedLayout>
    );
};

export default OpportunitiesMap;

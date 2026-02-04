
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, RefreshCw, Calendar, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

interface ServiceRequestHistoryProps {
    userId: string;
}

export const ServiceRequestHistory: React.FC<ServiceRequestHistoryProps> = ({ userId }) => {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const navigate = useNavigate();

    const fetchHistory = async () => {
        setLoading(true);
        try {
            const { data, error } = await (supabase as any)
                .from('service_requests')
                .select('*')
                .eq('user_id', userId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setRequests(data || []);
        } catch (error: any) {
            console.error('Error fetching request history:', error);
            toast({
                title: "Erro ao carregar histórico",
                description: error.message,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) fetchHistory();
    }, [userId]);

    const handleRePost = (req: any) => {
        // Navigate to creation page with pre-filled data (optional, but good UX)
        // For now, just navigate
        navigate('/solicitar-servico', {
            state: {
                description: req.description,
                category: req.category_id,
                details: req.details?.additional_info,
                location_type: req.details?.location_type
            }
        });
    };

    const isExpired = (createdAt: string) => {
        const created = new Date(createdAt);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - created.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 7;
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-medium">Você ainda não criou nenhuma solicitação no mapa.</p>
                <Button
                    variant="link"
                    className="text-orange-500 font-bold mt-2"
                    onClick={() => navigate('/solicitar-servico')}
                >
                    Criar minha primeira solicitação
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {requests.map((req) => {
                const expired = isExpired(req.created_at);
                return (
                    <Card key={req.id} className={`overflow-hidden rounded-3xl border-none shadow-sm ${expired ? 'bg-gray-50/50 grayscale-[0.5]' : 'bg-white'}`}>
                        <CardContent className="p-0">
                            <div className="flex">
                                <div className={`w-2 ${expired ? 'bg-gray-200' : 'bg-orange-500'}`}></div>
                                <div className="p-5 flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="space-y-1">
                                            <div className="flex gap-2">
                                                <Badge variant="secondary" className="bg-orange-50 text-orange-600 font-bold text-[10px] uppercase">
                                                    {req.category_id}
                                                </Badge>
                                                {expired ? (
                                                    <Badge className="bg-gray-200 text-gray-500 border-none font-bold text-[10px] uppercase">Expirado (7 dias+)</Badge>
                                                ) : (
                                                    <Badge className="bg-emerald-100 text-emerald-600 border-none font-bold text-[10px] uppercase">Ativo no Mapa</Badge>
                                                )}
                                            </div>
                                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tight">{req.description}</h3>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] font-black text-gray-400 uppercase flex items-center gap-1 justify-end">
                                                <Calendar size={10} />
                                                {new Date(req.created_at).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500 mb-5">
                                        <div className="flex items-center gap-1.5">
                                            <MapPin size={14} className="text-orange-400" />
                                            {req.details?.location_type === 'building' ? 'Prédio' : 'Casa'}
                                        </div>
                                        {req.details?.scheduled_date && (
                                            <div className="flex items-center gap-1.5">
                                                <Clock size={14} className="text-orange-400" />
                                                Agendado: {req.details.scheduled_date} às {req.details.scheduled_time}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:bg-orange-50 rounded-xl"
                                            onClick={() => handleRePost(req)}
                                        >
                                            <RefreshCw size={14} className="mr-1" /> Re-solicitar
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                );
            })}
        </div>
    );
};

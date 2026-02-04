import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MapPin, Upload } from 'lucide-react';
import { serviceCategories } from '@/config/serviceCategories';
import { LeafletMapComponent } from '@/components/maps/LeafletMapComponent';

const CreateServiceRequest = () => {
    const navigate = useNavigate();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        details: '',
        location_type: 'house' as 'house' | 'building',
        date: '',
        time: '',
        lat: -11.87, // Default Sinop
        lng: -55.5,
    });

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.category) {
            toast({
                title: "Categoria obrigatória",
                description: "Selecione o tipo de serviço que você precisa.",
                variant: "destructive"
            });
            return;
        }

        setLoading(true);

        try {
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                toast({
                    title: "Erro de autenticação",
                    description: "Você precisa estar logado para criar um pedido.",
                    variant: "destructive"
                });
                return;
            }

            const { error } = await (supabase as any)
                .from('service_requests')
                .insert({
                    user_id: user.id,
                    category_id: formData.category,
                    description: formData.description,
                    details: {
                        additional_info: formData.details,
                        location_type: formData.location_type,
                        scheduled_date: formData.date,
                        scheduled_time: formData.time
                    },
                    location_lat: formData.lat,
                    location_lng: formData.lng,
                    status: 'open'
                });

            if (error) throw error;

            toast({
                title: "Pedido criado com sucesso!",
                description: "Os prestadores próximos serão notificados.",
            });

            navigate('/dashboard');

        } catch (error: any) {
            console.error('Error creating request:', error);
            toast({
                title: "Erro ao criar pedido",
                description: error.message || "Tente novamente mais tarde.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <UnifiedLayout>
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter sm:text-4xl">
                        Solicitar <span className="text-orange-500">Serviço</span>
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium">
                        Preencha os detalhes e encontre o profissional ideal para sua necessidade.
                    </p>
                </div>

                <form onSubmit={handleCreateRequest} className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Left Column - Details */}
                    <div className="md:col-span-12 lg:col-span-8 space-y-6">
                        <Card className="border-none shadow-xl shadow-gray-100 rounded-[32px] overflow-hidden">
                            <CardHeader className="bg-gray-50/50 pb-4">
                                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                    <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                    O que você precisa?
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                {/* Visual Category Picker */}
                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Selecione a Categoria</Label>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {serviceCategories.map((cat) => {
                                            const Icon = cat.icon;
                                            const isSelected = formData.category === cat.id;
                                            return (
                                                <div
                                                    key={cat.id}
                                                    onClick={() => setFormData({ ...formData, category: cat.id })}
                                                    className={`
                                                        p-4 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-2
                                                        ${isSelected
                                                            ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-100 scale-[1.02]'
                                                            : 'border-gray-100 bg-white hover:border-orange-200 hover:bg-orange-50/30'}
                                                    `}
                                                >
                                                    <div className={`p-2 rounded-xl ${isSelected ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                                        <Icon size={20} />
                                                    </div>
                                                    <span className={`text-[10px] font-black uppercase tracking-tighter text-center ${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
                                                        {cat.name}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-gray-400">Título do Pedido</Label>
                                        <Input
                                            id="description"
                                            placeholder="Ex: Instalação de Ar Condicionado no Centro"
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="h-12 rounded-xl focus-visible:ring-orange-500"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="details" className="text-xs font-black uppercase tracking-widest text-gray-400">Detalhes do Problema</Label>
                                        <Textarea
                                            id="details"
                                            placeholder="Descreva melhor o que precisa ser feito..."
                                            value={formData.details}
                                            onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                            className="min-h-[120px] rounded-xl focus-visible:ring-orange-500"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Location and Mapping */}
                        <Card className="border-none shadow-xl shadow-gray-100 rounded-[32px] overflow-hidden">
                            <CardHeader className="bg-gray-50/50 pb-4">
                                <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                                    <div className="w-2 h-6 bg-orange-500 rounded-full"></div>
                                    Localização e Tipo
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <div className="flex-1 space-y-4">
                                        <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Tipo de Residência</Label>
                                        <div className="flex gap-2">
                                            <div
                                                onClick={() => setFormData({ ...formData, location_type: 'house' })}
                                                className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${formData.location_type === 'house' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white'}`}
                                            >
                                                <img src="/icons/house_3d.png" className="w-8 h-8 object-contain" alt="Casa" />
                                                <span className={`text-xs font-black uppercase tracking-widest ${formData.location_type === 'house' ? 'text-orange-600' : 'text-gray-400'}`}>Casa</span>
                                            </div>
                                            <div
                                                onClick={() => setFormData({ ...formData, location_type: 'building' })}
                                                className={`flex-1 p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3 ${formData.location_type === 'building' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 bg-white'}`}
                                            >
                                                <img src="/icons/building_3d.png" className="w-8 h-8 object-contain" alt="Prédio" />
                                                <span className={`text-xs font-black uppercase tracking-widest ${formData.location_type === 'building' ? 'text-orange-600' : 'text-gray-400'}`}>Prédio</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                                        <MapPin className="w-3 h-3 text-orange-500" /> Marque no Mapa
                                    </Label>
                                    <div className="rounded-[24px] overflow-hidden border border-gray-100 h-[250px] shadow-inner">
                                        <LeafletMapComponent
                                            height="100%"
                                            center={{ lat: formData.lat, lng: formData.lng }}
                                            zoom={14}
                                            showControls={true}
                                            onMapMove={(coords) => setFormData(prev => ({ ...prev, lat: coords.lat, lng: coords.lng }))}
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase text-center">Arraste o mapa para centralizar no local desejado</p>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column - Scheduling & Submit */}
                    <div className="md:col-span-12 lg:col-span-4 space-y-6">
                        <Card className="border-none shadow-xl shadow-gray-100 rounded-[32px] overflow-hidden sticky top-24">
                            <CardHeader className="bg-orange-500 p-6 text-white">
                                <CardTitle className="text-lg font-black uppercase tracking-tight">Agendamento</CardTitle>
                                <p className="text-orange-100 text-xs font-bold leading-tight mt-1">Quando você precisa do serviço?</p>
                            </CardHeader>
                            <CardContent className="pt-6 space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Data Preferencial</Label>
                                    <Input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="h-12 rounded-xl focus-visible:ring-orange-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-xs font-black uppercase tracking-widest text-gray-400">Hora Preferencial</Label>
                                    <Input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="h-12 rounded-xl focus-visible:ring-orange-500"
                                    />
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <div className="flex flex-col gap-3">
                                        <Button
                                            type="submit"
                                            className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-14 font-black uppercase tracking-widest shadow-lg shadow-orange-100 transition-all hover:scale-[1.02]"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <Loader2 className="h-5 w-5 animate-spin" />
                                            ) : (
                                                'Enviar Solicitação'
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            className="w-full text-gray-400 font-bold text-xs uppercase"
                                            onClick={() => navigate(-1)}
                                        >
                                            Cancelar
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="bg-gray-50 border border-gray-100 rounded-[24px] p-6">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Informação Importante</h4>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">
                                Sua solicitação será visível para todos os prestadores verificados na região de Sinop/MT.
                            </p>
                        </div>
                    </div>
                </form>
            </div>
        </UnifiedLayout>
    );
};

export default CreateServiceRequest;

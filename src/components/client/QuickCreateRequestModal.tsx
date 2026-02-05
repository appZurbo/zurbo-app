
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, MapPin, Plus, X } from 'lucide-react';
import { serviceCategories } from '@/config/serviceCategories';
import { LeafletMapComponent } from '@/components/maps/LeafletMapComponent';
import { ScrollArea } from '@/components/ui/scroll-area';

interface QuickCreateRequestModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess?: () => void;
    initialCoords?: { lat: number; lng: number };
}

export const QuickCreateRequestModal = ({
    open,
    onOpenChange,
    onSuccess,
    initialCoords = { lat: -11.87, lng: -55.5 }
}: QuickCreateRequestModalProps) => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        description: '',
        category: '',
        details: '',
        location_type: 'house' as 'house' | 'building',
        date: '',
        time: '',
        lat: initialCoords.lat,
        lng: initialCoords.lng,
    });

    const totalSteps = 4;

    const handleNext = () => {
        if (step === 1 && !formData.category) {
            toast({ title: "Selecione uma categoria", variant: "destructive" });
            return;
        }
        if (step === 2 && !formData.description) {
            toast({ title: "Informe o título do pedido", variant: "destructive" });
            return;
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const handleBack = () => {
        setStep(prev => Math.max(prev - 1, 1));
    };

    const handleCreateRequest = async () => {
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

            onSuccess?.();
            onOpenChange(false);
            setStep(1);
            setFormData({
                description: '',
                category: '',
                details: '',
                location_type: 'house',
                date: '',
                time: '',
                lat: initialCoords.lat,
                lng: initialCoords.lng,
            });

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
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl p-0 overflow-hidden border-none rounded-[32px] bg-white">
                {/* Premium Header */}
                <div className="h-24 bg-gradient-to-br from-orange-400 to-orange-600 p-6 relative flex items-center justify-between">
                    <div className="absolute top-2 right-12 text-white/5 font-black text-6xl select-none pointer-events-none uppercase">
                        ZURBO
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white uppercase tracking-tighter leading-none">
                            Novo <span className="text-orange-100">Pedido</span>
                        </h2>
                        <p className="text-orange-100 text-[10px] font-bold tracking-wider uppercase mt-1">
                            Passo {step} de {totalSteps}
                        </p>
                    </div>
                    {/* Step indicator bubbles */}
                    <div className="flex gap-1">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${i <= step ? 'bg-white' : 'bg-white/30'}`}
                            />
                        ))}
                    </div>
                </div>

                <ScrollArea className="max-h-[80vh] min-h-[400px]">
                    <div className="p-6">
                        {/* Step 1: Category */}
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Label className="text-lg font-black text-gray-800">
                                    Qual tipo de serviço você precisa?
                                </Label>
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 pt-2">
                                    {serviceCategories.map((cat) => {
                                        const Icon = cat.icon;
                                        const isSelected = formData.category === cat.id;
                                        return (
                                            <div
                                                key={cat.id}
                                                onClick={() => setFormData({ ...formData, category: cat.id })}
                                                className={`
                        p-3 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer transition-all duration-300 border-2
                        ${isSelected
                                                        ? 'border-orange-500 bg-orange-50 shadow-lg shadow-orange-100 scale-105'
                                                        : 'border-gray-50 bg-white hover:border-orange-100 hover:bg-orange-50/20'}
                      `}
                                            >
                                                <div className={`p-2 rounded-xl transition-colors ${isSelected ? 'bg-orange-500 text-white' : 'bg-gray-50 text-gray-400'}`}>
                                                    <Icon size={20} />
                                                </div>
                                                <span className={`text-[10px] font-black uppercase tracking-tight text-center leading-none ${isSelected ? 'text-orange-600' : 'text-gray-400'}`}>
                                                    {cat.name}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Details */}
                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="space-y-1">
                                    <Label className="text-lg font-black text-gray-800">
                                        Dê um título ao seu pedido
                                    </Label>
                                    <p className="text-sm text-gray-500">Seja breve e direto.</p>
                                </div>
                                <Input
                                    placeholder="Ex: Torneira pingando na cozinha"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="h-14 text-lg rounded-2xl focus-visible:ring-orange-500 border-gray-200 bg-gray-50"
                                    autoFocus
                                />

                                <div className="space-y-1 pt-4">
                                    <Label className="text-lg font-black text-gray-800">
                                        Detalhes adicionais (Opcional)
                                    </Label>
                                    <p className="text-sm text-gray-500">Explique melhor o problema para o prestador.</p>
                                </div>
                                <Textarea
                                    placeholder="Ex: A torneira é da marca X, o vazamento começou ontem..."
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    className="min-h-[120px] text-base rounded-2xl focus-visible:ring-orange-500 border-gray-200 bg-gray-50 resize-none p-4"
                                />
                            </div>
                        )}

                        {/* Step 3: Schedule */}
                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Label className="text-lg font-black text-gray-800">
                                    Quando você gostaria de ser atendido?
                                </Label>
                                <div className="grid grid-cols-1 gap-6">
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Data</Label>
                                        <Input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="h-14 text-lg rounded-2xl focus-visible:ring-orange-500 border-gray-200 bg-gray-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Horário Aproximado</Label>
                                        <Input
                                            type="time"
                                            value={formData.time}
                                            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                            className="h-14 text-lg rounded-2xl focus-visible:ring-orange-500 border-gray-200 bg-gray-50"
                                        />
                                    </div>
                                    <div className="bg-blue-50 p-4 rounded-2xl flex gap-3 text-blue-700">
                                        <div className="mt-1">ℹ️</div>
                                        <p className="text-sm font-medium leading-relaxed">
                                            Isso é apenas uma sugestão. Você poderá combinar o horário exato diretamente com o prestador pelo chat.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Location */}
                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <Label className="text-lg font-black text-gray-800 flex items-center gap-2">
                                    <MapPin className="text-orange-500" /> Onde será o serviço?
                                </Label>

                                <div className="rounded-2xl overflow-hidden border-2 border-orange-100 h-[220px] shadow-lg relative">
                                    <LeafletMapComponent
                                        height="100%"
                                        center={{ lat: formData.lat, lng: formData.lng }}
                                        zoom={15}
                                        showControls={false}
                                        onMapMove={(coords) => setFormData(prev => ({ ...prev, lat: coords.lat, lng: coords.lng }))}
                                    />
                                    <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-600 shadow-sm z-[1000] border border-orange-100">
                                        Arraste o mapa para ajustar
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Label className="text-sm font-bold text-gray-500 uppercase tracking-widest">Tipo de Local</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div
                                            onClick={() => setFormData({ ...formData, location_type: 'house' })}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-center gap-2 font-bold ${formData.location_type === 'house' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 bg-white text-gray-500'}`}
                                        >
                                            🏠 Casa
                                        </div>
                                        <div
                                            onClick={() => setFormData({ ...formData, location_type: 'building' })}
                                            className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-center gap-2 font-bold ${formData.location_type === 'building' ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-gray-100 bg-white text-gray-500'}`}
                                        >
                                            🏢 Prédio / Condomínio
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer Navigation */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                    {step > 1 ? (
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 rounded-2xl h-14 font-bold text-gray-500 hover:text-gray-900 bg-white"
                            onClick={handleBack}
                        >
                            Voltar
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            variant="ghost"
                            className="flex-1 rounded-2xl h-14 font-bold text-gray-400 hover:text-gray-600"
                            onClick={() => onOpenChange(false)}
                        >
                            Cancelar
                        </Button>
                    )}

                    {step < totalSteps ? (
                        <Button
                            type="button"
                            className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white rounded-2xl h-14 font-black shadow-lg shadow-orange-200 transition-all hover:scale-[1.02] active:scale-95 text-lg"
                            onClick={handleNext}
                        >
                            Continuar
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            className="flex-[2] bg-green-500 hover:bg-green-600 text-white rounded-2xl h-14 font-black shadow-lg shadow-green-200 transition-all hover:scale-[1.02] active:scale-95 text-lg"
                            onClick={handleCreateRequest}
                            disabled={loading}
                        >
                            {loading ? <Loader2 className="h-6 w-6 animate-spin mx-auto" /> : 'FINALIZAR PEDIDO'}
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
};

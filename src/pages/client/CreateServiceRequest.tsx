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
        lat: -11.87, // Default Sinop
        lng: -55.5,
    });

    const handleCreateRequest = async (e: React.FormEvent) => {
        e.preventDefault();
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

            // Simulate photo upload for now or just empty array
            const photos: string[] = [];

            const { error } = await supabase
                .from('service_requests')
                .insert({
                    user_id: user.id,
                    category_id: formData.category,
                    description: formData.description,
                    details: { additional_info: formData.details }, // storing as jsonb
                    location_lat: formData.lat,
                    location_lng: formData.lng,
                    photos: photos,
                    status: 'open'
                });

            if (error) throw error;

            toast({
                title: "Pedido criado com sucesso!",
                description: "Os prestadores próximos serão notificados.",
            });

            navigate('/dashboard'); // or redirect to 'my requests'

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
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-2xl">Solicitar Novo Serviço</CardTitle>
                        <CardDescription>
                            Descreva o que você precisa e encontre profissionais qualificados.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateRequest} className="space-y-6">

                            <div className="space-y-2">
                                <Label htmlFor="category">Categoria do Serviço</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione uma categoria" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {serviceCategories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Título / Resumo</Label>
                                <Input
                                    id="description"
                                    placeholder="Ex: Instalação de Ar Condicionado no Centro"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    required
                                    maxLength={100}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="details">Detalhes Adicionais</Label>
                                <Textarea
                                    id="details"
                                    placeholder="Descreva melhor o problema, horário preferido, etc..."
                                    value={formData.details}
                                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                                    className="min-h-[100px]"
                                />
                            </div>

                            {/* Simplified Location Picker */}
                            <div className="space-y-2">
                                <Label className="flex items-center gap-2">
                                    <MapPin className="w-4 h-4" /> Localização Aproximada
                                </Label>
                                <div className="text-sm text-gray-500 mb-2">
                                    Por enquanto, usando localização padrão (Sinop). Em breve: clique no mapa para ajustar.
                                </div>
                                <div className="rounded-lg overflow-hidden border h-[200px]">
                                    <LeafletMapComponent
                                        height="100%"
                                        center={{ lat: formData.lat, lng: formData.lng }}
                                        zoom={13}
                                        showControls={false}
                                    />
                                </div>
                            </div>

                            {/* Photo Upload Placeholder */}
                            <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-gray-500 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
                                <Upload className="w-8 h-8 mb-2" />
                                <span className="text-sm">Adicionar Fotos (Opcional - Em breve)</span>
                            </div>

                            <div className="pt-4">
                                <Button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adicionando Pedido...
                                        </>
                                    ) : (
                                        'Criar Pedido de Serviço'
                                    )}
                                </Button>
                            </div>

                        </form>
                    </CardContent>
                </Card>
            </div>
        </UnifiedLayout>
    );
};

export default CreateServiceRequest;

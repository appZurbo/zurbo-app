
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Wrench, Heart, Bolt, Broom } from 'lucide-react';

interface Service {
  id: string;
  nome: string;
  icone: string;
}

interface ServiceWithPrice extends Service {
  selected: boolean;
  preco_medio?: number;
}

const ServiceSelectionPage = ({ onComplete }: { onComplete: () => void }) => {
  const [services, setServices] = useState<ServiceWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos_disponiveis')
        .select('*')
        .eq('ativo', true);

      if (error) throw error;

      setServices(data.map(service => ({
        ...service,
        selected: false,
        preco_medio: 0
      })));
    } catch (error: any) {
      toast({
        title: "Erro ao carregar serviços",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleService = (serviceId: string) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, selected: !service.selected }
        : service
    ));
  };

  const updatePrice = (serviceId: string, price: number) => {
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, preco_medio: price }
        : service
    ));
  };

  const saveServices = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');

      const { data: userProfile } = await supabase
        .from('users')
        .select('id')
        .eq('auth_id', user.id)
        .single();

      if (!userProfile) throw new Error('Perfil do usuário não encontrado');

      const selectedServices = services.filter(service => service.selected);
      
      if (selectedServices.length === 0) {
        toast({
          title: "Selecione pelo menos um serviço",
          description: "Você precisa escolher quais serviços irá prestar.",
          variant: "destructive",
        });
        return;
      }

      // Primeiro, remover serviços existentes
      await supabase
        .from('servicos_prestados')
        .delete()
        .eq('prestador_id', userProfile.id);

      // Inserir novos serviços
      const servicesToInsert = selectedServices.map(service => ({
        prestador_id: userProfile.id,
        servico_id: service.id,
        preco_medio: service.preco_medio || 0
      }));

      const { error } = await supabase
        .from('servicos_prestados')
        .insert(servicesToInsert);

      if (error) throw error;

      toast({
        title: "Serviços salvos com sucesso!",
        description: "Você pode alterar suas opções a qualquer momento no perfil.",
      });

      onComplete();
    } catch (error: any) {
      toast({
        title: "Erro ao salvar serviços",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'wrench': return <Wrench className="h-8 w-8" />;
      case 'heart': return <Heart className="h-8 w-8" />;
      case 'bolt': return <Bolt className="h-8 w-8" />;
      case 'broom': return <Broom className="h-8 w-8" />;
      default: return <Wrench className="h-8 w-8" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando serviços...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Escolha os Serviços que Você Presta</CardTitle>
          <p className="text-gray-600">
            Selecione todos os serviços que você oferece e defina um preço médio para cada um.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-colors ${
                  service.selected ? 'border-orange-500 bg-orange-50' : ''
                }`}
                onClick={() => toggleService(service.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={service.selected}
                      onChange={() => toggleService(service.id)}
                    />
                    <div className="text-orange-500">
                      {getServiceIcon(service.icone)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">{service.nome}</h3>
                    </div>
                  </div>
                  
                  {service.selected && (
                    <div className="mt-3">
                      <Label htmlFor={`price-${service.id}`} className="text-sm">
                        Preço médio (R$)
                      </Label>
                      <Input
                        id={`price-${service.id}`}
                        type="number"
                        min="0"
                        step="0.01"
                        value={service.preco_medio || ''}
                        onChange={(e) => updatePrice(service.id, parseFloat(e.target.value) || 0)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Ex: 50.00"
                        className="mt-1"
                      />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onComplete}>
              Pular por Agora
            </Button>
            <Button 
              onClick={saveServices} 
              disabled={saving}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {saving ? 'Salvando...' : 'Salvar Serviços'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceSelectionPage;

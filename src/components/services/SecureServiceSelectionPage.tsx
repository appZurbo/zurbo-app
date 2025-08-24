
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/toast-system";
import { useAuth } from '@/hooks/useAuth';
import { Wrench, Heart, Bolt, Brush, Shield, AlertCircle } from 'lucide-react';

interface Service {
  id: string;
  nome: string;
  icone: string;
}

interface ServiceWithPrice extends Service {
  selected: boolean;
  preco_medio?: number;
}

const SecureServiceSelectionPage = ({ onComplete }: { onComplete: () => void }) => {
  const [services, setServices] = useState<ServiceWithPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { profile, isPrestador } = useAuth();

  useEffect(() => {
    // Security check: only prestadores can access this page
    if (profile && !isPrestador) {
      toast({
        title: "Acesso negado",
        description: "Apenas prestadores podem configurar serviços.",
        variant: "destructive",
      });
      onComplete();
      return;
    }
    
    loadServices();
  }, [profile, isPrestador, onComplete]);

  const loadServices = async () => {
    try {
      const { data, error } = await supabase
        .from('servicos')
        .select('*')
        .eq('ativo', true);

      if (error) throw error;

      setServices(data.map(service => ({
        ...service,
        selected: false,
        preco_medio: 0
      })));
    } catch (error: any) {
      console.error('Error loading services:', error);
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
    // Validate price input
    const validPrice = Math.max(0, Math.min(price, 99999.99)); // Limit to reasonable range
    
    setServices(services.map(service => 
      service.id === serviceId 
        ? { ...service, preco_medio: validPrice }
        : service
    ));
  };

  const saveServices = async () => {
    // Authorization check
    if (!profile || !isPrestador) {
      toast({
        title: "Erro de autorização",
        description: "Você não tem permissão para executar esta ação.",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const selectedServices = services.filter(service => service.selected);
      
      if (selectedServices.length === 0) {
        toast({
          title: "Selecione pelo menos um serviço",
          description: "Você precisa escolher quais serviços irá prestar.",
          variant: "destructive",
        });
        return;
      }

      // Validate prices
      const invalidServices = selectedServices.filter(service => 
        !service.preco_medio || service.preco_medio <= 0
      );
      
      if (invalidServices.length > 0) {
        toast({
          title: "Preços inválidos",
          description: "Todos os serviços selecionados devem ter um preço válido.",
          variant: "destructive",
        });
        return;
      }

      // First, remove existing services for this provider
      await supabase
        .from('prestador_servicos')
        .delete()
        .eq('prestador_id', profile.id);

      // Insert new services with validation
      const servicesToInsert = selectedServices.map(service => ({
        prestador_id: profile.id,
        servico_id: service.id,
        preco_min: Number(service.preco_medio), // Use as both min and max for now
        preco_max: Number(service.preco_medio)
      }));

      const { error } = await supabase
        .from('prestador_servicos')
        .insert(servicesToInsert);

      if (error) throw error;

      toast({
        title: "Serviços salvos com sucesso!",
        description: "Você pode alterar suas opções a qualquer momento no perfil.",
      });

      onComplete();
    } catch (error: any) {
      console.error('Error saving services:', error);
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
      case 'brush': return <Brush className="h-8 w-8" />;
      default: return <Wrench className="h-8 w-8" />;
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Carregando serviços...</div>;
  }

  if (!isPrestador) {
    return (
      <div className="flex justify-center items-center p-8">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600">Apenas prestadores podem configurar serviços.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Escolha os Serviços que Você Presta
            <div className="ml-auto" title="Seleção Segura">
              <Shield className="h-5 w-5 text-green-600" />
            </div>
          </CardTitle>
          <p className="text-gray-600">
            Selecione todos os serviços que você oferece e defina um preço médio para cada um.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {services.map((service) => (
              <Card 
                key={service.id} 
                className={`cursor-pointer transition-colors border-2 ${
                  service.selected ? 'border-orange-500 bg-orange-50' : 'border-gray-200'
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
                        Preço médio (R$) *
                      </Label>
                      <Input
                        id={`price-${service.id}`}
                        type="number"
                        min="0.01"
                        max="99999.99"
                        step="0.01"
                        value={service.preco_medio || ''}
                        onChange={(e) => updatePrice(service.id, parseFloat(e.target.value) || 0)}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Ex: 50.00"
                        className="mt-1"
                        required={service.selected}
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
              disabled={saving || services.filter(s => s.selected).length === 0}
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

export default SecureServiceSelectionPage;


import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Navigation, MapPin, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

export const LocationSettings = () => {
  const { profile, updateLocalProfile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [locationData, setLocationData] = useState({
    endereco_cidade: '',
    endereco_rua: '',
    endereco_numero: '',
    endereco_bairro: '',
    endereco_cep: '',
    latitude: null as number | null,
    longitude: null as number | null,
  });

  useEffect(() => {
    if (profile) {
      setLocationData({
        endereco_cidade: profile.endereco_cidade || '',
        endereco_rua: profile.endereco_rua || '',
        endereco_numero: profile.endereco_numero || '',
        endereco_bairro: profile.endereco_bairro || '',
        endereco_cep: profile.endereco_cep || '',
        latitude: profile.latitude || null,
        longitude: profile.longitude || null,
      });
    }
  }, [profile]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setLoading(false);
        toast({
          title: "Localização obtida!",
          description: "Coordenadas atualizadas com sucesso.",
        });
      },
      (error) => {
        setLoading(false);
        toast({
          title: "Erro ao obter localização",
          description: "Não foi possível obter sua localização atual.",
          variant: "destructive",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 600000 }
    );
  };

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update(locationData)
        .eq('id', profile.id);

      if (error) throw error;

      updateLocalProfile(locationData);
      
      toast({
        title: "Localização salva!",
        description: "Suas informações de localização foram atualizadas.",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao salvar",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setLocationData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Configurações de Localização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={locationData.endereco_cidade}
              onChange={(e) => handleInputChange('endereco_cidade', e.target.value)}
              placeholder="Ex: São Paulo"
            />
          </div>
          
          <div>
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={locationData.endereco_cep}
              onChange={(e) => handleInputChange('endereco_cep', e.target.value)}
              placeholder="Ex: 01234-567"
            />
          </div>
          
          <div>
            <Label htmlFor="rua">Rua</Label>
            <Input
              id="rua"
              value={locationData.endereco_rua}
              onChange={(e) => handleInputChange('endereco_rua', e.target.value)}
              placeholder="Ex: Rua das Flores"
            />
          </div>
          
          <div>
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              value={locationData.endereco_numero}
              onChange={(e) => handleInputChange('endereco_numero', e.target.value)}
              placeholder="Ex: 123"
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              value={locationData.endereco_bairro}
              onChange={(e) => handleInputChange('endereco_bairro', e.target.value)}
              placeholder="Ex: Vila Madalena"
            />
          </div>
        </div>

        {profile?.tipo === 'prestador' && (
          <div className="border-t pt-4">
            <h4 className="font-medium mb-2">Localização GPS (Recomendado para Prestadores)</h4>
            <p className="text-sm text-gray-600 mb-3">
              Permitir localização GPS ajuda clientes a encontrarem você mais facilmente.
            </p>
            <Button
              onClick={getCurrentLocation}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Navigation className="h-4 w-4" />
              )}
              Obter Localização Atual
            </Button>
            {locationData.latitude && locationData.longitude && (
              <p className="text-sm text-green-600 mt-2">
                ✓ Coordenadas: {locationData.latitude.toFixed(6)}, {locationData.longitude.toFixed(6)}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} disabled={loading}>
            {loading ? 'Salvando...' : 'Salvar Localização'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

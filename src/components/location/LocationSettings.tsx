
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getCidades } from '@/utils/database';
import { supabase } from '@/integrations/supabase/client';

interface LocationData {
  endereco_rua?: string;
  endereco_numero?: string;
  endereco_bairro?: string;
  endereco_cidade?: string;
  endereco_cep?: string;
  latitude?: number;
  longitude?: number;
}

export const LocationSettings = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [cidades, setCidades] = useState<any[]>([]);
  const [locationData, setLocationData] = useState<LocationData>({
    endereco_rua: '',
    endereco_numero: '',
    endereco_bairro: '',
    endereco_cidade: '',
    endereco_cep: '',
    latitude: undefined,
    longitude: undefined,
  });

  useEffect(() => {
    loadCidades();
    if (profile) {
      setLocationData({
        endereco_rua: profile.endereco_rua || '',
        endereco_numero: profile.endereco_numero || '',
        endereco_bairro: profile.endereco_bairro || '',
        endereco_cidade: profile.endereco_cidade || '',
        endereco_cep: profile.endereco_cep || '',
        latitude: profile.latitude,
        longitude: profile.longitude,
      });
    }
  }, [profile]);

  const loadCidades = async () => {
    const cidadesData = await getCidades();
    setCidades(cidadesData);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocalização não suportada",
        description: "Seu navegador não suporta geolocalização.",
        variant: "destructive",
      });
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocationData(prev => ({
          ...prev,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        }));
        setGettingLocation(false);
        toast({
          title: "Localização obtida!",
          description: "Suas coordenadas foram atualizadas.",
        });
      },
      (error) => {
        setGettingLocation(false);
        toast({
          title: "Erro ao obter localização",
          description: "Não foi possível obter sua localização atual.",
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          endereco_rua: locationData.endereco_rua?.trim(),
          endereco_numero: locationData.endereco_numero?.trim(),
          endereco_bairro: locationData.endereco_bairro?.trim(),
          endereco_cidade: locationData.endereco_cidade?.trim(),
          endereco_cep: locationData.endereco_cep?.trim(),
          latitude: locationData.latitude,
          longitude: locationData.longitude,
        })
        .eq('id', profile.id);

      if (error) throw error;

      toast({
        title: "Localização atualizada!",
        description: "Suas informações de localização foram salvas.",
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Configurações de Localização
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-blue-600 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Privacidade das informações</p>
              <p>Suas informações de endereço detalhado são privadas e usadas apenas para melhorar a aproximação geográfica dos serviços. Apenas sua cidade será visível publicamente.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="endereco_rua">Rua/Avenida</Label>
            <Input
              id="endereco_rua"
              value={locationData.endereco_rua}
              onChange={(e) => setLocationData(prev => ({ ...prev, endereco_rua: e.target.value }))}
              placeholder="Nome da rua ou avenida"
            />
          </div>

          <div>
            <Label htmlFor="endereco_numero">Número</Label>
            <Input
              id="endereco_numero"
              value={locationData.endereco_numero}
              onChange={(e) => setLocationData(prev => ({ ...prev, endereco_numero: e.target.value }))}
              placeholder="Número da residência"
            />
          </div>

          <div>
            <Label htmlFor="endereco_bairro">Bairro</Label>
            <Input
              id="endereco_bairro"
              value={locationData.endereco_bairro}
              onChange={(e) => setLocationData(prev => ({ ...prev, endereco_bairro: e.target.value }))}
              placeholder="Nome do bairro"
            />
          </div>

          <div>
            <Label htmlFor="endereco_cidade">Cidade</Label>
            <Input
              id="endereco_cidade"
              value={locationData.endereco_cidade}
              onChange={(e) => setLocationData(prev => ({ ...prev, endereco_cidade: e.target.value }))}
              placeholder="Sua cidade"
              list="cidades-list"
            />
            <datalist id="cidades-list">
              {cidades.map((cidade) => (
                <option key={cidade.id} value={cidade.nome} />
              ))}
            </datalist>
          </div>

          <div>
            <Label htmlFor="endereco_cep">CEP</Label>
            <Input
              id="endereco_cep"
              value={locationData.endereco_cep}
              onChange={(e) => setLocationData(prev => ({ ...prev, endereco_cep: e.target.value }))}
              placeholder="00000-000"
              maxLength={9}
            />
          </div>

          <div className="flex items-end">
            <Button
              onClick={getCurrentLocation}
              disabled={gettingLocation}
              variant="outline"
              className="w-full"
            >
              <Navigation className="h-4 w-4 mr-2" />
              {gettingLocation ? 'Obtendo...' : 'Obter Localização Atual'}
            </Button>
          </div>
        </div>

        {(locationData.latitude && locationData.longitude) && (
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <p>Coordenadas: {locationData.latitude?.toFixed(6)}, {locationData.longitude?.toFixed(6)}</p>
          </div>
        )}

        <Button onClick={handleSave} disabled={loading} className="w-full">
          {loading ? 'Salvando...' : 'Salvar Localização'}
        </Button>
      </CardContent>
    </Card>
  );
};

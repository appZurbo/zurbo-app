
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MapPin, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export const LocationSettings = () => {
  const { profile, updateLocalProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    endereco_rua: profile?.endereco_rua || '',
    endereco_numero: profile?.endereco_numero || '',
    endereco_bairro: profile?.endereco_bairro || '',
    endereco_cidade: profile?.endereco_cidade || '',
    endereco_cep: profile?.endereco_cep || ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        endereco_rua: profile.endereco_rua || '',
        endereco_numero: profile.endereco_numero || '',
        endereco_bairro: profile.endereco_bairro || '',
        endereco_cidade: profile.endereco_cidade || '',
        endereco_cep: profile.endereco_cep || ''
      });
    }
  }, [profile]);

  const handleSave = async () => {
    if (!profile) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          endereco_rua: formData.endereco_rua.trim(),
          endereco_numero: formData.endereco_numero.trim(),
          endereco_bairro: formData.endereco_bairro.trim(),
          endereco_cidade: formData.endereco_cidade.trim(),
          endereco_cep: formData.endereco_cep.trim(),
        })
        .eq('id', profile.id);

      if (error) throw error;

      updateLocalProfile(formData);
      toast.success('Localização atualizada com sucesso!');
    } catch (error: any) {
      console.error('Erro ao atualizar localização:', error);
      toast.error('Erro ao atualizar localização');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não é suportada pelo seu navegador');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // Simular busca por endereço baseado nas coordenadas
        // Em uma implementação real, você usaria uma API de geocodificação
        toast.success(`Localização obtida: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        toast.error('Erro ao obter localização');
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
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
          <div className="space-y-2">
            <Label htmlFor="rua">Rua</Label>
            <Input
              id="rua"
              value={formData.endereco_rua}
              onChange={(e) => setFormData({...formData, endereco_rua: e.target.value})}
              placeholder="Nome da rua"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="numero">Número</Label>
            <Input
              id="numero"
              value={formData.endereco_numero}
              onChange={(e) => setFormData({...formData, endereco_numero: e.target.value})}
              placeholder="Número"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bairro">Bairro</Label>
            <Input
              id="bairro"
              value={formData.endereco_bairro}
              onChange={(e) => setFormData({...formData, endereco_bairro: e.target.value})}
              placeholder="Bairro"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cidade">Cidade</Label>
            <Input
              id="cidade"
              value={formData.endereco_cidade}
              onChange={(e) => setFormData({...formData, endereco_cidade: e.target.value})}
              placeholder="Cidade"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="cep">CEP</Label>
            <Input
              id="cep"
              value={formData.endereco_cep}
              onChange={(e) => setFormData({...formData, endereco_cep: e.target.value})}
              placeholder="00000-000"
              maxLength={9}
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={getCurrentLocation}
            variant="outline"
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 mr-2" />
            )}
            Obter Localização Atual
          </Button>

          <Button
            onClick={handleSave}
            disabled={loading}
            className="flex-1"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : null}
            Salvar
          </Button>
        </div>

        <div className="text-sm text-gray-600">
          <p>
            Suas informações de localização são usadas para conectá-lo com prestadores próximos.
            Mantenha seus dados atualizados para uma melhor experiência.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

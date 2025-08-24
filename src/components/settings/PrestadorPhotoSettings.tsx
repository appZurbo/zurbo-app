
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Plus, Trash2, Upload } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from "@/utils/toast";
import { supabase } from '@/integrations/supabase/client';

interface PhotoItem {
  id: string;
  url: string;
  description?: string;
}

export const PrestadorPhotoSettings = () => {
  const { profile, updateLocalProfile } = useAuth();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(profile?.foto_url || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.portfolio_fotos) {
      try {
        const photosData = typeof profile.portfolio_fotos === 'string' 
          ? JSON.parse(profile.portfolio_fotos)
          : profile.portfolio_fotos;
        setPhotos(Array.isArray(photosData) ? photosData : []);
      } catch (error) {
        console.error('Erro ao carregar fotos do portfólio:', error);
        setPhotos([]);
      }
    }
  }, [profile]);

  const handleProfilePhotoUpdate = async () => {
    if (!profile || !profilePhotoUrl.trim()) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ foto_url: profilePhotoUrl })
        .eq('id', profile.id);

      if (error) throw error;

      updateLocalProfile({ ...profile, foto_url: profilePhotoUrl });
      toast({
        title: "Sucesso",
        description: "Foto de perfil atualizada com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao atualizar foto de perfil",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const addPortfolioPhoto = () => {
    const newPhoto: PhotoItem = {
      id: Date.now().toString(),
      url: '',
      description: ''
    };
    setPhotos([...photos, newPhoto]);
  };

  const updatePhoto = (id: string, field: keyof PhotoItem, value: string) => {
    setPhotos(photos.map(photo => 
      photo.id === id ? { ...photo, [field]: value } : photo
    ));
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter(photo => photo.id !== id));
  };

  const savePortfolioPhotos = async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const validPhotos = photos.filter(photo => photo.url.trim());
      
      const { error } = await supabase
        .from('users')
        .update({ portfolio_fotos: JSON.stringify(validPhotos) } as any)
        .eq('id', profile.id);

      if (error) throw error;

      updateLocalProfile({ ...profile, portfolio_fotos: JSON.stringify(validPhotos) } as any);
      toast({
        title: "Sucesso",
        description: "Portfólio atualizado com sucesso!"
      });
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao salvar portfólio",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Foto de Perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-orange-500" />
            Foto de Perfil
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            {profilePhotoUrl && (
              <img 
                src={profilePhotoUrl} 
                alt="Foto de perfil"
                className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
              />
            )}
            <div className="flex-1">
              <Label htmlFor="profile-photo">URL da Foto de Perfil</Label>
              <Input
                id="profile-photo"
                type="url"
                value={profilePhotoUrl}
                onChange={(e) => setProfilePhotoUrl(e.target.value)}
                placeholder="https://exemplo.com/sua-foto.jpg"
              />
            </div>
          </div>
          <Button 
            onClick={handleProfilePhotoUpdate}
            disabled={loading}
            className="bg-orange-500 hover:bg-orange-600"
          >
            <Upload className="h-4 w-4 mr-2" />
            Atualizar Foto de Perfil
          </Button>
        </CardContent>
      </Card>

      {/* Portfólio de Fotos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5 text-orange-500" />
            Portfólio de Trabalhos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {photo.url && (
                    <img 
                      src={photo.url} 
                      alt="Foto do portfólio"
                      className="w-16 h-16 rounded object-cover border"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <div>
                      <Label>URL da Foto</Label>
                      <Input
                        type="url"
                        value={photo.url}
                        onChange={(e) => updatePhoto(photo.id, 'url', e.target.value)}
                        placeholder="https://exemplo.com/foto-trabalho.jpg"
                      />
                    </div>
                    <div>
                      <Label>Descrição (opcional)</Label>
                      <Input
                        value={photo.description || ''}
                        onChange={(e) => updatePhoto(photo.id, 'description', e.target.value)}
                        placeholder="Descrição do trabalho realizado"
                      />
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removePhoto(photo.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={addPortfolioPhoto}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Adicionar Foto
            </Button>
            
            <Button 
              onClick={savePortfolioPhotos}
              disabled={loading}
              className="bg-orange-500 hover:bg-orange-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Salvar Portfólio
            </Button>
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
            <p><strong>Dica:</strong> Adicione fotos dos seus melhores trabalhos para atrair mais clientes. Use URLs de imagens hospedadas online.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

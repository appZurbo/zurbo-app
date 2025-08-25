
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, Trash2, Eye, X } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { BannerImages } from '@/components/banners/BannerImages';

interface BannerImage {
  name: string;
  url: string;
}

export const BannerImageUploader = () => {
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState<BannerImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de arquivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Apenas arquivos PNG e JPG são permitidos');
      return;
    }

    // Validar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Arquivo deve ter no máximo 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { error } = await supabase.storage
        .from('banner-images')
        .upload(fileName, file);

      if (error) {
        throw error;
      }

      toast.success('Imagem enviada com sucesso!');
      
      // Recarregar a lista
      setTimeout(() => {
        window.location.reload();
      }, 1000);
      
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar imagem: ' + error.message);
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleDeleteImage = async (imageName: string) => {
    if (!confirm('Tem certeza que deseja excluir esta imagem?')) return;

    try {
      const { error } = await supabase.storage
        .from('banner-images')
        .remove([imageName]);

      if (error) throw error;

      toast.success('Imagem excluída com sucesso!');
      setImages(prev => prev.filter(img => img.name !== imageName));
      
    } catch (error: any) {
      console.error('Erro ao excluir:', error);
      toast.error('Erro ao excluir imagem: ' + error.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload de Imagens para Banners
          </CardTitle>
          <CardDescription>
            Faça upload das imagens 3D que serão exibidas nos banners da página inicial.
            Formatos suportados: PNG, JPG (máximo 5MB cada).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              onChange={handleFileUpload}
              disabled={uploading}
              className="cursor-pointer"
            />
            <div className="text-sm text-muted-foreground">
              <p>• Use imagens com fundo transparente (PNG recomendado)</p>
              <p>• Resolução recomendada: 512x512px ou maior</p>
              <p>• As imagens devem representar categorias de serviços</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Imagens Atuais</CardTitle>
          <CardDescription>
            Gerencie as imagens que estão sendo exibidas nos banners
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BannerImages 
            onImagesLoaded={setImages}
            className="min-h-[200px]"
          />
          
          {images.length > 0 && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {images.map((image) => (
                <div key={image.name} className="border rounded-lg p-3 space-y-2">
                  <img 
                    src={image.url} 
                    alt={image.name}
                    className="w-full h-20 object-contain bg-gray-50 rounded"
                  />
                  <p className="text-sm font-medium truncate">{image.name}</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedImage(image.url)}
                      className="flex-1"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Ver
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteImage(image.name)}
                      className="flex-1"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal para visualizar imagem */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-white"
            >
              <X className="h-4 w-4" />
            </Button>
            <img 
              src={selectedImage} 
              alt="Preview"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

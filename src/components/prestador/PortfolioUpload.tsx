
import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Upload, X, Image, GripVertical } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface PortfolioImage {
  id: string;
  foto_url: string;
  titulo?: string;
  descricao?: string;
  ordem: number;
}

export const PortfolioUpload = () => {
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [uploading, setUploading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const { toast } = useToast();
  const { profile } = useAuth();

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (!profile) return;

    setUploading(true);
    try {
      for (const file of acceptedFiles) {
        // Upload to Supabase Storage
        const fileExt = file.name.split('.').pop();
        const fileName = `${profile.id}/${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('portfolio')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('portfolio')
          .getPublicUrl(fileName);

        // Save to database
        const { data, error } = await supabase
          .from('portfolio_fotos')
          .insert({
            prestador_id: profile.id,
            foto_url: publicUrl,
            ordem: images.length,
          })
          .select()
          .single();

        if (error) throw error;

        setImages(prev => [...prev, data]);
      }

      toast({
        title: "Imagens enviadas!",
        description: "Suas fotos foram adicionadas ao portfólio.",
      });
    } catch (error: any) {
      console.error('Error uploading images:', error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  }, [profile, images.length, toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.webp']
    },
    multiple: true,
  });

  const updateImageInfo = async (id: string, titulo?: string, descricao?: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_fotos')
        .update({ titulo, descricao })
        .eq('id', id);

      if (error) throw error;

      setImages(prev =>
        prev.map(img =>
          img.id === id ? { ...img, titulo, descricao } : img
        )
      );

      toast({
        title: "Informações atualizadas!",
        description: "As informações da imagem foram salvas.",
      });
    } catch (error: any) {
      console.error('Error updating image info:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_fotos')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setImages(prev => prev.filter(img => img.id !== id));

      toast({
        title: "Imagem removida",
        description: "A imagem foi removida do seu portfólio.",
      });
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        title: "Erro",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;

    const newImages = Array.from(images);
    const [reorderedImage] = newImages.splice(result.source.index, 1);
    newImages.splice(result.destination.index, 0, reorderedImage);

    // Update ordem for all images
    const updatedImages = newImages.map((img, index) => ({
      ...img,
      ordem: index,
    }));

    setImages(updatedImages);

    // Update in database
    try {
      for (const img of updatedImages) {
        await supabase
          .from('portfolio_fotos')
          .update({ ordem: img.ordem })
          .eq('id', img.id);
      }
    } catch (error) {
      console.error('Error updating image order:', error);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Image className="h-5 w-5" />
            Upload de Portfólio
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            {isDragActive ? (
              <p>Solte as imagens aqui...</p>
            ) : (
              <div>
                <p className="mb-2">Arraste e solte imagens aqui, ou clique para selecionar</p>
                <p className="text-sm text-gray-500">PNG, JPG, JPEG, WEBP até 10MB</p>
              </div>
            )}
          </div>
          
          {uploading && (
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
                Enviando imagens...
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {images.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Suas Imagens do Portfólio</CardTitle>
            <p className="text-sm text-gray-600">
              Arraste para reordenar, clique para editar informações
            </p>
          </CardHeader>
          <CardContent>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="portfolio">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  >
                    {images.map((image, index) => (
                      <Draggable key={image.id} draggableId={image.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="relative group"
                          >
                            <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                              <img
                                src={image.foto_url}
                                alt={image.titulo || 'Portfólio'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            
                            <div className="absolute top-2 left-2" {...provided.dragHandleProps}>
                              <div className="bg-black/50 text-white p-1 rounded cursor-move">
                                <GripVertical className="h-4 w-4" />
                              </div>
                            </div>
                            
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteImage(image.id)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            {editingImage === image.id ? (
                              <div className="mt-2 space-y-2">
                                <Input
                                  placeholder="Título da imagem"
                                  defaultValue={image.titulo}
                                  onBlur={(e) => updateImageInfo(image.id, e.target.value, image.descricao)}
                                />
                                <Textarea
                                  placeholder="Descrição"
                                  defaultValue={image.descricao}
                                  onBlur={(e) => updateImageInfo(image.id, image.titulo, e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => setEditingImage(null)}
                                >
                                  Salvar
                                </Button>
                              </div>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                className="mt-2 w-full"
                                onClick={() => setEditingImage(image.id)}
                              >
                                Editar Informações
                              </Button>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

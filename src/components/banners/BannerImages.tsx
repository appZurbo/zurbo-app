
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface BannerImage {
  name: string;
  url: string;
}

interface BannerImagesProps {
  className?: string;
  onImagesLoaded?: (images: BannerImage[]) => void;
}

export const BannerImages = ({ className = "", onImagesLoaded }: BannerImagesProps) => {
  const [images, setImages] = useState<BannerImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBannerImages = async () => {
      try {
        const { data, error } = await supabase.storage
          .from('banner-images')
          .list('', {
            limit: 100,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Erro ao carregar imagens dos banners:', error);
          return;
        }

        if (data) {
          const imagePromises = data
            .filter(file => file.name.endsWith('.png') || file.name.endsWith('.jpg') || file.name.endsWith('.jpeg'))
            .map(async (file) => {
              const { data: urlData } = await supabase.storage
                .from('banner-images')
                .getPublicUrl(file.name);
              
              return {
                name: file.name,
                url: urlData.publicUrl
              };
            });

          const loadedImages = await Promise.all(imagePromises);
          setImages(loadedImages);
          onImagesLoaded?.(loadedImages);
        }
      } catch (error) {
        console.error('Erro geral ao carregar imagens:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBannerImages();
  }, [onImagesLoaded]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="animate-pulse text-muted-foreground">Carregando imagens...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-muted-foreground text-center">
          <p>Nenhuma imagem encontrada.</p>
          <p className="text-xs mt-1">Faça upload das imagens via painel admin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <div key={image.name} className="relative group">
          <img
            src={image.url}
            alt={`Banner ${index + 1}`}
            className="w-full h-24 object-contain rounded-lg bg-white/5 backdrop-blur-sm 
                     group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {image.name.replace(/\.[^/.]+$/, "")}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

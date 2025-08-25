
import { useState, useEffect } from 'react';

interface BannerImage {
  name: string;
  url: string;
}

interface LocalBannerImagesProps {
  className?: string;
  onImagesLoaded?: (images: BannerImage[]) => void;
}

export const LocalBannerImages = ({ className = "", onImagesLoaded }: LocalBannerImagesProps) => {
  const [images, setImages] = useState<BannerImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const localImages = [
      { name: 'Beleza', url: '/beleza.png' },
      { name: 'Chaveiro', url: '/chaveiro.png' },
      { name: 'Construção', url: '/construcao.png' },
      { name: 'Cuidados', url: '/cuidados.png' },
      { name: 'Eletricista', url: '/eletricista.png' },
      { name: 'Frete', url: '/frete.png' },
      { name: 'Jardinagem', url: '/jardinagem.png' },
      { name: 'Limpeza', url: '/limpeza.png' },
      { name: 'Mecânico', url: '/mecanico.png' },
      { name: 'Refrigeração', url: '/refrigeracao.png' },
      { name: 'Técnico em Informática', url: '/tecnicoinformatica.png' }
    ];

    setImages(localImages);
    onImagesLoaded?.(localImages);
    setLoading(false);
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
            alt={`Banner ${image.name}`}
            className="w-full h-24 object-contain rounded-lg bg-white/5 backdrop-blur-sm 
                     group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                        transition-opacity duration-300 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-medium">
              {image.name}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

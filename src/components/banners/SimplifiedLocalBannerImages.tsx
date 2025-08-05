
import { useState, useEffect } from 'react';

interface BannerImage {
  name: string;
  url: string;
}

interface SimplifiedLocalBannerImagesProps {
  className?: string;
  onImagesLoaded?: (images: BannerImage[]) => void;
}

export const SimplifiedLocalBannerImages = ({ className = "", onImagesLoaded }: SimplifiedLocalBannerImagesProps) => {
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
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
        <div className="text-white text-sm">Carregando imagens...</div>
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`}>
        <div className="text-white text-center">
          <p>Nenhuma imagem encontrada.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${className}`}>
      {images.map((image) => (
        <div key={image.name} className="relative group cursor-pointer">
          <div className="relative w-full h-32 overflow-hidden rounded-xl bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm">
            <img
              src={image.url}
              alt={`Profissional ${image.name}`}
              className="absolute inset-0 w-full h-full object-cover object-center 
                       transition-transform duration-500 ease-out
                       transform scale-[3.2] translate-y-[-20%] translate-x-[10%]
                       group-hover:scale-[3.5] group-hover:translate-y-[-25%]"
              loading="lazy"
              style={{ 
                objectPosition: 'center 30%',
                width: '33.33%',
                left: '0%'
              }}
            />
            {/* Overlay gradiente sutil */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent 
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Label do serviço */}
          <div className="absolute bottom-2 left-2 right-2">
            <div className="bg-black/50 backdrop-blur-sm text-white text-xs font-medium 
                          px-3 py-1.5 rounded-lg text-center
                          opacity-0 group-hover:opacity-100 transition-all duration-300
                          transform translate-y-2 group-hover:translate-y-0">
              {image.name}
            </div>
          </div>

          {/* Indicador de hover */}
          <div className="absolute top-2 right-2 w-2 h-2 bg-orange-400 rounded-full 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
      ))}
    </div>
  );
};

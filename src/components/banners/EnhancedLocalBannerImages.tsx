
import { useState, useEffect } from 'react';
import { removeBackground, loadImage } from '@/utils/backgroundRemoval';

interface BannerImage {
  name: string;
  url: string;
  processedUrl?: string;
}

interface EnhancedLocalBannerImagesProps {
  className?: string;
  onImagesLoaded?: (images: BannerImage[]) => void;
}

export const EnhancedLocalBannerImages = ({ className = "", onImagesLoaded }: EnhancedLocalBannerImagesProps) => {
  const [images, setImages] = useState<BannerImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [processedCount, setProcessedCount] = useState(0);

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

    const processImages = async () => {
      console.log('Starting image processing...');
      const processedImages: BannerImage[] = [];
      
      for (const image of localImages) {
        try {
          // Check cache first
          const cacheKey = `processed_${image.name}`;
          const cachedUrl = localStorage.getItem(cacheKey);
          
          if (cachedUrl) {
            console.log(`Using cached image for ${image.name}`);
            processedImages.push({ ...image, processedUrl: cachedUrl });
            setProcessedCount(prev => prev + 1);
            continue;
          }

          // Load the original image
          const response = await fetch(image.url);
          const blob = await response.blob();
          const imageElement = await loadImage(blob);
          
          // Remove background
          console.log(`Processing ${image.name}...`);
          const processedBlob = await removeBackground(imageElement);
          const processedUrl = URL.createObjectURL(processedBlob);
          
          // Cache the processed image
          localStorage.setItem(cacheKey, processedUrl);
          
          processedImages.push({ ...image, processedUrl });
          setProcessedCount(prev => prev + 1);
          console.log(`Completed processing ${image.name}`);
          
        } catch (error) {
          console.error(`Failed to process ${image.name}:`, error);
          // Fallback to original image
          processedImages.push(image);
          setProcessedCount(prev => prev + 1);
        }
      }
      
      setImages(processedImages);
      onImagesLoaded?.(processedImages);
      setLoading(false);
      console.log('All images processed');
    };

    processImages();
  }, [onImagesLoaded]);

  if (loading) {
    return (
      <div className={`flex flex-col items-center justify-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-4"></div>
        <div className="text-white text-sm text-center">
          <p>Processando imagens com IA...</p>
          <p className="text-xs text-white/70 mt-1">
            {processedCount} de 11 imagens processadas
          </p>
        </div>
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
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <div key={image.name} className="relative group">
          <div className="w-full h-24 rounded-lg overflow-hidden bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/20">
            <img
              src={image.processedUrl || image.url}
              alt={`Banner ${image.name}`}
              className="w-full h-full object-cover object-center 
                       group-hover:scale-125 transition-transform duration-300 scale-150"
              loading="lazy"
              style={{ 
                objectPosition: 'center 15%',
                transform: 'scale(2.5) translateY(-15%)'
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent 
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg 
                        flex items-end justify-center pb-2">
            <span className="text-white text-xs font-medium bg-black/50 px-2 py-1 rounded">
              {image.name}
            </span>
          </div>
          {image.processedUrl && (
            <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full opacity-80"></div>
          )}
        </div>
      ))}
    </div>
  );
};

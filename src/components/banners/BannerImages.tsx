
import { useState } from 'react';

interface BannerImage {
  id: string;
  name: string;
  category: string;
  description: string;
}

export const bannerImages: BannerImage[] = [
  {
    id: 'cuidados',
    name: 'cuidados-banner.png',
    category: 'Cuidados',
    description: 'Profissionais de saúde e cuidados infantis'
  },
  {
    id: 'beleza',
    name: 'beleza-banner.png', 
    category: 'Beleza',
    description: 'Cabeleireira profissional'
  },
  {
    id: 'chaveiro',
    name: 'chaveiro-banner.png',
    category: 'Chaveiro',
    description: 'Chaveiro especializado'
  },
  {
    id: 'construcao',
    name: 'construcao-banner.png',
    category: 'Construção',
    description: 'Profissional da construção civil'
  },
  {
    id: 'eletrica',
    name: 'eletrica-banner.png',
    category: 'Elétrica',
    description: 'Eletricista profissional'
  },
  {
    id: 'fretes',
    name: 'fretes-banner.png',
    category: 'Fretes',
    description: 'Equipe de frete e mudanças'
  },
  {
    id: 'mecanico',
    name: 'mecanico-banner.png',
    category: 'Mecânico',
    description: 'Mecânico automotivo'
  }
];

interface BannerImageProps {
  imageId: string;
  className?: string;
  alt?: string;
}

export const BannerImage = ({ imageId, className = "", alt }: BannerImageProps) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  
  const imageInfo = bannerImages.find(img => img.id === imageId);
  const imageUrl = `https://mbzxifrkabfnufliawzo.supabase.co/storage/v1/object/public/banner-images/${imageInfo?.name}`;
  
  const handleImageLoad = () => {
    setImageStatus('loaded');
  };

  const handleImageError = () => {
    setImageStatus('error');
  };

  if (!imageInfo) return null;

  return (
    <div className={`relative ${className}`}>
      {imageStatus === 'loading' && (
        <div className="absolute inset-0 bg-muted/20 rounded-lg animate-pulse" />
      )}
      
      {(imageStatus === 'loading' || imageStatus === 'loaded') && (
        <img 
          src={imageUrl}
          alt={alt || imageInfo.description}
          className={`w-full h-full object-contain transition-opacity duration-300 ${
            imageStatus === 'loaded' ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
          style={{ backgroundColor: 'transparent' }}
        />
      )}
      
      {imageStatus === 'error' && (
        <div className="flex items-center justify-center h-full text-muted-foreground bg-muted/10 rounded-lg">
          <span className="text-sm">Imagem não encontrada</span>
        </div>
      )}
    </div>
  );
};

export default BannerImage;

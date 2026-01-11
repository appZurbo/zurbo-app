
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { getServiceIcon, type ServiceCategory } from '@/config/serviceCategories';
import { getCategoryInfo } from '@/utils/categoryServices';
import {
  MorphingDialog,
  MorphingDialogTrigger,
  MorphingDialogContainer,
  MorphingDialogContent,
  MorphingDialogClose,
  MorphingDialogTitle,
  MorphingDialogDescription,
  MorphingDialogImage,
} from '@/components/ui/morphing-dialog';

interface CategoryModalProps {
  category: ServiceCategory;
  index: number;
  onCategorySelect: (serviceIds: string[]) => void;
}

export const CategoryModal = ({ category, index, onCategorySelect }: CategoryModalProps) => {
  const navigate = useNavigate();
  const { services, description } = getCategoryInfo(category.id);
  const imageUrl = `/${category.image}`;
  const hasServices = category.serviceIds && category.serviceIds.length > 0;

  // Mapeamento das imagens do grid para usar PNGs da pasta icons/
  const getGridImageUrl = (categoryId: string) => {
    const gridImageMap: Record<string, string> = {
      'limpeza': 'icons/limpeza.png',
      'reparos': 'icons/reparos.png',
      'eletrica': 'icons/eletricista.png',
      'beleza': 'icons/beleza.png',
      'construcao': 'icons/construcao.png',
      'jardinagem': 'icons/jardineiro.png',
      'fretes': 'icons/fretes.png',
      'chaveiro': 'icons/chaveiro.png',
      'cozinha': 'icons/cozinha.png',
      'tecnologia': 'icons/tecnologia.png',
      'cuidados': 'icons/cuidados (1).png',
      'refrigeracao': 'icons/refrigeracao.png',
      'mecanico': 'icons/mecanico.png'
    };
    return gridImageMap[categoryId] || category.image;
  };

  const gridImageUrl = `/${getGridImageUrl(category.id)}`;

  const handleFindProviders = () => {
    if (hasServices) {
      // Navigate to prestadores page with pre-applied filters
      const searchParams = new URLSearchParams();
      searchParams.set('servicos', category.serviceIds.join(','));
      navigate(`/prestadores?${searchParams.toString()}`);
    } else {
      // For categories without services, navigate to general prestadores page
      navigate('/prestadores');
    }
  };

  // White background for all categories (images are transparent)
  const getImageBackground = () => {
    return 'bg-white';
  };

  // Dynamic positioning and sizing based on category needs
  const getImageStyles = (categoryId: string) => {
    const baseStyles = {
      objectFit: 'contain' as const,
    };

    switch (categoryId) {
      case 'fretes':
        // Special handling for fretes - reduce scale and use object-cover for edge cropping
        return {
          ...baseStyles,
          objectFit: 'cover' as const,
          objectPosition: 'center 75%',
          transform: 'scale(1.2)' // Reduced from 1.4 to prevent cutting left character
        };
      case 'encanador':
        // New encanador category positioning
        return {
          ...baseStyles,
          objectPosition: 'center 20%',
          transform: 'scale(1.5)'
        };
      case 'cozinha':
        // New cozinha category positioning
        return {
          ...baseStyles,
          objectPosition: 'center 25%',
          transform: 'scale(1.4)'
        };
      case 'limpeza':
      case 'beleza':
      case 'reparos':
      case 'eletrica':
      case 'construcao':
      case 'jardinagem':
      case 'refrigeracao':
        // Categories that need to be enlarged and positioned at the very top to show faces clearly
        return {
          ...baseStyles,
          objectPosition: 'center top', // Position at the very top to show faces
          transform: 'scale(1.4)' // Slightly reduced scale to show more of the image
        };
      default:
        // Default positioning for other categories
        return {
          ...baseStyles,
          objectPosition: 'center 70%',
          transform: 'scale(1.4)'
        };
    }
  };

  return (
    <MorphingDialog
      transition={{
        type: "spring",
        bounce: 0.05,
        duration: 0.25,
      }}
    >
      <MorphingDialogTrigger
        style={{
          borderRadius: "16px",
          animationDelay: `${index * 0.1}s`
        }}
        className="cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg border border-border rounded-2xl overflow-hidden animate-on-scroll group w-full h-24"
      >
        <div className="flex h-full">
          {/* Text content - 60% width */}
          <div className="flex-1 p-4 flex items-center justify-center bg-background">
            <MorphingDialogTitle className="font-semibold text-foreground text-lg group-hover:text-primary transition-colors text-center">
              {category.name}
              {!hasServices && category.id !== 'chaveiro' && category.id !== 'mecanico' && <span className="text-xs block text-muted-foreground">Em breve</span>}
            </MorphingDialogTitle>
          </div>
          
          {/* Image section - 40% width, full height */}
          <div className={`w-[40%] h-full relative overflow-hidden ${getImageBackground()}`}>
            <MorphingDialogImage
              src={gridImageUrl}
              alt={category.name}
              className="absolute inset-0 w-full h-full group-hover:scale-[1.5] transition-transform duration-300"
              style={getImageStyles(category.id)}
            />
          </div>
        </div>
      </MorphingDialogTrigger>

      <MorphingDialogContainer>
        <MorphingDialogContent
          style={{
            borderRadius: "24px",
          }}
          className="pointer-events-auto relative flex flex-col md:flex-row h-auto w-full max-w-4xl overflow-hidden border border-border bg-white dark:bg-zinc-900 shadow-2xl"
        >
          {/* Content Section - Left on desktop, top on mobile */}
          <div className="flex-1 p-8">
            <MorphingDialogTitle className="text-3xl font-bold text-foreground mb-4">
              {category.name}
              {!hasServices && category.id !== 'chaveiro' && category.id !== 'mecanico' && <span className="text-sm block text-muted-foreground mt-1">Em breve</span>}
            </MorphingDialogTitle>
            
            <MorphingDialogDescription
              disableLayoutAnimation
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                exit: { opacity: 0, y: 20 },
              }}
              className="space-y-6"
            >
              <p className="text-muted-foreground text-base leading-relaxed">
                {description}
              </p>

              <div>
                <h3 className="text-xl font-semibold text-foreground mb-4">
                  {hasServices ? 'Serviços Disponíveis:' : 'Serviços Planejados:'}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {services.map((service, serviceIndex) => {
                    const serviceIcon = getServiceIcon(service);
                    const IconComponent = serviceIcon.icon;
                    
                    return (
                      <div 
                        key={serviceIndex}
                        className={`flex items-center gap-3 p-3 rounded-lg border border-border/50 ${
                          hasServices ? 'bg-muted/20' : 'bg-muted/10 opacity-70'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${serviceIcon.bgColor}`}>
                          <IconComponent size={20} className={serviceIcon.color} />
                        </div>
                        <span className={`font-medium ${hasServices ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {service}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Button 
                onClick={handleFindProviders}
                className={`w-full font-semibold py-3 px-6 rounded-xl transition-colors ${
                  hasServices 
                    ? 'bg-primary hover:bg-primary/90 text-primary-foreground' 
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
                size="lg"
              >
                {hasServices ? 'Encontrar Profissionais' : 'Ver Todos os Prestadores'}
              </Button>
              
              {!hasServices && category.id !== 'chaveiro' && category.id !== 'mecanico' && (
                <p className="text-center text-sm text-muted-foreground">
                  Esta categoria será disponibilizada em breve!
                </p>
              )}
            </MorphingDialogDescription>
          </div>

          {/* Image Section - Right on desktop, bottom on mobile */}
          <div className={`w-full md:w-80 h-64 md:h-auto relative ${getImageBackground()}`}>
            <MorphingDialogImage
              src={imageUrl}
              alt={category.name}
              className="absolute inset-0 w-full h-full"
              style={getImageStyles(category.id)}
            />
          </div>

          <MorphingDialogClose 
            className="text-muted-foreground hover:text-foreground bg-white/80 hover:bg-white/90 dark:bg-zinc-800/80 dark:hover:bg-zinc-800/90 rounded-full p-2 backdrop-blur-sm transition-colors"
            variants={{
              initial: { opacity: 0, scale: 0.8 },
              animate: { opacity: 1, scale: 1 },
              exit: { opacity: 0, scale: 0.8 },
            }}
          />
        </MorphingDialogContent>
      </MorphingDialogContainer>
    </MorphingDialog>
  );
};

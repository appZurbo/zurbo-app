
import { ImageUploader } from '@/components/admin/ImageUploader';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';

const ImageManager = () => {
  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Gerenciador de Imagens
            </h1>
            <p className="text-muted-foreground">
              Upload das imagens das categorias de serviço
            </p>
          </div>
          
          <ImageUploader />
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default ImageManager;


import { BannerImageUploader } from '@/components/admin/BannerImageUploader';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';

const BannerImageManager = () => {
  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-background py-8">
        <div className="max-w-6xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Gerenciador de Imagens dos Banners
            </h1>
            <p className="text-muted-foreground">
              Upload das imagens 3D para os banners da home page
            </p>
          </div>
          
          <BannerImageUploader />
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default BannerImageManager;

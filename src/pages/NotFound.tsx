
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from '@/components/ui/button';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import WatermarkSection from '@/components/sections/WatermarkSection';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <UnifiedHeader />
      
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-6xl font-bold text-orange-500 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Página não encontrada</h2>
            <p className="text-gray-600 mb-6">
              A página que você está procurando não existe ou foi movida.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button 
              onClick={() => window.history.back()} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <Button 
              onClick={() => window.location.href = '/'} 
              className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600"
            >
              <Home className="h-4 w-4" />
              Ir para o início
            </Button>
          </div>
        </div>
      </div>

      {/* Footer with watermark */}
      <WatermarkSection />
    </div>
  );
};

export default NotFound;

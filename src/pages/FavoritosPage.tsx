import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import ListaFavoritos from '@/components/favoritos/ListaFavoritos';
const FavoritosPage = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  return <UnifiedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            
            <div className="flex-1">
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-lg' : 'text-2xl'}`}>
                Favoritos
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Seus prestadores salvos
              </p>
            </div>
          </div>

          <ListaFavoritos />
        </div>
      </div>
    </UnifiedLayout>;
};
export default FavoritosPage;
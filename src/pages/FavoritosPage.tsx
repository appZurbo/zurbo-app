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
        <div className="flex items-center gap-2 mb-8">
          <div className="w-2 h-8 bg-orange-500 rounded-full"></div>
          <div>
            <h1 className="text-2xl md:text-5xl font-black text-gray-900 uppercase tracking-tighter leading-none">
              Meus <span className="text-orange-500">Favoritos</span>
            </h1>
            <p className="text-gray-500 font-medium mt-1">
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
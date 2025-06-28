
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Home, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <UnifiedLayout>
      <div className="min-h-[60vh] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-4xl">?</span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Página não encontrada
            </h1>
            
            <p className="text-gray-600 mb-8">
              A página que você está procurando não existe ou foi movida.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                onClick={() => navigate('/')}
                className="bg-orange-500 hover:bg-orange-600 flex-1"
              >
                <Home className="h-4 w-4 mr-2" />
                Ir para Home
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => navigate('/prestadores')}
                className="flex-1"
              >
                <Search className="h-4 w-4 mr-2" />
                Buscar Serviços
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </UnifiedLayout>
  );
};

export default NotFound;

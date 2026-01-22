import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, Phone, MapPin, Shield } from 'lucide-react';

export const ModernFooter = () => {
  return (
    <footer className="bg-transparent relative py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm flex-wrap justify-center md:justify-start">
            <Link 
              to="/politica-privacidade" 
              className="text-gray-700 hover:text-gray-900 transition-colors flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Política de Privacidade
            </Link>
            <Link 
              to="/termos-uso" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Termos de Uso
            </Link>
            <Link 
              to="/sobre-nos" 
              className="text-gray-700 hover:text-gray-900 transition-colors"
            >
              Sobre Nós
            </Link>
          </div>
          
          <div className="text-gray-600 text-sm">
            © {new Date().getFullYear()} Zurbo. Todos os direitos reservados.
          </div>
        </div>
      </div>
    </footer>
  );
};
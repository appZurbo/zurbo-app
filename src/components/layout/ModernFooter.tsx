import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, Phone, MapPin, Shield } from 'lucide-react';

export const ModernFooter = () => {
  return (
    <footer className="bg-gray-900 text-white relative overflow-hidden py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 text-sm flex-wrap justify-center md:justify-start">
            <Link 
              to="/politica-privacidade" 
              className="text-gray-300 hover:text-white transition-colors flex items-center gap-2"
            >
              <Shield className="h-4 w-4" />
              Política de Privacidade
            </Link>
            <Link 
              to="/termos-uso" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Termos de Uso
            </Link>
            <Link 
              to="/sobre-nos" 
              className="text-gray-300 hover:text-white transition-colors"
            >
              Sobre Nós
            </Link>
          </div>
          
          <div className="text-gray-400 text-sm">
            © {new Date().getFullYear()} Zurbo. Todos os direitos reservados.
          </div>
        </div>
      </div>
      
      {/* Marca d'água "zurbo" */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 text-orange-500 font-extrabold text-[15vw] lowercase select-none z-0" 
        style={{ bottom: '-6.5vw' }}
      >
        zurbo
      </div>
    </footer>
  );
};
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
export const ModernFooter = () => {
  return <footer className="bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">Z</span>
              </div>
              <span className="text-xl font-bold">Zurbo</span>
            </div>
            <p className="text-gray-400 text-sm">
              Conectando pessoas através de serviços de qualidade em Sinop e região.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Feito com carinho para nossa comunidade</span>
            </div>
          </div>

          {/* Links Úteis */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Links Úteis</h4>
            <div className="space-y-2">
              <Link to="/como-funciona" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Como Funciona
              </Link>
              <Link to="/trabalhe-conosco" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Trabalhe Conosco
              </Link>
              
              <Link to="/central-ajuda" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Central de Ajuda
              </Link>
            </div>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Legal</h4>
            <div className="space-y-2">
              <Link to="/termos-uso" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Termos de Uso
              </Link>
              <Link to="/politica-privacidade" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Política de Privacidade
              </Link>
              <Link to="/regras-comunidade" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Regras da Comunidade
              </Link>
              <Link to="/sobre-nos" className="block text-gray-400 hover:text-white text-sm transition-colors">
                Sobre Nós
              </Link>
            </div>
          </div>

          {/* Contato */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contato</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Mail className="h-4 w-4" />
                <span>contato@zurbo.com.br</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Phone className="h-4 w-4" />
                <span>(65) 9999-9999</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin className="h-4 w-4" />
                <span>Sinop, Mato Grosso</span>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-gray-700" />

        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">© 2025 Zurbo. Todos os direitos reservados.</div>
          <div className="text-sm text-gray-400">
            Versão 1.0 - Sinop, MT
          </div>
        </div>
      </div>
    </footer>;
};
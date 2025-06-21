
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Mail, 
  Phone, 
  MapPin,
  Crown,
  Shield,
  Users,
  Star
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ModernFooter = () => {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">
              Fique por dentro das novidades
            </h3>
            <p className="text-orange-100 mb-6 max-w-2xl mx-auto">
              Receba dicas, promoções exclusivas e novos serviços diretamente no seu email
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                placeholder="Seu melhor email"
                className="bg-white/10 border-white/20 text-white placeholder:text-orange-100 focus:border-white focus:ring-white"
              />
              <Button variant="secondary" className="bg-white text-orange-600 hover:bg-gray-100">
                Inscrever
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                    Zurbo
                  </h3>
                  <p className="text-xs text-gray-500 -mt-1">Conectando talentos</p>
                </div>
              </div>
              
              <p className="text-gray-400 text-sm leading-relaxed">
                A plataforma que conecta você aos melhores profissionais da sua região. 
                Rápido, seguro e confiável.
              </p>
              
              <div className="flex space-x-4">
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500">
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500">
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500">
                  <Twitter className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-orange-500">
                  <Linkedin className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Services Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Serviços</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Limpeza</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Jardinagem</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Pintura</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Elétrica</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Encanamento</a></li>
                <li><a href="#" className="text-gray-400 hover:text-orange-500 transition-colors">Mudança</a></li>
                <li>
                  <Link to="/servicos" className="text-orange-500 hover:text-orange-400 font-medium">
                    Ver todos os serviços →
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/sobre" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Sobre nós
                  </Link>
                </li>
                <li>
                  <Link to="/como-funciona" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Como funciona
                  </Link>
                </li>
                <li>
                  <Link to="/premium" className="text-gray-400 hover:text-orange-500 transition-colors flex items-center gap-1">
                    <Crown className="h-3 w-3 text-yellow-500" />
                    Plano Premium
                  </Link>
                </li>
                <li>
                  <Link to="/seguranca" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Segurança
                  </Link>
                </li>
                <li>
                  <Link to="/carreiras" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Carreiras
                  </Link>
                </li>
              </ul>
            </div>

            {/* Support Column */}
            <div>
              <h4 className="text-white font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/central-ajuda" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Central de Ajuda
                  </Link>
                </li>
                <li>
                  <Link to="/contato" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Contato
                  </Link>
                </li>
                <li>
                  <Link to="/regras-comunidade" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Regras da Comunidade
                  </Link>
                </li>
                <li>
                  <Link to="/termos" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Termos de Uso
                  </Link>
                </li>
                <li>
                  <Link to="/privacidade" className="text-gray-400 hover:text-orange-500 transition-colors">
                    Política de Privacidade
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                  <Users className="h-4 w-4" />
                  Prestadores
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">5000+</div>
                <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                  <Shield className="h-4 w-4" />
                  Serviços realizados
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">4.8</div>
                <div className="text-sm text-gray-400 flex items-center justify-center gap-1">
                  <Star className="h-4 w-4" />
                  Avaliação média
                </div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">50+</div>
                <div className="text-sm text-gray-400">Cidades atendidas</div>
              </div>
            </div>
          </div>

          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-gray-800">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex flex-col md:flex-row gap-6 text-sm text-gray-400">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  contato@zurbo.com.br
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  (11) 9999-9999
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  São Paulo, Brasil
                </div>
              </div>
              
              <div className="text-sm text-gray-400">
                © 2024 Zurbo. Todos os direitos reservados.
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

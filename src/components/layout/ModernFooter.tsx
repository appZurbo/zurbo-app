
import { Link } from 'react-router-dom';

export const ModernFooter = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">Z</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Zurbo</h3>
                <p className="text-gray-400 text-sm">Conectando talentos</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              A plataforma que conecta clientes e prestadores de serviços de forma 
              rápida, segura e eficiente em Sinop e região.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Links Rápidos</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/prestadores" className="hover:text-orange-400 transition-colors">
                  Encontrar Prestadores
                </Link>
              </li>
              <li>
                <Link to="/planos" className="hover:text-orange-400 transition-colors">
                  Planos Premium
                </Link>
              </li>
              <li>
                <Link to="/configuracoes" className="hover:text-orange-400 transition-colors">
                  Configurações
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link to="/termos-uso" className="hover:text-orange-400 transition-colors">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link to="/politica-privacidade" className="hover:text-orange-400 transition-colors">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link to="/regras-comunidade" className="hover:text-orange-400 transition-colors">
                  Regras da Comunidade
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Zurbo. Todos os direitos reservados.
          </p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">
            Desenvolvido com ❤️ para Sinop, MT
          </p>
        </div>
      </div>
    </footer>
  );
};

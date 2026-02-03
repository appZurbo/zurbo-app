
import { Link } from 'react-router-dom';
import { Instagram, Facebook } from 'lucide-react';

// Componente simples para o logo do X (antigo Twitter)
const XIcon = ({ size = 16 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.494h2.039L6.486 3.24H4.298l13.311 17.407z" />
  </svg>
);

export const ModernFooter = () => {
  return (
    <footer className="relative mt-20 overflow-hidden min-h-[400px] flex flex-col md:pb-12 pb-32 md:mb-0 bg-[#FDFDFD]">
      {/* Tratamento da imagem de fundo */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {/* Imagem principal */}
        <img
          src="/bottomall.png"
          alt=""
          className="w-full h-full object-cover object-bottom opacity-60"
        />

        {/* Overlay Superior para transição suave com o fundo da página */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#FDFDFD] to-transparent"></div>

        {/* Overlay Inferior para escurecer sutilmente e dar profundidade */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-t from-orange-50/30 to-transparent"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full">
        <div className="bg-white/80 backdrop-blur-md border border-white md:p-12 p-6 rounded-[40px] shadow-2xl shadow-orange-100 mb-0 flex flex-col md:flex-row justify-between gap-12 text-left relative z-1">
          <div>
            <div className="mb-6">
              <img src="/logoinvcrop.png" alt="ZURBO!" className="h-10 w-auto" />
            </div>
            <p className="text-sm text-gray-400 mb-6">Todos os direitos reservados</p>

            {/* Ícones Sociais */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-500 hover:scale-110 shadow-sm transition-transform cursor-pointer">
                <Instagram size={18} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-500 hover:scale-110 shadow-sm transition-transform cursor-pointer">
                <XIcon size={16} />
              </div>
              <div className="w-10 h-10 rounded-full bg-white border border-orange-100 flex items-center justify-center text-orange-500 hover:scale-110 shadow-sm transition-transform cursor-pointer">
                <Facebook size={18} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Explorar</h5>
              <ul className="text-sm space-y-2">
                <li><Link to="/sobre-nos" className="hover:text-orange-500 transition-colors text-gray-700">Nossa História</Link></li>
                <li><Link to="/como-funciona" className="hover:text-orange-500 transition-colors text-gray-700">Como Funciona</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">App</h5>
              <ul className="text-sm space-y-2">
                <li className="relative group cursor-not-allowed overflow-hidden">
                  <span className="text-gray-400 transition-opacity group-hover:opacity-10">iOS App</span>
                  <span className="absolute inset-0 flex items-center justify-center text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Em breve
                  </span>
                </li>
                <li className="relative group cursor-not-allowed overflow-hidden">
                  <span className="text-gray-400 transition-opacity group-hover:opacity-10">Android App</span>
                  <span className="absolute inset-0 flex items-center justify-center text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    Em breve
                  </span>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-gray-400 mb-4">Legal</h5>
              <ul className="text-sm space-y-2">
                <li><Link to="/politica-privacidade" className="hover:text-orange-500 transition-colors text-gray-700">Privacidade</Link></li>
                <li><Link to="/termos-uso" className="hover:text-orange-500 transition-colors text-gray-700">Termos</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};


import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeLandingProps {
  onEnter: () => void;
}

export const WelcomeLanding = ({ onEnter }: WelcomeLandingProps) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Mostrar botão após 1 segundo
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setAnimationStarted(true);
    // Aguardar animação de 0,8 segundos completar antes de chamar onEnter
    setTimeout(() => {
      onEnter();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center overflow-hidden">
      {/* Texto principal com efeito de zoom através da letra Z */}
      <div className="relative text-center">
        <div className={`transition-all duration-[800ms] ease-in-out ${
          animationStarted 
            ? 'transform scale-[50] opacity-0' 
            : 'transform scale-100 opacity-100'
        }`}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-wider">
            BEM-VINDO
          </h1>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 mb-8 tracking-widest relative">
            AO <span className="relative inline-block">
              Z<span className="absolute inset-0 text-transparent bg-white/20 blur-sm">Z</span>
            </span>URBO
          </h2>
          <div className="w-32 h-1 bg-white/50 mx-auto mb-8"></div>
          <p className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto leading-relaxed">
            Conectando talentos em toda cidade
          </p>
        </div>

        {/* Botão de entrada */}
        <div className={`transition-all duration-1000 ${
          showButton ? 'opacity-100 transform translateY-0' : 'opacity-0 transform translateY-8'
        }`}>
          {showButton && !animationStarted && (
            <Button
              onClick={handleEnter}
              size="lg"
              className="mt-12 bg-white text-orange-600 hover:bg-orange-50 font-bold text-lg px-12 py-4 rounded-full shadow-2xl hover:shadow-orange-300/50 transition-all duration-300 hover:scale-105"
            >
              ENTRAR NO ZURBO
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

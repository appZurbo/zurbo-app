
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface WelcomeLandingProps {
  onEnter: () => void;
}

export const WelcomeLanding = ({ onEnter }: WelcomeLandingProps) => {
  const [animationStarted, setAnimationStarted] = useState(false);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    // Mostrar botão após 2 segundos
    const timer = setTimeout(() => {
      setShowButton(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setAnimationStarted(true);
    // Aguardar animação completar antes de chamar onEnter
    setTimeout(() => {
      onEnter();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-orange-500 via-orange-600 to-orange-700 flex items-center justify-center overflow-hidden">
      {/* Elementos decorativos de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-white/5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-40 right-1/3 w-24 h-24 bg-white/5 rounded-full animate-bounce delay-500"></div>
      </div>

      {/* Texto principal */}
      <div className="relative text-center">
        <div className={`transition-all duration-1500 ease-in-out ${
          animationStarted 
            ? 'transform scale-[20] opacity-0 translate-z-0' 
            : 'transform scale-100 opacity-100'
        }`}>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-4 tracking-wider">
            BEM-VINDO
          </h1>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white/90 mb-8 tracking-widest">
            AO ZURBO
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

      {/* Efeito de partículas */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-white/20 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
};

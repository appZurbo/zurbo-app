
import { useState, useEffect } from 'react';

const phrases = [
  "chuveiro queimou",
  "festa de formatura",
  "chave quebrada",
  "ar condicionado parou",
  "vazamento no banheiro",
  "corte de cabelo especial",
  "jardim precisa de cuidado",
  "parede para pintar",
  "roupa para ajustar",
  "unha para fazer",
  "festa para organizar",
  "casa para limpar",
  "porta emperrada",
  "luz que não acende",
  "torneira pingando",
  "gramado crescendo",
  "evento importante",
  "ocasião especial"
];

export const AnimatedPhrases = () => {
  const [visiblePhrases, setVisiblePhrases] = useState<Array<{
    id: number;
    text: string;
    position: number;
    speed: number;
    opacity: number;
  }>>([]);

  useEffect(() => {
    let phraseId = 0;
    
    const addPhrase = () => {
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      const speed = 0.5 + Math.random() * 0.5; // Velocidade entre 0.5 e 1
      const opacity = 0.3 + Math.random() * 0.4; // Opacidade entre 0.3 e 0.7
      
      setVisiblePhrases(prev => [...prev, {
        id: phraseId++,
        text: randomPhrase,
        position: 100, // Começa fora da tela (direita)
        speed,
        opacity
      }]);
    };

    // Adicionar primeira frase imediatamente
    addPhrase();
    
    // Adicionar novas frases em intervalos aleatórios
    const addPhraseInterval = setInterval(() => {
      addPhrase();
    }, 2000 + Math.random() * 3000); // Entre 2 e 5 segundos

    return () => clearInterval(addPhraseInterval);
  }, []);

  useEffect(() => {
    const moveInterval = setInterval(() => {
      setVisiblePhrases(prev => 
        prev
          .map(phrase => ({
            ...phrase,
            position: phrase.position - phrase.speed
          }))
          .filter(phrase => phrase.position > -50) // Remove frases que saíram da tela
      );
    }, 50);

    return () => clearInterval(moveInterval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {visiblePhrases.map(phrase => (
        <div
          key={phrase.id}
          className="absolute text-2xl md:text-3xl font-bold text-white whitespace-nowrap"
          style={{
            left: `${phrase.position}%`,
            top: `${20 + Math.random() * 60}%`, // Posição vertical aleatória
            opacity: phrase.opacity,
            transform: `translateY(-50%) rotate(${-5 + Math.random() * 10}deg)`, // Rotação sutil
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          {phrase.text}
        </div>
      ))}
    </div>
  );
};

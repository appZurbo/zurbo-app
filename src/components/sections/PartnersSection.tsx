
import { InfiniteSlider } from '@/components/ui/infinite-slider';

const PartnersSection = () => {
  const situations = [
    { text: "Chuveiro queimado", emoji: "🚿" },
    { text: "Chave quebrada", emoji: "🔑" },
    { text: "Vazamento na torneira", emoji: "💧" },
    { text: "Lâmpada queimada", emoji: "💡" },
    { text: "Porta emperrada", emoji: "🚪" },
    { text: "Ar condicionado com defeito", emoji: "❄️" },
    { text: "Jardim precisa de cuidados", emoji: "🌱" },
    { text: "Casa precisa de limpeza", emoji: "🧹" },
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Situações do dia a dia que resolvemos
          </h2>
          <p className="text-xl text-gray-600">
            Encontre o profissional certo para qualquer necessidade
          </p>
        </div>
        
        <div className="relative">
          <InfiniteSlider gap={32} reverse className="w-full h-32 bg-white rounded-lg shadow-sm">
            {situations.map((situation, index) => (
              <div
                key={index}
                className="flex flex-col items-center justify-center min-w-[200px] h-[120px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-2">{situation.emoji}</div>
                <div className="text-sm font-medium text-gray-700 text-center px-4">
                  {situation.text}
                </div>
              </div>
            ))}
          </InfiniteSlider>
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;

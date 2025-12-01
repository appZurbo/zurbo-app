import { InfiniteSlider } from '@/components/ui/infinite-slider';

const PartnersSection = () => {
  const situations = [{
    text: "Chuveiro queimado",
    bgPos: "100% 66.66%" // Toilet icon (representing bathroom/plumbing)
  }, {
    text: "Chave quebrada",
    bgPos: "66.66% 0%" // Broken key
  }, {
    text: "Vazamento na torneira",
    bgPos: "100% 0%" // Tap
  }, {
    text: "Lâmpada queimada",
    bgPos: "0% 0%" // Burnt bulb
  }, {
    text: "Porta emperrada",
    bgPos: "33.33% 33.33%" // Door handle
  }, {
    text: "Ar condicionado com defeito",
    bgPos: "66.66% 33.33%" // AC
  }, {
    text: "Jardim precisa de cuidados",
    bgPos: "100% 33.33%" // Plant
  }, {
    text: "Casa precisa de limpeza",
    bgPos: "0% 66.66%" // Mop
  }];

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Situações que pedem zurbo</h2>
          <p className="text-xl text-gray-600">
            Encontre o profissional certo para qualquer necessidade
          </p>
        </div>
        
        <div className="relative">
          <InfiniteSlider gap={32} reverse className="w-full h-32 bg-gray-100 rounded-lg shadow-sm">
            {situations.map((situation, index) => (
              <div key={index} className="flex flex-col items-center justify-center min-w-[200px] h-[140px] bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
                <div 
                  className="w-20 h-14 mb-2 bg-no-repeat"
                  style={{
                    backgroundImage: 'url(/problemicons.png)',
                    backgroundSize: '400% 400%',
                    backgroundPosition: situation.bgPos
                  }}
                  role="img"
                  aria-label={situation.text}
                />
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
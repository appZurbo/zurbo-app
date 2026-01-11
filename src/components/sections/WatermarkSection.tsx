import { useMobileOrTablet } from '@/hooks/useMobile';

const WatermarkSection = () => {
  const isMobileOrTablet = useMobileOrTablet();
  
  // Altura aproximada da dock: ~56px (py-3 + conteúdo + border)
  // No mobile, o logo deve tangenciar a borda superior da dock
  // Usamos um wrapper que se estende até a dock (margin-bottom negativo) e aplica overflow-hidden
  // A section mantém altura normal, mas o wrapper permite que o logo se estenda até a dock
  const bottomOffset = isMobileOrTablet ? '0px' : '-6.5vw';
  
  if (isMobileOrTablet) {
    return (
      <div className="overflow-hidden" style={{ marginBottom: '-56px', paddingBottom: '56px' }}>
        <section className="bg-gray-50 relative h-32">
          {/* Marca d'água "zurbo" */}
          {/* No mobile, o logo começa no bottom da section (0px) e se estende além */}
          {/* O wrapper com overflow-hidden corta o logo na borda superior, que corresponde à borda superior da dock */}
          <div 
            className="absolute left-1/2 transform -translate-x-1/2 text-orange-500 font-extrabold text-[15vw] lowercase select-none z-0"
            style={{ bottom: bottomOffset }}
          >
            zurbo
          </div>
        </section>
      </div>
    );
  }
  
  return (
    <section className="bg-gray-50 relative overflow-hidden h-32">
      {/* Marca d'água "zurbo" */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 text-orange-500 font-extrabold text-[15vw] lowercase select-none z-0"
        style={{ bottom: bottomOffset }}
      >
        zurbo
      </div>
    </section>
  );
};

export default WatermarkSection;

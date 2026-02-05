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
        <section className="bg-[#FDFDFD] relative h-32 flex items-center justify-center">
          {/* Logo Watermark */}
          <img
            src="/newlogo.png"
            alt="Zurbo Watermark"
            className="absolute opacity-[0.03] grayscale pointer-events-none z-0"
            style={{
              width: '80vw',
              bottom: '-10%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          />
        </section>
      </div>
    );
  }

  return (
    <section className="bg-[#FDFDFD] relative overflow-hidden h-40 flex items-center justify-center">
      {/* Logo Watermark */}
      <img
        src="/newlogo.png"
        alt="Zurbo Watermark"
        className="absolute opacity-[0.03] grayscale pointer-events-none z-0"
        style={{
          width: '40vw',
          bottom: '-20%',
          left: '50%',
          transform: 'translateX(-50%)'
        }}
      />
    </section>
  );
};

export default WatermarkSection;

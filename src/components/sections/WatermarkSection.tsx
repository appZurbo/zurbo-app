
const WatermarkSection = () => {
  return (
    <section className="bg-gray-50 relative overflow-hidden h-32">
      {/* Marca d'água "zurbo" */}
      <div 
        className="absolute left-1/2 transform -translate-x-1/2 text-orange-500 font-extrabold text-[15vw] lowercase select-none z-0"
        style={{ bottom: '-6.5vw' }}
      >
        zurbo
      </div>
    </section>
  );
};

export default WatermarkSection;

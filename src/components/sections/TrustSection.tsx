import DieterRamsSwitch from "../ui/DieterRamsSwitch";
import TactileLock from "../ui/TactileLock";
import TactileVault from "../ui/TactileVault";

const TrustSection = () => {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">Trabalhe do seu jeito, <br /> <span className="text-orange-500">com segurança</span></h2>
                    <p className="text-gray-500 max-w-lg mx-auto">Gerencie sua agenda enquanto cuidamos da sua segurança</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Block 1: Connection Control */}
                    <div className="text-center flex flex-col items-center">
                        <DieterRamsSwitch />
                        <h4 className="font-black text-xl mt-4 mb-2 uppercase">Controle Total</h4>
                        <p className="text-sm text-gray-500 px-8">Você escolhe quando se conectar e quando atender. Sem pressão.</p>
                    </div>

                    {/* Block 2: Privacy Control */}
                    <div className="text-center flex flex-col items-center">
                        <div className="w-40 h-40 bg-[#F5F5F5] rounded-[40px] flex items-center justify-center mb-6 border-b-8 border-gray-200 shadow-lg relative overflow-hidden">
                            <div className="scale-75 translate-y-6">
                                <TactileLock />
                            </div>
                        </div>
                        <h4 className="font-black text-xl mb-2 uppercase">Sua Privacidade</h4>
                        <p className="text-sm text-gray-500 px-8">Você controla quem vê seus dados e suas estatísticas de serviço.</p>
                    </div>

                    {/* Block 3: Security / Vault */}
                    <div className="text-center flex flex-col items-center">
                        <div className="w-40 h-40 bg-[#F5F5F5] rounded-[40px] flex items-center justify-center mb-6 border-b-8 border-gray-200 shadow-lg relative overflow-hidden">
                            <div className="scale-75">
                                <TactileVault />
                            </div>
                        </div>
                        <h4 className="font-black text-xl mb-2 uppercase">SEGURANÇA</h4>
                        <p className="text-sm text-gray-500 px-8">Para o Cliente e para o Prestador.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;

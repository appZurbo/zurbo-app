
import { Lock, ShieldCheck } from "lucide-react";

const TrustSection = () => {
    return (
        <section className="py-24 px-6 bg-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">SEUS DADOS ESTÃO <br /> <span className="text-orange-500">EM SUAS MÃOS</span></h2>
                    <p className="text-gray-500 max-w-lg mx-auto">Segurança e privacidade são nossa prioridade máxima.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="text-center flex flex-col items-center">
                        <div className="w-40 h-40 bg-[#FFF1ED] rounded-[40px] flex items-center justify-center mb-6 border-b-8 border-orange-100 shadow-lg">
                            <div className="bg-orange-500 text-white px-4 py-2 rounded-xl font-black text-lg shadow-md">ON</div>
                        </div>
                        <h4 className="font-black text-xl mb-2 uppercase">Controle Total</h4>
                        <p className="text-sm text-gray-500 px-8">Você escolhe quando se conectar e quando atender. Sem pressão.</p>
                    </div>

                    <div className="text-center flex flex-col items-center">
                        <div className="w-40 h-40 bg-[#F9F1FF] rounded-[40px] flex items-center justify-center mb-6 border-b-8 border-purple-100 shadow-lg">
                            <Lock size={48} className="text-purple-500" />
                        </div>
                        <h4 className="font-black text-xl mb-2 uppercase">Sua Privacidade</h4>
                        <p className="text-sm text-gray-500 px-8">Você controla quem vê seus dados e suas estatísticas de serviço.</p>
                    </div>

                    <div className="text-center flex flex-col items-center">
                        <div className="w-40 h-40 bg-[#EEF2FF] rounded-[40px] flex items-center justify-center mb-6 border-b-8 border-blue-100 shadow-lg">
                            <ShieldCheck size={48} className="text-blue-500" />
                        </div>
                        <h4 className="font-black text-xl mb-2 uppercase">Sem Vendas</h4>
                        <p className="text-sm text-gray-500 px-8">Nós não vendemos seus dados para terceiros. O foco é a sua segurança.</p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustSection;

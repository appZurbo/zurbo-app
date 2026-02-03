
import { Clock, Star, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

const BenefitsGrid = () => {
    return (
        <section className="py-24 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <span className="bg-orange-50 text-orange-500 font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-widest border border-orange-100">Benefício para clientes e prestadores</span>
                <h2 className="text-4xl md:text-5xl font-black mt-4 uppercase tracking-tighter leading-none">
                    O QUE A ZURBO FAZ <br /> <span className="text-orange-500">POR VOCÊ</span>
                </h2>
                <p className="text-gray-500 mt-4 font-medium">O controle total de seus agendamentos. Fácil, como pedir comida</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-auto md:h-[650px]">
                {/* Histórico na Mão */}
                <div className="md:col-span-1 md:row-span-2 bg-[#FFF9E6] rounded-[40px] p-8 flex flex-col justify-between overflow-hidden relative group text-left">
                    <div className="relative z-10">
                        <h3 className="font-black text-2xl mb-2 tracking-tight">Histórico <br /> na Mão</h3>
                        <p className="text-sm text-gray-600 font-medium">Sua confiança viaja com você em cada serviço.</p>
                    </div>

                    <div className="relative mt-8 group-hover:scale-105 transition-transform">
                        <div className="bg-white rounded-3xl p-4 shadow-lg border border-yellow-100 w-full rotate-[-5deg]">
                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-bold">Ranking Semanal</span>
                                <Clock size={12} />
                            </div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center border-2 border-yellow-200 overflow-hidden text-gray-900">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Erik" alt="User" />
                                </div>
                                <div>
                                    <p className="font-bold text-xs text-gray-900">Carlos Pintor</p>
                                    <p className="text-[10px] text-gray-400">94/100 Pontos</p>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full w-[90%] bg-yellow-400"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-yellow-400 rounded-full opacity-10"></div>
                </div>

                {/* Motivação */}
                <div className="md:col-span-2 md:row-span-1 bg-[#FFF1ED] rounded-[40px] p-8 flex flex-col md:flex-row gap-8 overflow-hidden group text-left">
                    <div className="flex-1 flex flex-col justify-center">
                        <h3 className="font-black text-2xl mb-2 tracking-tight">Motivação para <br />Melhorar</h3>
                        <p className="text-sm text-gray-600 font-medium">Seus talentos finalmente recebem o crédito que merecem.</p>
                    </div>
                    <div className="flex-1 relative">
                        <motion.div
                            whileHover={{ rotate: 0 }}
                            initial={{ rotate: 3 }}
                            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded-3xl shadow-xl w-48 border border-red-50"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 bg-blue-100 rounded-full overflow-hidden">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sara" alt="User" />
                                </div>
                                <div className="flex-1 h-2 bg-gray-100 rounded-full"></div>
                            </div>
                            <p className="text-[10px] font-bold text-gray-900">"Trabalho incrível!"</p>
                            <div className="flex gap-1 mt-1">
                                {[1, 2, 3, 4, 5].map(i => <Star key={i} size={8} className="text-yellow-400 fill-yellow-400" />)}
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Serviço Recompensado */}
                <div className="md:col-span-1 md:row-span-1 bg-[#F9F1FF] rounded-[40px] p-8 flex flex-col items-center text-center justify-center group">
                    <div className="w-16 h-16 bg-purple-200 rounded-full flex items-center justify-center text-purple-600 mb-4 group-hover:rotate-12 transition-transform">
                        <Star size={32} />
                    </div>
                    <h3 className="font-black text-xl mb-1 tracking-tight">Serviço <br />Recompensado</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Badges e Conquistas</p>
                </div>

                {/* Novas Oportunidades */}
                <div className="md:col-span-1 md:row-span-1 bg-[#EEF2FF] rounded-[40px] p-8 flex flex-col items-center text-center justify-center group">
                    <div className="w-16 h-16 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                        <CheckCircle2 size={32} />
                    </div>
                    <h3 className="font-black text-xl mb-1 tracking-tight">Novas <br />Oportunidades</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-2">Cresça no App</p>
                </div>

                {/* Você no Comando */}
                <div className="md:col-span-2 md:row-span-1 bg-white border-2 border-gray-100 rounded-[40px] p-8 flex flex-col md:flex-row gap-8 items-center overflow-hidden text-left">
                    <div className="flex-1">
                        <h3 className="font-black text-3xl mb-4 uppercase tracking-tighter">VOCÊ NO COMANDO <br /> DO SEU DESTINO</h3>
                        <p className="text-sm text-gray-500 font-medium">A Zurbo torna seu trabalho visível e garante a reputação que você construiu com esforço.</p>
                    </div>
                    <div className="flex-1 relative flex justify-center">
                        <div className="w-48 h-48 bg-orange-500 rounded-full flex items-center justify-center text-white relative shadow-2xl shadow-orange-200">
                            <div className="absolute inset-0 border-8 border-white/20 rounded-full animate-pulse"></div>
                            <div className="text-center">
                                <p className="text-[10px] font-bold uppercase">Nota Geral</p>
                                <p className="text-5xl font-black">9.8</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BenefitsGrid;

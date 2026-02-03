
import { motion } from "framer-motion";
import { Search, Users, ShieldAlert, Zap } from "lucide-react";

const ProblemSection = () => {
    return (
        <section className="bg-[#F2F2F2] py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
                <div className="flex-1 text-left">
                    <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight uppercase">
                        antes da zurbo era difícil <br />
                        encontrar profissionais. <br />
                        <span className="text-orange-500">não é mais.</span>
                    </h2>
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-24 h-24 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-500 mb-8"
                    >
                        <Search size={40} />
                    </motion.div>
                </div>
                <div className="flex-1 space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-white p-6 rounded-[32px] border border-gray-200 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-shadow text-left"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all text-gray-400 group-hover:text-blue-500">
                            <Users size={32} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg mb-1 uppercase tracking-tighter leading-tight">Depender de indicação de conhecidos ou perder horas em grupos de mensagens não é prático.</h3>
                            <p className="text-sm text-gray-500">Na Zurbo, você encontra o profissional ideal em instantes!</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-[32px] border border-gray-200 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-shadow ml-0 md:ml-8 text-left"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all text-gray-400 group-hover:text-orange-500">
                            <ShieldAlert size={32} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg mb-1 uppercase tracking-tighter leading-tight">Você nunca sabe quem está entrando na sua casa.</h3>
                            <p className="text-sm text-gray-500">Transformamos o risco da informalidade na segurança de um serviço profissional.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="bg-white p-6 rounded-[32px] border border-gray-200 flex flex-col md:flex-row items-center gap-6 group hover:shadow-xl transition-shadow text-left"
                    >
                        <div className="w-24 h-24 bg-gray-100 rounded-2xl flex-shrink-0 flex items-center justify-center grayscale group-hover:grayscale-0 transition-all text-gray-400 group-hover:text-yellow-500">
                            <Zap size={32} />
                        </div>
                        <div>
                            <h3 className="font-black text-lg mb-1 uppercase tracking-tighter leading-tight">Menos tempo procurando, mais tempo consertando.</h3>
                            <p className="text-sm text-gray-500">O fim do caos em momentos de urgência.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default ProblemSection;

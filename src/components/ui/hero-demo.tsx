
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MoveRight,
  Wrench,
  Search,
  Briefcase,
  Star,
  MapPin
} from "lucide-react";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

const buttonVariants = cva("inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      orange: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-100",
      white: "bg-white border-2 border-gray-100 font-bold shadow-sm hover:border-orange-500 hover:text-orange-500 transition-all"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      xl: "h-14 px-8 rounded-2xl",
      icon: "h-10 w-10"
    }
  },
  defaultVariants: {
    variant: "default",
    size: "default"
  }
});

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  className,
  variant,
  size,
  asChild = false,
  ...props
}, ref) => {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({
    variant,
    size,
    className
  }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const navigate = useNavigate();
  const titles = useMemo(() => ["eletricista?", "encanador?", "pintor?", "jardineiro?", "diarista?"], []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [titles.length]);

  const handleContrateServicos = () => {
    navigate('/prestadores');
  };

  const handleTrabalheConosco = () => {
    navigate('/trabalhe-conosco');
  };

  return (
    <section className="relative px-6 pt-12 pb-24 max-w-7xl mx-auto text-center overflow-hidden">
      {/* Headline Animado */}
      <h1 className="text-5xl md:text-7xl tracking-tighter font-black mb-10 flex flex-col items-center uppercase leading-tight">
        <span className="text-gray-900">Tá precisando de</span>
        <span className="relative flex w-full justify-center overflow-hidden h-[1.2em] md:pb-4 md:pt-1">
          <AnimatePresence mode="wait">
            <motion.span
              key={titleNumber}
              className="absolute font-black text-orange-500 whitespace-nowrap"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -100, opacity: 0 }}
              transition={{ duration: 0.7, ease: "easeInOut" }}
            >
              {titles[titleNumber]}
            </motion.span>
          </AnimatePresence>
        </span>
      </h1>

      <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10 font-medium">
        A Zurbo facilita o controle e manutenção de seu lar.
        Combine e contrate profissionais, rápido e com segurança.
      </p>

      {/* Botões de Ação */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
        <Button
          variant="orange"
          size="xl"
          className="gap-2 hover:scale-105 transition-all w-full sm:w-auto font-bold"
          onClick={handleContrateServicos}
        >
          <Search size={20} strokeWidth={3} /> Contrate Serviços
        </Button>
        <Button
          variant="white"
          size="xl"
          className="gap-2 hover:scale-105 transition-all w-full sm:w-auto font-bold"
          onClick={handleTrabalheConosco}
        >
          <Briefcase size={20} strokeWidth={2} /> Trabalhe Conosco
        </Button>
      </div>

      {/* Mockup Central de Celular */}
      <div className="relative mx-auto w-full max-w-[320px] md:max-w-[800px]">
        {/* Formas abstratas de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] opacity-20 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-300 rounded-full blur-3xl"></div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-center gap-8 relative z-10">
          {/* Card Esquerda - Chaveiro */}
          <motion.div
            initial={{ opacity: 0, x: -50, rotate: -10 }}
            animate={{ opacity: 1, x: 0, rotate: -3 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="hidden md:block w-64 bg-white p-4 rounded-3xl shadow-xl border border-gray-100 text-left"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <Wrench size={20} />
              </div>
              <div>
                <p className="font-bold text-sm">Chaveiro</p>
                <p className="text-xs text-gray-400">disponível agora</p>
              </div>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full w-[85%] bg-blue-500"></div>
            </div>
          </motion.div>

          {/* Celular */}
          <div className="w-[280px] h-[580px] bg-black rounded-[50px] border-[8px] border-gray-900 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20"></div>
            <div className="bg-[#FBF7F2] h-full w-full p-4 pt-10 overflow-y-auto no-scrollbar text-left font-sans">
              <div className="mb-4">
                <h2 className="text-xl font-bold text-gray-900 leading-tight">Prestadores</h2>
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={10} />
                  <span>Sinop, Mato Grosso</span>
                </div>
              </div>

              <div className="bg-white border rounded-xl p-2 flex items-center gap-2 mb-4 shadow-sm">
                <Search size={14} className="text-gray-400" />
                <span className="text-xs text-gray-400">Buscar eletricista...</span>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">Tudo</div>
                <div className="bg-white border text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">Elétrica</div>
                <div className="bg-white border text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold whitespace-nowrap">Limpeza</div>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                  <div className="flex gap-3 items-center mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos" alt="Pro" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-xs font-bold leading-none truncate">Carlos Silva</h3>
                      <p className="text-[10px] text-gray-400 truncate">Eletricista Residencial</p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-bold">4.9</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <div className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-[8px] font-bold">Verificado</div>
                    <div className="bg-orange-100 text-orange-600 px-2 py-0.5 rounded text-[8px] font-bold">Premium</div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm opacity-60">
                  <div className="flex gap-3 items-center mb-2">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" alt="Pro" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="text-xs font-bold leading-none truncate">Ana Oliveira</h3>
                      <p className="text-[10px] text-gray-400 truncate">Diarista</p>
                    </div>
                    <div className="flex items-center gap-0.5 flex-shrink-0">
                      <Star size={10} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-[10px] font-bold">4.8</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card Direita - Review */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotate: 10 }}
            animate={{ opacity: 1, x: 0, rotate: 3 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="hidden md:block w-64 bg-white p-4 rounded-3xl shadow-xl border border-gray-100 text-left mt-12"
          >
            <div className="flex items-center gap-2 mb-4">
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
              <Star className="text-yellow-400 fill-yellow-400" size={16} />
            </div>
            <p className="font-bold text-sm mb-1 text-gray-900">"Serviço impecável"</p>
            <p className="text-xs text-gray-400 italic">"O pintor Carlos foi super atencioso e o app facilitou tudo."</p>
          </motion.div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  );
}

function HeroDemo() {
  return (
    <div className="flex text-center items-center justify-center w-full">
      <Hero />
    </div>
  );
}

export default HeroDemo;

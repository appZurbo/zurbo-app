
import { useEffect, useMemo, useState, useRef } from "react";
import { motion } from "framer-motion";
import { MoveRight, Wrench } from "lucide-react";
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
      link: "text-primary underline-offset-4 hover:underline"
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
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
  const titles = useMemo(() => ["eletricista", "encanador", "pintor", "jardineiro", "diarista"], []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStarted, setVideoStarted] = useState(false);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  // Controlar o vídeo: mostrar último frame e iniciar após 2 segundos
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      // Ir para o último frame (praticamente o fim do vídeo)
      video.currentTime = video.duration - 0.1;
      video.pause();
    };

    const startVideoAfterDelay = setTimeout(() => {
      if (video && !videoStarted) {
        // Voltar para o início e iniciar reprodução
        video.currentTime = 0;
        video.play().catch(() => {
          // Ignorar erros de autoplay se o navegador bloquear
        });
        setVideoStarted(true);
      }
    }, 2000);

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    
    // Quando o vídeo terminar, manter no último frame
    const handleEnded = () => {
      video.currentTime = video.duration - 0.1;
      video.pause();
    };

    video.addEventListener('ended', handleEnded);

    // Se os metadados já foram carregados
    if (video.readyState >= 2) {
      handleLoadedMetadata();
    }

    return () => {
      clearTimeout(startVideoAfterDelay);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
    };
  }, [videoStarted]);
  
  const handleContrateServicos = () => {
    navigate('/prestadores');
  };

  const handleTrabalheConosco = () => {
    navigate('/trabalhe-conosco');
  };
  
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-4 lg:gap-6 py-20 items-center lg:py-[79px]">
          {/* Conteúdo à esquerda */}
          <div className="flex gap-4 flex-col items-center lg:items-start text-center lg:text-left">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter font-regular">
              <span className="text-gray-900">Tá precisando de</span>
              <span className="relative flex w-full justify-center lg:justify-start overflow-hidden md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span 
                    key={index} 
                    className="absolute font-semibold text-orange-500" 
                    initial={{
                      opacity: 0,
                      y: "-100"
                    }} 
                    transition={{
                      type: "spring",
                      stiffness: 50
                    }} 
                    animate={titleNumber === index ? {
                      y: 0,
                      opacity: 1
                    } : {
                      y: titleNumber > index ? -150 : 150,
                      opacity: 0
                    }}
                  >
                    {title}?
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl">
              Conecte-se com prestadores de serviços qualificados na sua região. Rápido, prático e de confiança.
            </p>
            
            <div className="flex flex-col gap-3 items-center lg:items-start mt-4">
              <Button size="lg" className="gap-4" variant="outline" onClick={handleContrateServicos}>
                Contrate Serviços <Wrench className="w-4 h-4" />
              </Button>
              <Button size="lg" className="gap-4 bg-orange-500 hover:bg-orange-600" onClick={handleTrabalheConosco}>
                Trabalhe conosco <MoveRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Vídeo à direita */}
          <div className="flex items-center justify-center lg:justify-start">
            <video
              ref={videoRef}
              muted
              playsInline
              preload="metadata"
              className="w-full max-w-sm lg:max-w-md h-auto object-contain rounded-lg shadow-lg"
            >
              <source src="/Logo_Animation_Request_For_Zurbo_App.mp4" type="video/mp4" />
              {/* Fallback para imagem caso o vídeo não carregue */}
              <img 
                src="/logoinv.png"
                alt="Zurbo Logo"
                className="w-full max-w-sm lg:max-w-md h-auto object-contain"
              />
            </video>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroDemo() {
  return (
    <div className="flex text-center items-center justify-center">
      <Hero />
    </div>
  );
}

export default HeroDemo;

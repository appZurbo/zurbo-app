
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Star, Users, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HeroDemo() {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-orange-50 py-12 sm:py-16 lg:py-20">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23f97316\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"2\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex">
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 px-4 py-2 text-sm font-medium">
              <Star className="mr-2 h-4 w-4" />
              Mais de 1000 prestadores ativos
            </Badge>
          </div>

          {/* Heading */}
          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
            Encontre o{" "}
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              profissional ideal
            </span>{" "}
            para suas necessidades
          </h1>

          {/* Subheading */}
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            Conectamos você aos melhores prestadores de serviços da sua região. 
            Eletricistas, encanadores, faxineiras e muito mais, todos verificados e avaliados.
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => navigate('/prestadores')}
            >
              Encontrar Prestadores
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            
            <Button 
              size="lg" 
              variant="outline" 
              className="border-2 border-orange-500 text-orange-500 hover:bg-orange-50 px-8 py-3 text-lg font-semibold rounded-xl transition-all duration-200"
              onClick={() => navigate('/trabalhe-conosco')}
            >
              Trabalhe Conosco
              <Users className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-16">
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <Users className="h-6 w-6 text-orange-600" />
              </div>
              <dt className="mt-4 text-base font-medium text-gray-900">1000+ Prestadores</dt>
              <dd className="mt-1 text-sm text-gray-600">Profissionais verificados</dd>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <Star className="h-6 w-6 text-orange-600" />
              </div>
              <dt className="mt-4 text-base font-medium text-gray-900">4.8/5 Estrelas</dt>
              <dd className="mt-1 text-sm text-gray-600">Avaliação média</dd>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <CheckCircle className="h-6 w-6 text-orange-600" />
              </div>
              <dt className="mt-4 text-base font-medium text-gray-900">50k+ Serviços</dt>
              <dd className="mt-1 text-sm text-gray-600">Realizados com sucesso</dd>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


import { BannerImageUploader } from '@/components/admin/BannerImageUploader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Image } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const BannerImageManager = () => {
  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Link to="/admin">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Voltar
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Image className="h-8 w-8" />
            Gerenciador de Imagens dos Banners
          </h1>
          <p className="text-muted-foreground">
            Gerencie as imagens 3D que aparecem nos banners da página inicial
          </p>
        </div>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Instruções</CardTitle>
            <CardDescription>
              Como usar o gerenciador de imagens dos banners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold">📋 Formatos Aceitos:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>PNG (recomendado para transparência)</li>
                  <li>JPG/JPEG</li>
                  <li>Máximo 5MB por arquivo</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold">🎨 Especificações:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Resolução recomendada: 512x512px+</li>
                  <li>Fundo transparente (PNG)</li>
                  <li>Representar categorias de serviços</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <BannerImageUploader />
      </div>
    </div>
  );
};

export default BannerImageManager;

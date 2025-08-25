
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { serviceCategories } from '@/config/serviceCategories';

interface UploadStatus {
  [key: string]: 'pending' | 'uploading' | 'success' | 'error';
}

export const ImageUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({});
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File}>({});

  const requiredImages = [
    'limpeza.png',
    'chaveiro.png', 
    'eletricista.png',
    'beleza.png',
    'construcao.png',
    'jardinagem.png',
    'frete.png',
    'tecnicoinformatica.png',
    'cuidados.png',
    'refrigeracao.png',
    'mecanico.png'
  ];

  const handleFileSelect = (imageName: string, file: File) => {
    setSelectedFiles(prev => ({
      ...prev,
      [imageName]: file
    }));
  };

  const uploadImage = async (imageName: string, file: File) => {
    setUploadStatus(prev => ({ ...prev, [imageName]: 'uploading' }));
    
    try {
      const { error } = await supabase.storage
        .from('site-images')
        .upload(imageName, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) {
        console.error(`Error uploading ${imageName}:`, error);
        setUploadStatus(prev => ({ ...prev, [imageName]: 'error' }));
        return false;
      }

      setUploadStatus(prev => ({ ...prev, [imageName]: 'success' }));
      return true;
    } catch (error) {
      console.error(`Error uploading ${imageName}:`, error);
      setUploadStatus(prev => ({ ...prev, [imageName]: 'error' }));
      return false;
    }
  };

  const uploadAllSelected = async () => {
    const uploads = Object.entries(selectedFiles).map(([imageName, file]) => 
      uploadImage(imageName, file)
    );
    
    await Promise.all(uploads);
  };

  const getStatusIcon = (imageName: string) => {
    const status = uploadStatus[imageName];
    switch (status) {
      case 'uploading':
        return <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />;
      case 'success':
        return <Check className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Upload className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Upload de Imagens das Categorias</CardTitle>
        <p className="text-sm text-muted-foreground">
          Faça upload das imagens necessárias para as categorias de serviço
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requiredImages.map((imageName) => (
            <div key={imageName} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{imageName}</span>
                {getStatusIcon(imageName)}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(imageName, file);
                  }
                }}
                className="w-full text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              
              {selectedFiles[imageName] && (
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => uploadImage(imageName, selectedFiles[imageName])}
                  disabled={uploadStatus[imageName] === 'uploading'}
                >
                  {uploadStatus[imageName] === 'uploading' ? 'Enviando...' : 'Enviar'}
                </Button>
              )}
            </div>
          ))}
        </div>
        
        {Object.keys(selectedFiles).length > 0 && (
          <div className="mt-6 pt-4 border-t">
            <Button
              onClick={uploadAllSelected}
              className="w-full"
              disabled={Object.values(uploadStatus).some(status => status === 'uploading')}
            >
              Enviar Todas as Imagens Selecionadas
            </Button>
          </div>
        )}

        <div className="mt-4 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-medium mb-2">Instruções:</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Selecione as imagens correspondentes a cada categoria</li>
            <li>• Use imagens em formato PNG, JPG ou WEBP</li>
            <li>• Recomenda-se imagens quadradas (1:1) para melhor visualização</li>
            <li>• Tamanho ideal: 200x200px ou similar</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

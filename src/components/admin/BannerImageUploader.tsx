
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { bannerImages } from '@/components/banners/BannerImages';

interface UploadStatus {
  [key: string]: 'pending' | 'uploading' | 'success' | 'error';
}

export const BannerImageUploader = () => {
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>({});
  const [selectedFiles, setSelectedFiles] = useState<{[key: string]: File}>({});

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
        .from('banner-images')
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
        <CardTitle>Upload de Imagens dos Banners</CardTitle>
        <p className="text-sm text-muted-foreground">
          Faça upload das imagens 3D para os banners da home page
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bannerImages.map((imageInfo) => (
            <div key={imageInfo.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <span className="text-sm font-medium">{imageInfo.name}</span>
                  <p className="text-xs text-muted-foreground">{imageInfo.category}</p>
                </div>
                {getStatusIcon(imageInfo.name)}
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleFileSelect(imageInfo.name, file);
                  }
                }}
                className="w-full text-sm file:mr-2 file:py-1 file:px-2 file:rounded file:border-0 file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
              />
              
              {selectedFiles[imageInfo.name] && (
                <Button
                  size="sm"
                  className="w-full mt-2"
                  onClick={() => uploadImage(imageInfo.name, selectedFiles[imageInfo.name])}
                  disabled={uploadStatus[imageInfo.name] === 'uploading'}
                >
                  {uploadStatus[imageInfo.name] === 'uploading' ? 'Enviando...' : 'Enviar'}
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
            <li>• Use as imagens 3D fornecidas para cada categoria</li>
            <li>• Mantenha o fundo transparente das imagens</li>
            <li>• Formato recomendado: PNG com transparência</li>
            <li>• Resolução ideal: 400x400px ou similar</li>
            <li>• As imagens aparecerão nos banners da home page</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

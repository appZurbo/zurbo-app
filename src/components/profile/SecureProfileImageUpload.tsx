
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Camera, Upload, AlertTriangle, Shield } from 'lucide-react';
import { FileValidator } from '@/utils/fileValidator';
import { securityLogger } from '@/utils/securityLogger';
import { useAuth } from '@/hooks/useAuth';

interface SecureProfileImageUploadProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

const SecureProfileImageUpload = ({ onImageUploaded, currentImageUrl }: SecureProfileImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [validationWarnings, setValidationWarnings] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { profile } = useAuth();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setValidationErrors([]);
    setValidationWarnings([]);

    // Validação básica do arquivo
    const basicValidation = FileValidator.validateImage(file);
    if (!basicValidation.isValid) {
      setValidationErrors(basicValidation.errors);
      if (profile?.id) {
        await securityLogger.logSuspiciousActivity(
          `Invalid file upload attempt: ${basicValidation.errors.join(', ')}`
        );
      }
      return;
    }

    // Validação de conteúdo
    const contentValidation = await FileValidator.validateFileContent(file);
    if (contentValidation.warnings.length > 0) {
      setValidationWarnings(contentValidation.warnings);
    }

    // Log do upload
    if (profile?.id) {
      await securityLogger.logFileUpload(
        profile.id,
        file.name,
        file.size,
        file.type
      );
    }

    await uploadImage(file);
  };

  const uploadImage = async (file: File) => {
    if (!profile?.id) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      // Aqui você implementaria o upload real para o Supabase Storage
      // Por enquanto, vamos simular o upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        onImageUploaded(imageUrl);
        
        toast({
          title: "Imagem carregada!",
          description: "Sua foto de perfil foi atualizada com sucesso.",
        });
      };
      reader.readAsDataURL(file);

    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Ocorreu um erro ao fazer upload da imagem",
        variant: "destructive",
      });

      if (profile?.id) {
        await securityLogger.logSuspiciousActivity(
          `File upload failed: ${error.message}`
        );
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <Shield className="h-4 w-4" />
        Upload seguro habilitado
      </div>

      {validationErrors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">Erros de validação:</span>
          </div>
          <ul className="text-sm text-red-600 space-y-1">
            {validationErrors.map((error, index) => (
              <li key={index}>• {error}</li>
            ))}
          </ul>
        </div>
      )}

      {validationWarnings.length > 0 && (
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium text-yellow-700">Avisos:</span>
          </div>
          <ul className="text-sm text-yellow-600 space-y-1">
            {validationWarnings.map((warning, index) => (
              <li key={index}>• {warning}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex gap-2">
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          {currentImageUrl ? 'Trocar Foto' : 'Adicionar Foto'}
        </Button>

        {uploading && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Upload className="h-4 w-4 animate-spin" />
            Fazendo upload...
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="text-xs text-gray-500 space-y-1">
        <p>• Formatos aceitos: JPEG, PNG, GIF, WebP</p>
        <p>• Tamanho máximo: 10MB</p>
        <p>• A imagem será validada automaticamente</p>
      </div>
    </div>
  );
};

export default SecureProfileImageUpload;


import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera } from 'lucide-react';
import { useProfilePicture } from '@/hooks/useProfilePicture';
import { useToast } from '@/hooks/use-toast';

interface ProfileImageUploadProps {
  profileImage?: string;
  userName: string;
  uploading?: boolean;
}

export const ProfileImageUpload = ({ profileImage, userName, uploading }: ProfileImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { uploadProfilePicture } = useProfilePicture();
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('File selected:', file.name, file.type, file.size);

    // Validar tipo e tamanho do arquivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Arquivo inválido",
        description: "Por favor, selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB
      toast({
        title: "Arquivo muito grande",
        description: "A imagem deve ter menos de 5MB.",
        variant: "destructive",
      });
      return;
    }

    console.log('Starting profile picture upload...');
    const result = await uploadProfilePicture(file);
    
    if (result) {
      console.log('Profile picture upload successful:', result);
      // Não recarregar a página - o estado será atualizado automaticamente
      toast({
        title: "Sucesso!",
        description: "Recarregue a página para ver a nova foto",
      });
    }

    // Limpar o input para permitir re-upload do mesmo arquivo
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative">
      <Avatar className="w-24 h-24">
        <AvatarImage src={profileImage} alt={userName} />
        <AvatarFallback className="text-xl">
          {userName?.charAt(0) || '?'}
        </AvatarFallback>
      </Avatar>
      <Button
        size="sm"
        variant="outline"
        className="absolute -bottom-2 -right-2 rounded-full p-2"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
      >
        <Camera className="h-3 w-3" />
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

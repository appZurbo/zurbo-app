
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '@/utils/database';

export const useProfilePicture = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { profile, updateLocalProfile } = useAuth();

  const uploadProfilePicture = async (file: File) => {
    if (!profile) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    try {
      console.log('Starting upload for user:', profile.id);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;

      // Upload da imagem
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw uploadError;
      }

      console.log('File uploaded successfully');

      // Obter URL pública
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      console.log('Public URL generated:', data.publicUrl);

      // Atualizar perfil do usuário no banco
      const updatedProfile = await updateUserProfile(profile.id, { 
        foto_perfil: data.publicUrl 
      });

      if (updatedProfile) {
        // Atualizar o estado local
        updateLocalProfile({ foto_perfil: data.publicUrl });
        console.log('Profile updated with new photo URL');
      }

      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso",
      });

      return data.publicUrl;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message || "Erro desconhecido no upload",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadProfilePicture, uploading };
};

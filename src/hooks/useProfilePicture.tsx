
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { updateUserProfile } from '@/utils/database';

export const useProfilePicture = () => {
  const [uploading, setUploading] = useState(false);
  const { profile, user, updateLocalProfile } = useAuth();

  const uploadProfilePicture = async (file: File) => {
    if (!profile || !user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado",
        variant: "destructive",
      });
      return null;
    }

    setUploading(true);
    try {
      console.log('Starting upload for user:', user.id);
      
      const fileExt = file.name.split('.').pop();
      // Use auth.uid() (user.id) for the folder name to match RLS policy
      const fileName = `${user.id}/avatar.${fileExt}`;

      console.log('Uploading to path:', fileName);

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

      // Atualizar perfil do usuário no banco usando profile.id (UUID da tabela users)
      const updatedProfile = await updateUserProfile(profile.id, { 
        foto_url: data.publicUrl 
      });

      if (updatedProfile) {
        // Atualizar o estado local
        updateLocalProfile({ foto_url: data.publicUrl });
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

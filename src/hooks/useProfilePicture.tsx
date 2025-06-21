
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

export const useProfilePicture = () => {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}/avatar.${fileExt}`;

      // Upload da imagem
      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      // Atualizar perfil do usuário
      const { error: updateError } = await supabase
        .from('users')
        .update({ foto_perfil: data.publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;

      toast({
        title: "Sucesso!",
        description: "Foto de perfil atualizada com sucesso",
      });

      return data.publicUrl;
    } catch (error: any) {
      console.error('Erro no upload:', error);
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { uploadProfilePicture, uploading };
};

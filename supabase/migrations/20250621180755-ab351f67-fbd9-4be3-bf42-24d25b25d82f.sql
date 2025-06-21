
-- Criar tabela de comentários/avaliações
CREATE TABLE IF NOT EXISTS public.comentarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  avaliado_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  comentario TEXT NOT NULL,
  avaliacao INTEGER CHECK (avaliacao >= 1 AND avaliacao <= 5),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS para comentários
ALTER TABLE public.comentarios ENABLE ROW LEVEL SECURITY;

-- Políticas para comentários
CREATE POLICY "Usuários podem criar comentários" 
  ON public.comentarios 
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = avaliador_id));

CREATE POLICY "Usuários podem ver comentários sobre si" 
  ON public.comentarios 
  FOR SELECT 
  USING (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = avaliado_id));

CREATE POLICY "Público pode ver comentários de prestadores" 
  ON public.comentarios 
  FOR SELECT 
  USING (avaliado_id IN (SELECT id FROM public.users WHERE tipo = 'prestador'));

-- Criar bucket para fotos de perfil se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'profile-pictures', 
  'profile-pictures', 
  true, 
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Política para upload de fotos
CREATE POLICY "Users can upload their own profile pictures"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'profile-pictures' AND auth.role() = 'authenticated');

CREATE POLICY "Profile pictures are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'profile-pictures');

CREATE POLICY "Users can update their own profile pictures"
ON storage.objects FOR UPDATE
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own profile pictures"
ON storage.objects FOR DELETE
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

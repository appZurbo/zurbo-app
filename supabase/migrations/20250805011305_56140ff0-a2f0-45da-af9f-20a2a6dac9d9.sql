-- Criar bucket para imagens do site
INSERT INTO storage.buckets (id, name, public) 
VALUES ('site-images', 'site-images', true);

-- Criar políticas para permitir acesso total às imagens do site
CREATE POLICY "Site images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'site-images');

CREATE POLICY "Anyone can upload site images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'site-images');

CREATE POLICY "Anyone can update site images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'site-images');

CREATE POLICY "Anyone can delete site images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'site-images');
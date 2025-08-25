
-- Criar bucket para imagens dos banners
INSERT INTO storage.buckets (id, name, public)
VALUES ('banner-images', 'banner-images', true);

-- Criar política para permitir acesso público de leitura
CREATE POLICY "Public Access for banner images" ON storage.objects
FOR SELECT USING (bucket_id = 'banner-images');

-- Criar política para permitir upload (para admins)
CREATE POLICY "Admin upload banner images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'banner-images');

-- Criar política para permitir atualização (para admins)  
CREATE POLICY "Admin update banner images" ON storage.objects
FOR UPDATE USING (bucket_id = 'banner-images');

-- Criar política para permitir exclusão (para admins)
CREATE POLICY "Admin delete banner images" ON storage.objects
FOR DELETE USING (bucket_id = 'banner-images');

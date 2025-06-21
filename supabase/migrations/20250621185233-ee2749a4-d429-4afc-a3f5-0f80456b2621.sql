
-- Criar bucket para fotos de perfil (se não existir)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket de fotos
DROP POLICY IF EXISTS "Qualquer um pode ver fotos de perfil" ON storage.objects;
CREATE POLICY "Qualquer um pode ver fotos de perfil" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'profile-pictures');

DROP POLICY IF EXISTS "Usuários podem fazer upload de suas fotos" ON storage.objects;
CREATE POLICY "Usuários podem fazer upload de suas fotos" 
ON storage.objects FOR INSERT 
WITH CHECK (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Usuários podem atualizar suas fotos" ON storage.objects;
CREATE POLICY "Usuários podem atualizar suas fotos" 
ON storage.objects FOR UPDATE 
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "Usuários podem deletar suas fotos" ON storage.objects;
CREATE POLICY "Usuários podem deletar suas fotos" 
ON storage.objects FOR DELETE 
USING (bucket_id = 'profile-pictures' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Habilitar RLS nas tabelas (apenas se não estiver habilitado)
DO $$ 
BEGIN
    -- Verificar e habilitar RLS para users
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE n.nspname = 'public' AND c.relname = 'users' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE users ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Verificar e habilitar RLS para comentarios
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE n.nspname = 'public' AND c.relname = 'comentarios' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE comentarios ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Verificar e habilitar RLS para servicos_prestados
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE n.nspname = 'public' AND c.relname = 'servicos_prestados' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE servicos_prestados ENABLE ROW LEVEL SECURITY;
    END IF;
    
    -- Verificar e habilitar RLS para pagamentos_pix
    IF NOT EXISTS (
        SELECT 1 FROM pg_class c 
        JOIN pg_namespace n ON n.oid = c.relnamespace 
        WHERE n.nspname = 'public' AND c.relname = 'pagamentos_pix' AND c.relrowsecurity = true
    ) THEN
        ALTER TABLE pagamentos_pix ENABLE ROW LEVEL SECURITY;
    END IF;
END $$;

-- Políticas RLS para users
DROP POLICY IF EXISTS "Usuários podem ver todos os perfis" ON users;
CREATE POLICY "Usuários podem ver todos os perfis" 
ON users FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON users;
CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
ON users FOR UPDATE 
USING (auth.uid() = auth_id);

DROP POLICY IF EXISTS "Usuários podem inserir seu próprio perfil" ON users;
CREATE POLICY "Usuários podem inserir seu próprio perfil" 
ON users FOR INSERT 
WITH CHECK (auth.uid() = auth_id);

-- Políticas RLS para comentarios
DROP POLICY IF EXISTS "Qualquer um pode ver comentários" ON comentarios;
CREATE POLICY "Qualquer um pode ver comentários" 
ON comentarios FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Usuários autenticados podem criar comentários" ON comentarios;
CREATE POLICY "Usuários autenticados podem criar comentários" 
ON comentarios FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND avaliador_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Políticas RLS para servicos_prestados
DROP POLICY IF EXISTS "Qualquer um pode ver serviços" ON servicos_prestados;
CREATE POLICY "Qualquer um pode ver serviços" 
ON servicos_prestados FOR SELECT 
USING (true);

DROP POLICY IF EXISTS "Prestadores podem gerenciar seus serviços" ON servicos_prestados;
CREATE POLICY "Prestadores podem gerenciar seus serviços" 
ON servicos_prestados FOR ALL 
USING (prestador_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Políticas RLS para pagamentos_pix
DROP POLICY IF EXISTS "Usuários podem ver seus pagamentos" ON pagamentos_pix;
CREATE POLICY "Usuários podem ver seus pagamentos" 
ON pagamentos_pix FOR SELECT 
USING (solicitante_id IN (SELECT id FROM users WHERE auth_id = auth.uid()) 
       OR prestador_id IN (SELECT id FROM users WHERE auth_id = auth.uid()));

-- Trigger para criar usuário automaticamente quando alguém se registra
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, nome, tipo)
  VALUES (
    new.id, 
    new.email,
    COALESCE(new.raw_user_meta_data->>'nome', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'tipo', 'cliente')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger que executa a função quando um usuário é criado
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

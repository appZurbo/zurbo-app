
-- RESET COMPLETO: Primeiro limpar tudo
DROP TABLE IF EXISTS public.comentarios CASCADE;
DROP TABLE IF EXISTS public.pagamentos_pix CASCADE;
DROP TABLE IF EXISTS public.servicos_prestados CASCADE;
DROP TABLE IF EXISTS public.portfolio_fotos CASCADE;
DROP TABLE IF EXISTS public.prestador_servicos CASCADE;
DROP TABLE IF EXISTS public.avaliacoes CASCADE;
DROP TABLE IF EXISTS public.servicos CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Remover triggers e funções existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.atualizar_nota_media() CASCADE;

-- Criar nova tabela de usuários modernizada
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  cpf TEXT UNIQUE,
  tipo TEXT NOT NULL CHECK (tipo IN ('cliente', 'prestador')),
  foto_url TEXT,
  bio TEXT,
  nota_media DECIMAL(2,1) DEFAULT 0.0,
  endereco_cidade TEXT,
  premium BOOLEAN DEFAULT false,
  ocultar_nota BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de serviços
CREATE TABLE public.servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  icone TEXT,
  ativo BOOLEAN DEFAULT true,
  cor TEXT DEFAULT '#f97316'
);

-- Criar tabela de fotos do portfólio
CREATE TABLE public.portfolio_fotos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  foto_url TEXT NOT NULL,
  titulo TEXT,
  descricao TEXT,
  ordem INTEGER DEFAULT 0,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de avaliações modernizada
CREATE TABLE public.avaliacoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  avaliador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  avaliado_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  nota INTEGER CHECK (nota >= 1 AND nota <= 5),
  comentario TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(avaliador_id, avaliado_id)
);

-- Criar tabela de serviços do prestador
CREATE TABLE public.prestador_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  servico_id UUID REFERENCES public.servicos(id) ON DELETE CASCADE,
  preco_min DECIMAL(10,2),
  preco_max DECIMAL(10,2),
  UNIQUE(prestador_id, servico_id)
);

-- Inserir serviços padrão
INSERT INTO public.servicos (nome, icone) VALUES
('Limpeza', 'Sparkles'),
('Jardinagem', 'Flower'),
('Pintura', 'Paintbrush'),
('Elétrica', 'Zap'),
('Encanamento', 'Droplets'),
('Mudança', 'Truck'),
('Cozinha', 'ChefHat'),
('Construção', 'Hammer'),
('Beleza', 'Scissors'),
('Pet Care', 'Heart');

-- Funções primeiro
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (auth_id, email, nome, tipo)
  VALUES (
    NEW.id, 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nome', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'tipo', 'cliente')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION public.atualizar_nota_media()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.users 
  SET nota_media = (
    SELECT COALESCE(AVG(nota), 0)
    FROM public.avaliacoes 
    WHERE avaliado_id = COALESCE(NEW.avaliado_id, OLD.avaliado_id)
  )
  WHERE id = COALESCE(NEW.avaliado_id, OLD.avaliado_id);
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER trigger_atualizar_nota_media
  AFTER INSERT OR UPDATE OR DELETE ON public.avaliacoes
  FOR EACH ROW 
  EXECUTE FUNCTION public.atualizar_nota_media();

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_fotos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.prestador_servicos ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para users
CREATE POLICY "Usuários podem ver próprio perfil" ON public.users
  FOR SELECT USING (auth.uid() = auth_id);

CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.users
  FOR UPDATE USING (auth.uid() = auth_id);

CREATE POLICY "Público pode ver prestadores" ON public.users
  FOR SELECT USING (tipo = 'prestador');

CREATE POLICY "Usuários podem criar perfil" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Políticas para portfólio
CREATE POLICY "Prestadores podem gerenciar próprias fotos" ON public.portfolio_fotos
  FOR ALL USING (prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Público pode ver fotos de portfólio" ON public.portfolio_fotos
  FOR SELECT USING (true);

-- Políticas para avaliações
CREATE POLICY "Usuários podem criar avaliações" ON public.avaliacoes
  FOR INSERT WITH CHECK (auth.uid() IN (SELECT auth_id FROM public.users WHERE id = avaliador_id));

CREATE POLICY "Público pode ver avaliações" ON public.avaliacoes
  FOR SELECT USING (true);

-- Políticas para serviços
CREATE POLICY "Público pode ver serviços" ON public.servicos
  FOR SELECT USING (true);

CREATE POLICY "Prestadores podem gerenciar próprios serviços" ON public.prestador_servicos
  FOR ALL USING (prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Público pode ver serviços de prestadores" ON public.prestador_servicos
  FOR SELECT USING (true);

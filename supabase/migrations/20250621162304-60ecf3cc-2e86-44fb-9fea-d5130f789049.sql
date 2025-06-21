
-- Primeiro, verificar se as colunas necessárias existem na tabela users
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'descricao') THEN
        ALTER TABLE public.users ADD COLUMN descricao TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE public.users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();
    END IF;
END $$;

-- Criar tabela de serviços prestados se não existir
CREATE TABLE IF NOT EXISTS public.servicos_prestados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  servico_id UUID REFERENCES public.servicos_disponiveis(id) ON DELETE CASCADE,
  preco_medio NUMERIC,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(prestador_id, servico_id)
);

-- Criar tabela de pagamentos PIX se não existir
CREATE TABLE IF NOT EXISTS public.pagamentos_pix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  prestador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  valor NUMERIC NOT NULL,
  status TEXT CHECK (status IN ('pendente', 'confirmado', 'cancelado')) DEFAULT 'pendente',
  comprovante_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar Row Level Security nas novas tabelas
ALTER TABLE public.servicos_prestados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pagamentos_pix ENABLE ROW LEVEL SECURITY;

-- Políticas para serviços prestados
DROP POLICY IF EXISTS "Prestadores podem gerenciar próprios serviços" ON public.servicos_prestados;
CREATE POLICY "Prestadores podem gerenciar próprios serviços" 
  ON public.servicos_prestados 
  FOR ALL 
  USING (prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

DROP POLICY IF EXISTS "Todos podem ver serviços prestados" ON public.servicos_prestados;
CREATE POLICY "Todos podem ver serviços prestados" 
  ON public.servicos_prestados 
  FOR SELECT 
  USING (true);

-- Políticas para pagamentos
DROP POLICY IF EXISTS "Usuários podem ver próprios pagamentos" ON public.pagamentos_pix;
CREATE POLICY "Usuários podem ver próprios pagamentos" 
  ON public.pagamentos_pix 
  FOR SELECT 
  USING (solicitante_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) 
         OR prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Trigger para atualizar updated_at se não existir
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON public.users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

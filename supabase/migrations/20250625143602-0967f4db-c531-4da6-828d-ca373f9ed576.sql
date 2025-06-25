
-- Criar tabela para classificação de prestadores
CREATE TABLE public.classificacao_prestadores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prestador_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'padrao' CHECK (tipo IN ('destaque', 'padrao')),
  criado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  atualizado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Adicionar índice para melhor performance
CREATE INDEX idx_classificacao_prestadores_prestador_id ON public.classificacao_prestadores(prestador_id);

-- Criar trigger para atualizar atualizado_em
CREATE TRIGGER update_classificacao_prestadores_updated_at
    BEFORE UPDATE ON public.classificacao_prestadores
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.classificacao_prestadores ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura por todos (para mostrar o ícone de destaque)
CREATE POLICY "Classificações são visíveis para todos" ON public.classificacao_prestadores
  FOR SELECT USING (true);

-- Política para permitir apenas administradores modificarem
CREATE POLICY "Apenas sistema pode modificar classificações" ON public.classificacao_prestadores
  FOR ALL USING (false);

-- Adicionar colunas necessárias na tabela agendamentos
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS titulo TEXT;
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS descricao TEXT;
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS cliente_nome TEXT;
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS endereco TEXT;
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS preco_acordado DECIMAL;

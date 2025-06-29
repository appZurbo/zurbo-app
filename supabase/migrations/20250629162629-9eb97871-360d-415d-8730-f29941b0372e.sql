
-- Atualizar status da tabela chat_conversations para incluir novos status
ALTER TABLE public.chat_conversations 
DROP CONSTRAINT IF EXISTS chat_conversations_status_check;

ALTER TABLE public.chat_conversations 
ADD CONSTRAINT chat_conversations_status_check 
CHECK (status IN ('aguardando_preco', 'preco_definido', 'aceito', 'rejeitado', 'pagamento_retido', 'em_andamento', 'concluido', 'cancelado', 'bloqueado'));

-- Criar tabela para pagamentos em escrow
CREATE TABLE IF NOT EXISTS public.escrow_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT DEFAULT 'BRL',
  status TEXT CHECK (status IN ('pending', 'held', 'released', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  released_at TIMESTAMP WITH TIME ZONE,
  auto_release_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela para histórico de transações
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  escrow_payment_id UUID REFERENCES public.escrow_payments(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('payment', 'release', 'refund')) NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Adicionar campo para contar mensagens por usuário
ALTER TABLE public.chat_conversations 
ADD COLUMN IF NOT EXISTS client_message_count INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS provider_message_count INTEGER DEFAULT 0;

-- Atualizar status na tabela pedidos para incluir novos status
ALTER TABLE public.pedidos 
DROP CONSTRAINT IF EXISTS pedidos_status_check;

ALTER TABLE public.pedidos 
ADD CONSTRAINT pedidos_status_check 
CHECK (status IN ('pendente', 'aceito', 'preco_definido', 'pagamento_retido', 'em_andamento', 'concluido', 'cancelado', 'rejeitado'));

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.escrow_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para escrow_payments
CREATE POLICY "Users can view their own escrow payments" 
  ON public.escrow_payments 
  FOR SELECT 
  USING (
    conversation_id IN (
      SELECT id FROM public.chat_conversations 
      WHERE cliente_id = public.get_current_user_id() OR prestador_id = public.get_current_user_id()
    )
  );

CREATE POLICY "System can manage escrow payments" 
  ON public.escrow_payments 
  FOR ALL 
  USING (true);

-- Políticas RLS para transactions
CREATE POLICY "Users can view their own transactions" 
  ON public.transactions 
  FOR SELECT 
  USING (user_id = public.get_current_user_id());

CREATE POLICY "System can manage transactions" 
  ON public.transactions 
  FOR ALL 
  USING (true);

-- Função para atualizar contador de mensagens
CREATE OR REPLACE FUNCTION update_message_count()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.message_type = 'text' OR NEW.message_type = 'image' THEN
    -- Verificar se o remetente é cliente ou prestador
    UPDATE public.chat_conversations 
    SET 
      client_message_count = CASE 
        WHEN cliente_id = NEW.sender_id THEN client_message_count + 1 
        ELSE client_message_count 
      END,
      provider_message_count = CASE 
        WHEN prestador_id = NEW.sender_id THEN provider_message_count + 1 
        ELSE provider_message_count 
      END,
      updated_at = now()
    WHERE id = NEW.conversation_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para atualizar contador de mensagens
CREATE TRIGGER trigger_update_message_count
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_message_count();

-- Função para atualizar updated_at em escrow_payments
CREATE OR REPLACE FUNCTION update_escrow_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at := NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para updated_at em escrow_payments
CREATE TRIGGER trigger_escrow_updated_at
    BEFORE UPDATE ON public.escrow_payments
    FOR EACH ROW EXECUTE FUNCTION update_escrow_updated_at();

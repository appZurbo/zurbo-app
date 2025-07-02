
-- Criar tabela de pagamentos escrow melhorada
CREATE TABLE IF NOT EXISTS public.escrow_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_account_id TEXT,
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'BRL',
  zurbo_fee NUMERIC DEFAULT 0,
  status TEXT CHECK (status IN ('pending', 'authorized', 'captured', 'refunded', 'disputed', 'failed')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  authorized_at TIMESTAMP WITH TIME ZONE,
  captured_at TIMESTAMP WITH TIME ZONE,
  dispute_reason TEXT,
  dispute_images TEXT[],
  auto_release_date TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de contas Stripe Connect
CREATE TABLE IF NOT EXISTS public.stripe_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  stripe_account_id TEXT UNIQUE NOT NULL,
  account_type TEXT DEFAULT 'express',
  charges_enabled BOOLEAN DEFAULT false,
  details_submitted BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de limites de uso
CREATE TABLE IF NOT EXISTS public.usage_limits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  service_requests_hour INTEGER DEFAULT 0,
  service_requests_day INTEGER DEFAULT 0,
  active_requests INTEGER DEFAULT 0,
  last_request_at TIMESTAMP WITH TIME ZONE,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de cancelamentos
CREATE TABLE IF NOT EXISTS public.cancellation_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  pedido_id UUID REFERENCES public.pedidos(id) ON DELETE CASCADE,
  reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Atualizar tabela de usuários com flag de teste
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_test_user BOOLEAN DEFAULT false;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS unreliable_until TIMESTAMP WITH TIME ZONE;

-- Atualizar tabela de agendamentos
ALTER TABLE public.agendamentos ADD COLUMN IF NOT EXISTS manually_added BOOLEAN DEFAULT false;

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.escrow_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stripe_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cancellation_history ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para escrow_payments
CREATE POLICY "Users can view their own escrow payments" ON public.escrow_payments
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM public.chat_conversations 
      WHERE cliente_id = get_current_user_id() OR prestador_id = get_current_user_id()
    )
  );

CREATE POLICY "System can manage escrow payments" ON public.escrow_payments
  FOR ALL USING (true);

-- Políticas RLS para stripe_accounts
CREATE POLICY "Users can manage their own stripe account" ON public.stripe_accounts
  FOR ALL USING (user_id = get_current_user_id());

-- Políticas RLS para usage_limits
CREATE POLICY "Users can view their own usage limits" ON public.usage_limits
  FOR SELECT USING (user_id = get_current_user_id());

CREATE POLICY "System can manage usage limits" ON public.usage_limits
  FOR ALL USING (true);

-- Políticas RLS para cancellation_history
CREATE POLICY "Users can view their own cancellation history" ON public.cancellation_history
  FOR SELECT USING (user_id = get_current_user_id());

CREATE POLICY "System can manage cancellation history" ON public.cancellation_history
  FOR ALL USING (true);

-- Triggers para atualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_escrow_payments_updated_at BEFORE UPDATE ON public.escrow_payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stripe_accounts_updated_at BEFORE UPDATE ON public.stripe_accounts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_usage_limits_updated_at BEFORE UPDATE ON public.usage_limits
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Inserir configurações do sistema para testes
INSERT INTO public.system_settings (key, value, description) VALUES
  ('testing_mode', 'false', 'Ativar modo de testes'),
  ('limits_enabled', 'true', 'Ativar limites de uso'),
  ('periodic_notifications', 'false', 'Ativar notificações periódicas de teste')
ON CONFLICT (key) DO NOTHING;

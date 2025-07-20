
-- Criar tabela para rastrear tentativas de login (rate limiting)
CREATE TABLE IF NOT EXISTS auth_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  attempt_type TEXT NOT NULL CHECK (attempt_type IN ('login', 'signup', 'password_reset')),
  ip_address INET,
  user_agent TEXT,
  success BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índice para otimizar consultas de rate limiting
CREATE INDEX IF NOT EXISTS idx_auth_attempts_email_created 
ON auth_attempts(email, created_at DESC);

-- Criar tabela para emails suspeitos/bloqueados
CREATE TABLE IF NOT EXISTS blocked_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email_pattern TEXT NOT NULL,
  blocked_reason TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

-- Criar tabela para logs de auditoria de autenticação
CREATE TABLE IF NOT EXISTS auth_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  auth_id UUID,
  event_type TEXT NOT NULL,
  provider TEXT,
  success BOOLEAN DEFAULT FALSE,
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Políticas RLS para as novas tabelas
ALTER TABLE auth_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blocked_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE auth_audit_logs ENABLE ROW LEVEL SECURITY;

-- Apenas admins podem ver logs de auditoria
CREATE POLICY "Admins can view auth audit logs" ON auth_audit_logs
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.tipo IN ('admin', 'moderator')
    )
  );

-- Apenas admins podem gerenciar emails bloqueados
CREATE POLICY "Admins can manage blocked emails" ON blocked_emails
  FOR ALL TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.auth_id = auth.uid() 
      AND users.tipo IN ('admin', 'moderator')
    )
  );

-- Sistema pode inserir tentativas de autenticação
CREATE POLICY "System can log auth attempts" ON auth_attempts
  FOR INSERT TO authenticated
  WITH CHECK (true);

-- Usuários podem ver suas próprias tentativas (últimas 24h)
CREATE POLICY "Users can view own recent auth attempts" ON auth_attempts
  FOR SELECT TO authenticated
  USING (
    email IN (
      SELECT users.email FROM users 
      WHERE users.auth_id = auth.uid()
    )
    AND created_at > NOW() - INTERVAL '24 hours'
  );

-- Função para validar email não suspeito
CREATE OR REPLACE FUNCTION is_email_allowed(email_to_check TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Verificar se o email não está na lista de bloqueados
  RETURN NOT EXISTS (
    SELECT 1 FROM blocked_emails 
    WHERE email_to_check ILIKE email_pattern
  );
END;
$$;

-- Função para registrar tentativas de autenticação
CREATE OR REPLACE FUNCTION log_auth_attempt(
  p_email TEXT,
  p_attempt_type TEXT,
  p_success BOOLEAN DEFAULT FALSE,
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO auth_attempts (email, attempt_type, success, ip_address, user_agent)
  VALUES (p_email, p_attempt_type, p_success, p_ip_address, p_user_agent);
END;
$$;

-- Função para verificar rate limiting
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_email TEXT,
  p_attempt_type TEXT,
  p_max_attempts INTEGER DEFAULT 5,
  p_time_window INTERVAL DEFAULT '1 hour'
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  attempt_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO attempt_count
  FROM auth_attempts
  WHERE email = p_email
    AND attempt_type = p_attempt_type
    AND success = FALSE
    AND created_at > NOW() - p_time_window;
    
  RETURN attempt_count < p_max_attempts;
END;
$$;

-- Inserir alguns domínios de email temporário conhecidos na lista de bloqueados
INSERT INTO blocked_emails (email_pattern, blocked_reason, created_by) VALUES
('%@10minutemail.%', 'Domínio de email temporário', NULL),
('%@guerrillamail.%', 'Domínio de email temporário', NULL),
('%@mailinator.%', 'Domínio de email temporário', NULL),
('%@tempmail.%', 'Domínio de email temporário', NULL),
('%@throwaway.email', 'Domínio de email temporário', NULL)
ON CONFLICT DO NOTHING;

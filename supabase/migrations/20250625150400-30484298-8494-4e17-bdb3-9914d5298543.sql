
-- Criar tabela usuarios_premium
CREATE TABLE usuarios_premium (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES users(id),
  ativo BOOLEAN DEFAULT FALSE,
  desde TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expira_em TIMESTAMP WITH TIME ZONE
);

-- Adicionar RLS (Row Level Security)
ALTER TABLE usuarios_premium ENABLE ROW LEVEL SECURITY;

-- Política para usuários verem apenas seus próprios dados premium
CREATE POLICY "Usuarios podem ver seus próprios dados premium" 
  ON usuarios_premium 
  FOR ALL 
  USING (usuario_id IN (
    SELECT id FROM users WHERE auth_id = auth.uid()
  ));

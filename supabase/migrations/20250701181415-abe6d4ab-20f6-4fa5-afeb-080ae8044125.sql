
-- Configurar contas PRO eternas (usando upsert manual)
DO $$
BEGIN
  -- Para cada email, inserir ou atualizar usuarios_premium
  INSERT INTO usuarios_premium (usuario_id, ativo, desde, expira_em)
  SELECT u.id, true, now(), null
  FROM users u 
  WHERE u.email = 'roquematheus@live.com'
  AND NOT EXISTS (
    SELECT 1 FROM usuarios_premium up WHERE up.usuario_id = u.id
  );
  
  INSERT INTO usuarios_premium (usuario_id, ativo, desde, expira_em)
  SELECT u.id, true, now(), null
  FROM users u 
  WHERE u.email = 'cieslakroque@gmail.com'
  AND NOT EXISTS (
    SELECT 1 FROM usuarios_premium up WHERE up.usuario_id = u.id
  );

  -- Atualizar registros existentes
  UPDATE usuarios_premium 
  SET ativo = true, desde = now(), expira_em = null
  WHERE usuario_id IN (
    SELECT u.id FROM users u 
    WHERE u.email IN ('roquematheus@live.com', 'cieslakroque@gmail.com')
  );

  -- Configurar planos premium para prestadores
  INSERT INTO plano_premium (prestador_id, ativo, desde, expira_em)
  SELECT u.id, true, now(), null
  FROM users u 
  WHERE u.email IN ('roquematheus@live.com', 'cieslakroque@gmail.com')
    AND u.tipo = 'prestador'
    AND NOT EXISTS (
      SELECT 1 FROM plano_premium pp WHERE pp.prestador_id = u.id
    );

  -- Atualizar planos premium existentes
  UPDATE plano_premium 
  SET ativo = true, desde = now(), expira_em = null
  WHERE prestador_id IN (
    SELECT u.id FROM users u 
    WHERE u.email IN ('roquematheus@live.com', 'cieslakroque@gmail.com')
      AND u.tipo = 'prestador'
  );

  -- Atualizar campo premium na tabela users
  UPDATE users 
  SET premium = true, updated_at = now()
  WHERE email IN ('roquematheus@live.com', 'cieslakroque@gmail.com');

  -- Garantir que a conta admin está configurada corretamente
  UPDATE users 
  SET tipo = 'admin', premium = true, updated_at = now()
  WHERE email = 'contato@zurbo.com.br';
END $$;

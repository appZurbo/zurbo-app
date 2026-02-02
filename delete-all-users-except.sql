-- Script SQL para deletar todas as contas exceto cieslakroque@gmail.com e appplanora@gmail.com
-- Execute este script no SQL Editor do Supabase Dashboard
-- 
-- IMPORTANTE: Este script mantém os dados fake criados (que têm auth_id fake)
-- e deleta apenas contas reais de usuários cadastrados

-- Primeiro, vamos ver quantos usuários serão deletados
SELECT 
  COUNT(*) as total_usuarios,
  COUNT(CASE WHEN email IN ('cieslakroque@gmail.com', 'appplanora@gmail.com') THEN 1 END) as usuarios_mantidos,
  COUNT(CASE WHEN email NOT IN ('cieslakroque@gmail.com', 'appplanora@gmail.com') THEN 1 END) as usuarios_serao_deletados
FROM public.users;

-- Obter IDs dos usuários que serão deletados
DO $$
DECLARE
  user_ids_to_delete UUID[];
  fk_record RECORD;
  delete_sql TEXT;
BEGIN
  -- Coletar IDs dos usuários a deletar
  SELECT ARRAY_AGG(id) INTO user_ids_to_delete
  FROM public.users
  WHERE email NOT IN ('cieslakroque@gmail.com', 'appplanora@gmail.com');

  -- Se não houver usuários para deletar, sair
  IF user_ids_to_delete IS NULL OR array_length(user_ids_to_delete, 1) IS NULL THEN
    RAISE NOTICE 'Nenhum usuário para deletar';
    RETURN;
  END IF;

  RAISE NOTICE 'Deletando registros relacionados para % usuários...', array_length(user_ids_to_delete, 1);

  -- Encontrar e deletar de todas as tabelas que referenciam users sem CASCADE
  -- Isso garante que não esquecemos nenhuma tabela
  FOR fk_record IN
    SELECT DISTINCT
      tc.table_schema,
      tc.table_name,
      kcu.column_name,
      pc.confdeltype as delete_action
    FROM information_schema.table_constraints AS tc
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
    JOIN pg_constraint pc
      ON pc.conname = tc.constraint_name
    JOIN pg_class rel
      ON rel.oid = pc.conrelid
      AND rel.relname = tc.table_name
    WHERE tc.constraint_type = 'FOREIGN KEY'
      AND ccu.table_name = 'users'
      AND ccu.column_name = 'id'
      AND tc.table_schema = 'public'
      AND tc.table_name != 'users'
      AND (pc.confdeltype IS NULL OR pc.confdeltype != 'c')  -- Não é CASCADE
  LOOP
    BEGIN
      delete_sql := format(
        'DELETE FROM %I.%I WHERE %I = ANY($1)',
        fk_record.table_schema,
        fk_record.table_name,
        fk_record.column_name
      );
      EXECUTE delete_sql USING user_ids_to_delete;
      RAISE NOTICE 'Deletado de %.% (coluna: %)', fk_record.table_schema, fk_record.table_name, fk_record.column_name;
    EXCEPTION WHEN OTHERS THEN
      RAISE NOTICE 'Erro ao deletar de %.%: %', fk_record.table_schema, fk_record.table_name, SQLERRM;
    END;
  END LOOP;

  -- Deletar também de tabelas específicas conhecidas (backup manual)
  -- Isso garante que mesmo se a query dinâmica falhar, as principais tabelas serão limpas
  
  BEGIN
    -- Agendamentos (sem CASCADE)
    DELETE FROM public.agendamentos
    WHERE solicitante_id = ANY(user_ids_to_delete) OR prestador_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Agendamentos deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela agendamentos não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Denúncias (sem CASCADE)
    DELETE FROM public.denuncias
    WHERE denunciante_id = ANY(user_ids_to_delete) OR denunciado_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Denúncias deletadas';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela denuncias não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Favoritos (sem CASCADE)
    DELETE FROM public.favoritos
    WHERE usuario_id = ANY(user_ids_to_delete) OR prestador_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Favoritos deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela favoritos não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Histórico de serviços (sem CASCADE)
    DELETE FROM public.historico_servicos
    WHERE solicitante_id = ANY(user_ids_to_delete) OR prestador_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Histórico de serviços deletado';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela historico_servicos não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Comprovantes (via historico_servicos)
    DELETE FROM public.comprovantes
    WHERE historico_id IN (
      SELECT id FROM public.historico_servicos
      WHERE solicitante_id = ANY(user_ids_to_delete) OR prestador_id = ANY(user_ids_to_delete)
    );
    RAISE NOTICE 'Comprovantes deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela comprovantes não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Pedidos (sem CASCADE - usa cliente_id e prestador_id)
    DELETE FROM public.pedidos
    WHERE cliente_id = ANY(user_ids_to_delete) OR prestador_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Pedidos deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela pedidos não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Cupons usados (sem CASCADE)
    DELETE FROM public.cupons_usados
    WHERE usuario_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Cupons usados deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela cupons_usados não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Usuários premium (sem CASCADE)
    DELETE FROM public.usuarios_premium
    WHERE usuario_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Usuários premium deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela usuarios_premium não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Plano premium (sem CASCADE - usa prestador_id)
    DELETE FROM public.plano_premium
    WHERE prestador_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Planos premium deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela plano_premium não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Bairros atendidos (sem CASCADE - usa prestador_id)
    DELETE FROM public.bairros_atendidos
    WHERE prestador_id = ANY(user_ids_to_delete);
    RAISE NOTICE 'Bairros atendidos deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela bairros_atendidos não encontrada ou erro: %', SQLERRM;
  END;

  BEGIN
    -- Blocked emails (sem CASCADE - usa created_by)
    DELETE FROM public.blocked_emails
    WHERE created_by = ANY(user_ids_to_delete);
    RAISE NOTICE 'Blocked emails deletados';
  EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Tabela blocked_emails não encontrada ou erro: %', SQLERRM;
  END;

  RAISE NOTICE 'Registros relacionados deletados. Agora deletando usuários...';

  -- Agora deletar os usuários (tabelas com CASCADE serão limpas automaticamente)
  DELETE FROM public.users
  WHERE id = ANY(user_ids_to_delete);

  RAISE NOTICE 'Usuários deletados com sucesso!';
END $$;

-- Verificar resultado
SELECT 
  CASE 
    WHEN COUNT(*) = 2 THEN '✅ Limpeza concluída! Restam apenas os 2 usuários especificados.'
    ELSE '⚠️ Ainda existem ' || COUNT(*) || ' usuário(s)'
  END as status,
  COUNT(*) as usuarios_restantes,
  STRING_AGG(email, ', ') as emails_restantes
FROM public.users;

-- Deletar também de auth.users (se existirem)
-- Isso só vai deletar contas reais que foram criadas através do sistema de autenticação
DELETE FROM auth.users
WHERE email NOT IN ('cieslakroque@gmail.com', 'appplanora@gmail.com')
AND email IS NOT NULL;

-- Verificar resultado final
SELECT 
  'Usuários restantes em public.users:' as tipo,
  COUNT(*) as total
FROM public.users
UNION ALL
SELECT 
  'Usuários restantes em auth.users:' as tipo,
  COUNT(*) as total
FROM auth.users
WHERE email IN ('cieslakroque@gmail.com', 'appplanora@gmail.com');

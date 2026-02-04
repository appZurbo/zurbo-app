-- Script SQL para deletar usuário oftalmologiaroque@gmail.com
-- Execute este script no SQL Editor do Supabase Dashboard

-- 1. Buscar o usuário pelo email
DO $$
DECLARE
  user_record RECORD;
  user_auth_id UUID;
BEGIN
  -- Buscar o usuário na tabela users
  SELECT id, auth_id, email, nome INTO user_record
  FROM public.users
  WHERE email = 'oftalmologiaroque@gmail.com'
  LIMIT 1;

  IF user_record IS NULL THEN
    RAISE NOTICE 'Usuário não encontrado com email: oftalmologiaroque@gmail.com';
    
    -- Tentar buscar com variações
    SELECT id, auth_id, email, nome INTO user_record
    FROM public.users
    WHERE email ILIKE '%oftalmologiaroque%'
    LIMIT 1;
    
    IF user_record IS NULL THEN
      RAISE NOTICE 'Nenhum usuário encontrado com variações do email.';
      RETURN;
    END IF;
  END IF;

  RAISE NOTICE 'Usuário encontrado:';
  RAISE NOTICE '  ID: %', user_record.id;
  RAISE NOTICE '  Nome: %', user_record.nome;
  RAISE NOTICE '  Email: %', user_record.email;
  RAISE NOTICE '  Auth ID: %', user_record.auth_id;

  -- Salvar o auth_id antes de deletar
  user_auth_id := user_record.auth_id;

  -- 2. Deletar o perfil da tabela users
  -- Isso deve deletar em cascata todos os dados relacionados devido ao ON DELETE CASCADE
  DELETE FROM public.users
  WHERE id = user_record.id;

  RAISE NOTICE 'Perfil deletado com sucesso da tabela users!';
  RAISE NOTICE '';
  RAISE NOTICE 'IMPORTANTE: Para deletar do auth.users, execute:';
  RAISE NOTICE 'DELETE FROM auth.users WHERE id = ''%'';', user_auth_id;
  RAISE NOTICE '';
  RAISE NOTICE 'Ou use o dashboard: Authentication > Users > Buscar pelo email ou Auth ID > Delete';

END $$;

-- 3. (Opcional) Se quiser deletar diretamente do auth.users também, descomente a linha abaixo:
-- DELETE FROM auth.users WHERE id IN (
--   SELECT auth_id FROM public.users WHERE email = 'oftalmologiaroque@gmail.com'
-- );

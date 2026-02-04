-- Script SQL simplificado para deletar usuário oftalmologiaroque@gmail.com
-- Execute este script no SQL Editor do Supabase Dashboard

-- Deletar o perfil da tabela users (deleta em cascata todos os dados relacionados)
DELETE FROM public.users
WHERE email = 'oftalmologiaroque@gmail.com';

-- Verificar se foi deletado
SELECT 
  CASE 
    WHEN COUNT(*) = 0 THEN '✅ Usuário deletado com sucesso!'
    ELSE '⚠️ Ainda existem ' || COUNT(*) || ' usuário(s) com este email'
  END as status
FROM public.users
WHERE email = 'oftalmologiaroque@gmail.com';

-- Para deletar também do auth.users, execute após deletar da tabela users:
-- DELETE FROM auth.users WHERE email = 'oftalmologiaroque@gmail.com';


-- First, drop the existing constraint and recreate it with the new roles
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_tipo_check;

-- Add the new constraint with admin and moderator roles
ALTER TABLE users ADD CONSTRAINT users_tipo_check 
CHECK (tipo IN ('cliente', 'prestador', 'admin', 'moderator'));

-- Now update the user to admin
UPDATE public.users 
SET tipo = 'admin', updated_at = now() 
WHERE email = 'contato@zurbo.com.br';

-- Verify the change was successful
SELECT id, nome, email, tipo, criado_em 
FROM public.users 
WHERE email = 'contato@zurbo.com.br';

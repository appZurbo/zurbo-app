
-- Add the missing fields to the users table
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS em_servico boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS descricao_servico text;

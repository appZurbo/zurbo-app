
-- Add em_servico field to users table if it doesn't exist
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS em_servico boolean DEFAULT false;

-- Update the existing em_servico column to have proper default
UPDATE public.users 
SET em_servico = false 
WHERE em_servico IS NULL;

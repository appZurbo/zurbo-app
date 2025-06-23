
-- Adicionar campos de localização detalhada à tabela users
ALTER TABLE public.users 
ADD COLUMN endereco_rua TEXT,
ADD COLUMN endereco_numero TEXT,
ADD COLUMN endereco_bairro TEXT,
ADD COLUMN endereco_cep TEXT,
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8);

-- Criar índices para busca geográfica
CREATE INDEX idx_users_location ON public.users(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;
CREATE INDEX idx_users_cidade ON public.users(endereco_cidade);

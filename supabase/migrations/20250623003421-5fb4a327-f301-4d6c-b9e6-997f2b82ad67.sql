
-- Criar tabela de cidades brasileiras
CREATE TABLE public.cidades_brasileiras (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  estado TEXT NOT NULL,
  codigo_ibge TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar índice para busca rápida
CREATE INDEX idx_cidades_nome ON public.cidades_brasileiras(nome);
CREATE INDEX idx_cidades_estado ON public.cidades_brasileiras(estado);

-- Inserir cidades do Mato Grosso
INSERT INTO public.cidades_brasileiras (nome, estado, codigo_ibge) VALUES
('Cuiabá', 'MT', '5103403'),
('Várzea Grande', 'MT', '5108402'),
('Rondonópolis', 'MT', '5107602'),
('Sinop', 'MT', '5107909'),
('Tangará da Serra', 'MT', '5107958'),
('Cáceres', 'MT', '5102504'),
('Barra do Garças', 'MT', '5101803'),
('Primavera do Leste', 'MT', '5107040'),
('Alta Floresta', 'MT', '5100250'),
('Sorriso', 'MT', '5107925'),
('Lucas do Rio Verde', 'MT', '5105234'),
('Nova Mutum', 'MT', '5106224'),
('Colíder', 'MT', '5103001'),
('Diamantino', 'MT', '5103502'),
('Pontes e Lacerda', 'MT', '5106869'),
('Juína', 'MT', '5104906'),
('Campo Verde', 'MT', '5102702'),
('Água Boa', 'MT', '5100201'),
('Mirassol d''Oeste', 'MT', '5105622'),
('Brasnorte', 'MT', '5101902'),
('Chapada dos Guimarães', 'MT', '5103007'),
('Poconé', 'MT', '5106802'),
('Canarana', 'MT', '5102504'),
('Guarantã do Norte', 'MT', '5104104'),
('Peixoto de Azevedo', 'MT', '5106422'),
('Campo Novo do Parecis', 'MT', '5102637'),
('Jaciara', 'MT', '5104807'),
('Nova Xavantina', 'MT', '5106257'),
('Matupá', 'MT', '5105507'),
('Juara', 'MT', '5104906'),
('Sapezal', 'MT', '5107800'),
('Paranatinga', 'MT', '5106307'),
('Nortelândia', 'MT', '5106000'),
('Nobres', 'MT', '5105903'),
('Vila Rica', 'MT', '5108600'),
('Confresa', 'MT', '5103106'),
('São José do Rio Claro', 'MT', '5107701'),
('Bom Jesus do Araguaia', 'MT', '5101605'),
('Feliz Natal', 'MT', '5103700'),
('Terra Nova do Norte', 'MT', '5108006'),
('Pedra Preta', 'MT', '5106372'),
('Castanheira', 'MT', '5102850'),
('São Félix do Araguaia', 'MT', '5107602'),
('Novo Mundo', 'MT', '5106182'),
('Tabaporã', 'MT', '5107909'),
('Ribeirão Cascalheira', 'MT', '5107206'),
('Itiquira', 'MT', '5104526'),
('Porto Alegre do Norte', 'MT', '5106901'),
('Arenápolis', 'MT', '5100805');

-- Habilitar RLS (Row Level Security) - dados públicos para leitura
ALTER TABLE public.cidades_brasileiras ENABLE ROW LEVEL SECURITY;

-- Política para permitir leitura para todos os usuários autenticados
CREATE POLICY "Anyone can read cities" ON public.cidades_brasileiras
    FOR SELECT USING (true);

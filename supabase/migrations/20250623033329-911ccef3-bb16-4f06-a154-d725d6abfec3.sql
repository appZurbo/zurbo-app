
-- Adicionar o novo serviço de Refrigeração (sem ON CONFLICT já que não há constraint unique em 'nome')
INSERT INTO public.servicos (nome, icone, cor, ativo) 
VALUES ('Refrigeração', 'Snowflake', '#3b82f6', true);

-- Alterar "Mudança" para "Fretes"
UPDATE public.servicos 
SET nome = 'Fretes'
WHERE nome = 'Mudança';

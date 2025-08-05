
-- Desativar serviços duplicados, mantendo os mais específicos
UPDATE servicos SET ativo = false WHERE nome = 'Elétrica' AND ativo = true;
UPDATE servicos SET ativo = false WHERE nome = 'Encanamento' AND ativo = true;
UPDATE servicos SET ativo = false WHERE nome = 'Pintura' AND ativo = true;
UPDATE servicos SET ativo = false WHERE nome = 'Serviços de Frete' AND ativo = true;
UPDATE servicos SET ativo = false WHERE nome = 'Jardinagem' AND ativo = true;
UPDATE servicos SET ativo = false WHERE nome = 'Manutenção de Ar-condicionado' AND ativo = true;

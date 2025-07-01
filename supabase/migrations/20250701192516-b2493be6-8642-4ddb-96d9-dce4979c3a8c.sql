-- Create test notifications for different user types
INSERT INTO notifications (user_id, title, content, type, is_read) 
SELECT 
  u.id,
  'Nova mensagem recebida',
  'Você recebeu uma nova mensagem de um cliente interessado em seus serviços.',
  'message',
  false
FROM users u 
WHERE u.tipo = 'prestador' 
LIMIT 3;

INSERT INTO notifications (user_id, title, content, type, is_read) 
SELECT 
  u.id,
  'Pedido de serviço',
  'Um novo pedido de serviço foi criado na sua área de atendimento.',
  'service_request',
  false
FROM users u 
WHERE u.tipo = 'prestador' 
LIMIT 2;

INSERT INTO notifications (user_id, title, content, type, is_read) 
SELECT 
  u.id,
  'Resposta do prestador',
  'O prestador João Silva respondeu sua solicitação de orçamento.',
  'message',
  false
FROM users u 
WHERE u.tipo = 'cliente' 
LIMIT 3;

INSERT INTO notifications (user_id, title, content, type, is_read) 
SELECT 
  u.id,
  'Atualização do sistema',
  'Novas funcionalidades foram adicionadas à plataforma Zurbo.',
  'system_update',
  true
FROM users u 
LIMIT 5;

-- Create test agendamentos (appointments) with fake data
INSERT INTO agendamentos (prestador_id, solicitante_id, titulo, descricao, data_agendada, hora_agendada, endereco, status, preco_acordado)
SELECT 
  p.id as prestador_id,
  c.id as solicitante_id,
  'Manutenção de encanamento',
  'Verificar vazamento na cozinha e trocar registro se necessário',
  CURRENT_DATE + INTERVAL '2 days',
  '14:00',
  'Rua das Flores, 123 - Centro',
  'confirmado',
  150.00
FROM users p, users c 
WHERE p.tipo = 'prestador' AND c.tipo = 'cliente'
LIMIT 1;

INSERT INTO agendamentos (prestador_id, solicitante_id, titulo, descricao, data_agendada, hora_agendada, endereco, status, preco_acordado)
SELECT 
  p.id as prestador_id,
  c.id as solicitante_id,
  'Limpeza residencial completa',
  'Limpeza geral de apartamento de 3 quartos',
  CURRENT_DATE + INTERVAL '5 days',
  '09:00',
  'Av. Principal, 456 - Jardim América',
  'pendente',
  200.00
FROM users p, users c 
WHERE p.tipo = 'prestador' AND c.tipo = 'cliente'
AND p.id != (SELECT p2.id FROM users p2 WHERE p2.tipo = 'prestador' LIMIT 1)
LIMIT 1;

INSERT INTO agendamentos (prestador_id, solicitante_id, titulo, descricao, data_agendada, hora_agendada, endereco, status, preco_acordado)
SELECT 
  p.id as prestador_id,
  c.id as solicitante_id,
  'Instalação elétrica',
  'Instalar tomadas no quarto e trocar disjuntor',
  CURRENT_DATE + INTERVAL '1 week',
  '15:30',
  'Rua dos Pinheiros, 789 - Vila Nova',
  'confirmado',
  300.00
FROM users p, users c 
WHERE p.tipo = 'prestador' AND c.tipo = 'cliente'
LIMIT 1;

INSERT INTO agendamentos (prestador_id, solicitante_id, titulo, descricao, data_agendada, hora_agendada, endereco, status, cliente_nome)
SELECT 
  p.id as prestador_id,
  c.id as solicitante_id,
  'Pintura de parede',
  'Pintar sala de estar e corredor',
  CURRENT_DATE - INTERVAL '3 days',
  '08:00',
  'Rua das Acácias, 321 - Bela Vista',
  'concluido',
  c.nome
FROM users p, users c 
WHERE p.tipo = 'prestador' AND c.tipo = 'cliente'
LIMIT 1;
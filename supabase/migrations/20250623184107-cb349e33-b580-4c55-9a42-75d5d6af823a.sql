
-- Tabela: denúncias de usuários
CREATE TABLE denuncias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  denunciante_id UUID REFERENCES users(id),
  denunciado_id UUID REFERENCES users(id),
  motivo TEXT,
  detalhes TEXT,
  status TEXT CHECK (status IN ('pendente', 'avaliando', 'resolvido')) DEFAULT 'pendente',
  data TIMESTAMP DEFAULT now()
);

-- Tabela: agendamentos de serviço
CREATE TABLE agendamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante_id UUID REFERENCES users(id),
  prestador_id UUID REFERENCES users(id),
  servico_id UUID REFERENCES servicos(id),
  data_agendada DATE NOT NULL,
  hora_agendada TIME NOT NULL,
  status TEXT CHECK (status IN ('pendente', 'confirmado', 'concluido', 'cancelado')) DEFAULT 'pendente',
  criado_em TIMESTAMP DEFAULT now()
);

-- Tabela: favoritos (prestadores salvos por usuários)
CREATE TABLE favoritos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES users(id),
  prestador_id UUID REFERENCES users(id),
  criado_em TIMESTAMP DEFAULT now(),
  UNIQUE (usuario_id, prestador_id)
);

-- Tabela: histórico de serviços (necessária para comprovantes)
CREATE TABLE historico_servicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  solicitante_id UUID REFERENCES users(id),
  prestador_id UUID REFERENCES users(id),
  servico_id UUID REFERENCES servicos(id),
  data_servico DATE NOT NULL,
  valor NUMERIC,
  status TEXT CHECK (status IN ('concluido', 'cancelado')) DEFAULT 'concluido',
  criado_em TIMESTAMP DEFAULT now()
);

-- Tabela: comprovantes de serviços (recibo simples)
CREATE TABLE comprovantes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  historico_id UUID REFERENCES historico_servicos(id),
  url_pdf TEXT,
  gerado_em TIMESTAMP DEFAULT now()
);

-- Tabela: cupons e promoções
CREATE TABLE cupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  codigo TEXT UNIQUE NOT NULL,
  tipo TEXT CHECK (tipo IN ('porcentagem', 'valor')) NOT NULL,
  valor NUMERIC NOT NULL,
  valido_ate DATE,
  ativo BOOLEAN DEFAULT TRUE
);

-- Tabela: uso de cupons
CREATE TABLE cupons_usados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id UUID REFERENCES users(id),
  cupom_id UUID REFERENCES cupons(id),
  utilizado_em TIMESTAMP DEFAULT now(),
  UNIQUE (usuario_id, cupom_id)
);

-- Tabela: painel premium do prestador
CREATE TABLE plano_premium (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID REFERENCES users(id),
  ativo BOOLEAN DEFAULT FALSE,
  desde TIMESTAMP DEFAULT now(),
  expira_em TIMESTAMP
);

-- Tabela: bairros atendidos
CREATE TABLE bairros_atendidos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prestador_id UUID REFERENCES users(id),
  bairro TEXT NOT NULL
);

-- Inserir serviços disponíveis apenas se não existirem (verificação manual)
INSERT INTO servicos (nome, icone, cor) 
SELECT 'Eletricista', 'flash', '#f97316'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Eletricista');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Encanador', 'water', '#3b82f6'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Encanador');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Diarista', 'broom', '#10b981'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Diarista');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Cabeleireiro(a)', 'scissors', '#f59e0b'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Cabeleireiro(a)');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Pedreiro', 'tools', '#6b7280'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Pedreiro');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Pintor', 'paint', '#8b5cf6'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Pintor');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Jardineiro', 'leaf', '#22c55e'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Jardineiro');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Babá', 'baby', '#ec4899'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Babá');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Cuidador(a) de idosos', 'heart', '#ef4444'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Cuidador(a) de idosos');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Montador de móveis', 'screwdriver', '#84cc16'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Montador de móveis');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Serviços de TI', 'monitor', '#06b6d4'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Serviços de TI');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Serviços de Frete', 'truck', '#f97316'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Serviços de Frete');

INSERT INTO servicos (nome, icone, cor) 
SELECT 'Manutenção de Ar-condicionado', 'snowflake', '#0ea5e9'
WHERE NOT EXISTS (SELECT 1 FROM servicos WHERE nome = 'Manutenção de Ar-condicionado');

-- Ativar RLS nas novas tabelas
ALTER TABLE denuncias ENABLE ROW LEVEL SECURITY;
ALTER TABLE agendamentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE favoritos ENABLE ROW LEVEL SECURITY;
ALTER TABLE historico_servicos ENABLE ROW LEVEL SECURITY;
ALTER TABLE comprovantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE cupons_usados ENABLE ROW LEVEL SECURITY;
ALTER TABLE plano_premium ENABLE ROW LEVEL SECURITY;
ALTER TABLE bairros_atendidos ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Usuários podem ver suas próprias denúncias" ON denuncias
  FOR SELECT USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = denunciante_id)
  );

CREATE POLICY "Usuários podem criar denúncias" ON denuncias
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_id FROM users WHERE id = denunciante_id)
  );

CREATE POLICY "Agendamentos visíveis para partes envolvidas" ON agendamentos
  FOR SELECT USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = solicitante_id)
    OR
    auth.uid() = (SELECT auth_id FROM users WHERE id = prestador_id)
  );

CREATE POLICY "Criar agendamentos próprios" ON agendamentos
  FOR INSERT WITH CHECK (
    auth.uid() = (SELECT auth_id FROM users WHERE id = solicitante_id)
  );

CREATE POLICY "Usuários gerenciam próprios favoritos" ON favoritos
  FOR ALL USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = usuario_id)
  );

CREATE POLICY "Histórico visível para partes envolvidas" ON historico_servicos
  FOR SELECT USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = solicitante_id)
    OR
    auth.uid() = (SELECT auth_id FROM users WHERE id = prestador_id)
  );

CREATE POLICY "Comprovantes visíveis para partes envolvidas" ON comprovantes
  FOR SELECT USING (
    auth.uid() = (
      SELECT auth_id FROM users WHERE id = (
        SELECT solicitante_id FROM historico_servicos WHERE id = comprovantes.historico_id
      )
    )
    OR
    auth.uid() = (
      SELECT auth_id FROM users WHERE id = (
        SELECT prestador_id FROM historico_servicos WHERE id = comprovantes.historico_id
      )
    )
  );

CREATE POLICY "Usuários veem próprios cupons usados" ON cupons_usados
  FOR ALL USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = usuario_id)
  );

CREATE POLICY "Prestadores veem próprio plano premium" ON plano_premium
  FOR ALL USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = prestador_id)
  );

CREATE POLICY "Prestadores gerenciam próprios bairros" ON bairros_atendidos
  FOR ALL USING (
    auth.uid() = (SELECT auth_id FROM users WHERE id = prestador_id)
  );

-- Políticas públicas para visualização
CREATE POLICY "Cupons públicos ativos" ON cupons
  FOR SELECT USING (ativo = true AND (valido_ate IS NULL OR valido_ate >= CURRENT_DATE));

CREATE POLICY "Bairros atendidos são públicos" ON bairros_atendidos
  FOR SELECT USING (true);

CREATE POLICY "Planos premium são públicos" ON plano_premium
  FOR SELECT USING (true);

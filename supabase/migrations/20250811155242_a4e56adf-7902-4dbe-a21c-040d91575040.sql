
-- 1) Tabela de documentos legais (termos e contratos) e políticas RLS

create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  doc_type text not null check (doc_type in ('cliente_termos','prestador_contrato')),
  version text not null,
  content text not null,
  summary text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Garante uma versão única por tipo
create unique index if not exists legal_documents_type_version_uniq
  on public.legal_documents (doc_type, version);

-- Garante apenas um ativo por tipo (índice parcial)
create unique index if not exists legal_documents_one_active_per_type
  on public.legal_documents (doc_type)
  where active = true;

-- Atualiza updated_at automaticamente
drop trigger if exists trg_legal_documents_updated_at on public.legal_documents;
create trigger trg_legal_documents_updated_at
before update on public.legal_documents
for each row
execute function public.update_updated_at_column();

-- Ativa RLS e políticas
alter table public.legal_documents enable row level security;

-- Qualquer usuário (incl. anônimo) pode ler os documentos
drop policy if exists "Public can read legal documents" on public.legal_documents;
create policy "Public can read legal documents"
on public.legal_documents
for select
using (true);

-- Apenas admins/moderadores podem inserir/atualizar/apagar
drop policy if exists "Admins can manage legal documents" on public.legal_documents;
create policy "Admins can manage legal documents"
on public.legal_documents
for all
using (
  exists (
    select 1 from public.users
    where users.auth_id = auth.uid()
      and users.tipo in ('admin','moderator')
  )
)
with check (
  exists (
    select 1 from public.users
    where users.auth_id = auth.uid()
      and users.tipo in ('admin','moderator')
  )
);

-- 2) Tabela de aceites e políticas RLS

create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  doc_id uuid not null references public.legal_documents(id) on delete restrict,
  doc_type text not null check (doc_type in ('cliente_termos','prestador_contrato')),
  version text not null,
  hash text not null,
  accepted_at timestamptz not null default now(),
  ip_address inet,
  user_agent text,
  created_at timestamptz not null default now()
);

-- Evita aceite duplicado por usuário/tipo/versão
create unique index if not exists legal_acceptances_unique_user_version
  on public.legal_acceptances (user_id, doc_type, version);

alter table public.legal_acceptances enable row level security;

-- Usuários podem ver apenas seus próprios aceites
drop policy if exists "Users can read own legal acceptances" on public.legal_acceptances;
create policy "Users can read own legal acceptances"
on public.legal_acceptances
for select
using (user_id = get_current_user_id());

-- Usuários podem registrar seu próprio aceite
drop policy if exists "Users can insert own legal acceptances" on public.legal_acceptances;
create policy "Users can insert own legal acceptances"
on public.legal_acceptances
for insert
with check (user_id = get_current_user_id());

-- Admins podem ver todos os aceites
drop policy if exists "Admins can read all acceptances" on public.legal_acceptances;
create policy "Admins can read all acceptances"
on public.legal_acceptances
for select
using (
  exists (
    select 1 from public.users
    where users.auth_id = auth.uid()
      and users.tipo in ('admin','moderator')
  )
);

-- 3) Opcional: Tabela de verificação do Prestador (KYC simplificado)

create table if not exists public.provider_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  selfie_url text,
  document_url text,
  bank_status text not null default 'pending', -- pending, verified, rejected
  status text not null default 'pending',      -- pending, approved, rejected
  notes text,
  reviewed_by uuid references public.users(id),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists trg_provider_verifications_updated_at on public.provider_verifications;
create trigger trg_provider_verifications_updated_at
before update on public.provider_verifications
for each row
execute function public.update_updated_at_column();

alter table public.provider_verifications enable row level security;

-- Prestador pode ver/gerenciar seu próprio registro
drop policy if exists "Providers manage their own verifications" on public.provider_verifications;
create policy "Providers manage their own verifications"
on public.provider_verifications
for all
using (user_id = get_current_user_id())
with check (user_id = get_current_user_id());

-- Admins podem gerenciar todos
drop policy if exists "Admins manage all verifications" on public.provider_verifications;
create policy "Admins manage all verifications"
on public.provider_verifications
for all
using (
  exists (
    select 1 from public.users
    where users.auth_id = auth.uid()
      and users.tipo in ('admin','moderator')
  )
)
with check (
  exists (
    select 1 from public.users
    where users.auth_id = auth.uid()
      and users.tipo in ('admin','moderator')
  )
);

-- 4) Conteúdo inicial dos documentos (versão ativa)

-- Termos completos – Cliente (conteúdo integral fornecido)
insert into public.legal_documents (doc_type, version, content, summary, active)
values (
  'cliente_termos',
  'v1-2025-08-11',
  $$TERMO DE USO – CLIENTE

1. Objeto
O Zurbo é uma plataforma online que conecta clientes a prestadores de serviços autônomos, permitindo a solicitação, agendamento e pagamento de serviços.

2. Cadastro e Acesso
- O usuário deve fornecer informações verídicas.
- O uso é restrito a maiores de 18 anos ou emancipados legalmente.
- É vedada a criação de contas múltiplas para fins abusivos.

3. Pagamentos
- Os pagamentos são processados via Stripe (escrow), liberados ao prestador somente após a conclusão confirmada do serviço.
- Cancelamentos seguem a política de reembolso publicada.

4. Limites de uso
- Cada cliente pode criar até 3 pedidos por hora. Após exceder, será bloqueado por 6h, com opção de contato com o suporte.

5. Responsabilidades do Cliente
- Fornecer informações corretas sobre o serviço solicitado.
- Não contratar serviços ilícitos, perigosos ou proibidos por lei.
- Respeitar prestadores e demais usuários, evitando comportamento abusivo.

6. Garantias e Limitações
- O Zurbo não garante a qualidade do serviço prestado, que é de responsabilidade exclusiva do prestador.
- O Zurbo poderá intermediar disputas, mas não se responsabiliza por danos diretos ou indiretos decorrentes do serviço.

7. Privacidade
- Os dados do usuário serão tratados conforme a LGPD.
- Informações pessoais só serão compartilhadas quando estritamente necessário para execução do serviço.

8. Penalidades
- Violação das regras poderá resultar em suspensão ou banimento.
- Tentativas de pagamento por fora da plataforma resultarão em bloqueio imediato.

9. Alterações
- O Zurbo poderá atualizar estes termos, notificando o usuário com antecedência mínima de 10 dias.$$,
  $$Cliente – Resumo
- O Zurbo conecta clientes a prestadores autônomos.
- Pagamento seguro via Stripe Escrow.
- Máx. 3 pedidos/hora; exceder = bloqueio 6h.
- Cancelamentos e reembolsos seguem regras publicadas.
- Uso abusivo pode gerar banimento.

[Ver versão completa]$$,
  true
)
on conflict (doc_type, version) do nothing;

-- Contrato completo – Prestador (ajustado com comissão de 8%)
insert into public.legal_documents (doc_type, version, content, summary, active)
values (
  'prestador_contrato',
  'v1-2025-08-11',
  $$CONTRATO DE PRESTAÇÃO DE SERVIÇOS AUTÔNOMOS – PRESTADOR

1. Objeto
O presente contrato regula a atuação do prestador de serviços como usuário da plataforma Zurbo.

2. Natureza da Relação
- O prestador atua de forma autônoma, sem vínculo empregatício com o Zurbo.
- O Zurbo é apenas intermediador tecnológico e processador de pagamentos.

3. Cadastro e Validação
O prestador deve fornecer:
- Documento oficial com foto
- Selfie para verificação facial
- Dados bancários válidos
A conta só será liberada para receber chamados após validação dos documentos.

4. Pagamentos
- Processados via Stripe Escrow.
- Liberação até 5 dias úteis após a conclusão confirmada do serviço.
- Comissão do Zurbo: 8% sobre o valor do serviço.
- Pagamentos por fora resultam em:
  * Bloqueio de conta
  * Multa de 20% sobre o valor estimado
- Dados bancários devem estar sempre atualizados.

5. Obrigações do Prestador
- Comparecer aos serviços aceitos ou cancelar com antecedência mínima definida.
- Cumprir com a qualidade e especificações combinadas.
- Não oferecer serviços ilícitos.

6. Penalidades
- Faltas não justificadas → multa de X% sobre o valor do serviço.
- Reclamações recorrentes de má conduta ou qualidade → suspensão ou banimento.

7. Disputas
- Em caso de divergência, o valor ficará retido até resolução pela equipe do Zurbo.

8. Alterações
- O Zurbo poderá atualizar este contrato, com aviso prévio de 10 dias.$$,
  $$Prestador – Resumo
- Atuação como autônomo, sem vínculo empregatício.
- Recebe via Stripe Escrow, após prazo de segurança.
- Comissão do Zurbo: 8% do valor.
- Necessário validar documentos antes de receber pedidos.
- Pagamentos por fora → multa e banimento.

[Ver versão completa]$$,
  true
)
on conflict (doc_type, version) do nothing;

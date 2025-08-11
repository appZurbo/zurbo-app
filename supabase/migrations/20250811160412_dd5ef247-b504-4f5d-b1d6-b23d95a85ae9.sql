-- Enable extension for UUID generation
create extension if not exists pgcrypto;

-- 1) Legal documents table
create table if not exists public.legal_documents (
  id uuid primary key default gen_random_uuid(),
  doc_type text not null check (doc_type in ('cliente_termos','prestador_contrato')),
  version text not null,
  content text not null,
  summary text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (doc_type, version)
);

-- Indexes
create index if not exists idx_legal_documents_doc_type on public.legal_documents(doc_type);
create unique index if not exists uq_legal_documents_active_one_per_type
  on public.legal_documents(doc_type)
  where active is true;

-- RLS
alter table public.legal_documents enable row level security;
-- Anyone (even anon) can read legal documents
create policy if not exists "Legal documents are publicly readable"
  on public.legal_documents for select
  using (true);

-- 2) Legal acceptances table
create table if not exists public.legal_acceptances (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  doc_id uuid not null references public.legal_documents(id) on delete cascade,
  doc_type text not null check (doc_type in ('cliente_termos','prestador_contrato')),
  version text not null,
  hash text not null,
  ip_address text,
  user_agent text,
  accepted_at timestamptz not null default now(),
  unique (user_id, doc_type, version)
);

create index if not exists idx_legal_acceptances_user on public.legal_acceptances(user_id);
create index if not exists idx_legal_acceptances_doc on public.legal_acceptances(doc_type, version);

-- Validation trigger to ensure doc_id matches doc_type/version
create or replace function public.validate_legal_acceptance()
returns trigger as $$
begin
  -- Ensure the referenced document exists and matches provided doc_type/version
  if not exists (
    select 1 from public.legal_documents d
    where d.id = new.doc_id
      and d.doc_type = new.doc_type
      and d.version = new.version
  ) then
    raise exception 'Documento legal (doc_id) não corresponde a doc_type/version informados';
  end if;
  return new;
end;
$$ language plpgsql security definer set search_path = public;

create trigger trg_validate_legal_acceptance
before insert on public.legal_acceptances
for each row execute function public.validate_legal_acceptance();

-- RLS
alter table public.legal_acceptances enable row level security;
-- Users can read their own acceptances
create policy if not exists "Users can read their own legal acceptances"
  on public.legal_acceptances for select
  using (auth.uid() = user_id);
-- Users can create their own legal acceptances
create policy if not exists "Users can create their own legal acceptances"
  on public.legal_acceptances for insert
  with check (auth.uid() = user_id);

-- 3) Provider verifications table
create table if not exists public.provider_verifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  doc_image_url text,
  selfie_url text,
  bank_account text,
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  rejection_reason text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- updated_at trigger
create or replace function public.set_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_provider_verifications_set_updated_at
before update on public.provider_verifications
for each row execute function public.set_updated_at_column();

-- RLS for provider_verifications
alter table public.provider_verifications enable row level security;
create policy if not exists "Providers can read their verification"
  on public.provider_verifications for select
  using (auth.uid() = user_id);
create policy if not exists "Providers can create their verification"
  on public.provider_verifications for insert
  with check (auth.uid() = user_id);
create policy if not exists "Providers can update their verification"
  on public.provider_verifications for update
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Seed initial legal documents (active)
insert into public.legal_documents (doc_type, version, content, summary, active)
values
  (
    'cliente_termos',
    '2025-08-11',
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
- O Zurbo poderá atualizar estes termos, notificando o usuário com antecedência mínima de 10 dias.
$$,
    $$Cliente – Resumo\n\n- O Zurbo conecta clientes a prestadores autônomos.\n- Pagamento seguro via Stripe Escrow.\n- Máx. 3 pedidos/hora; exceder = bloqueio 6h.\n- Cancelamentos e reembolsos seguem regras publicadas.\n- Uso abusivo pode gerar banimento.\n\n[Ver versão completa]$$,
    true
  ),
  (
    'prestador_contrato',
    '2025-08-11',
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
  • Bloqueio de conta
  • Multa de 20% sobre o valor estimado
- Dados bancários devem estar sempre atualizados.

5. Obrigações do Prestador
- Comparecer aos serviços aceitos ou cancelar com antecedência mínima definida.
- Cumprir com a qualidade e especificações combinadas.
- Não oferecer serviços ilícitos.

6. Penalidades
- Faltas não justificadas → multa de X% sobre o valor do serviço.
- Reclamações recorrentes de má conduta ou qualidade → suspensão ou banimento.

7. Disputas
Em caso de divergência, o valor ficará retido até resolução pela equipe do Zurbo.

8. Alterações
O Zurbo poderá atualizar este contrato, com aviso prévio de 10 dias.
$$,
    $$Prestador – Resumo\n\n- Atuação como autônomo, sem vínculo empregatício.\n- Recebe via Stripe Escrow, após prazo de segurança.\n- Comissão do Zurbo: 8% do valor.\n- Necessário validar documentos antes de receber pedidos.\n- Pagamentos por fora → multa e banimento.\n\n[Ver versão completa]$$,
    true
  )
  on conflict (doc_type, version) do nothing;
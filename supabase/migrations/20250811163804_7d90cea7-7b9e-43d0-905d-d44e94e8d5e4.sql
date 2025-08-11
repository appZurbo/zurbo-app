
-- 1) Buckets privados para verificação e backups (idempotente)
insert into storage.buckets (id, name, public)
values ('provider-verifications', 'provider-verifications', false)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('provider-backups', 'provider-backups', false)
on conflict (id) do nothing;

-- 2) Políticas de Storage para provider-verifications
-- Prestadores podem enviar (INSERT) apenas para sua própria pasta: {user_id}/...
create policy "Providers can upload own verification files"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'provider-verifications'
  and storage.foldername(name) = public.get_current_user_id()::text
);

-- Prestadores podem ler (SELECT) apenas seus próprios arquivos
create policy "Providers can read own verification files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'provider-verifications'
  and storage.foldername(name) = public.get_current_user_id()::text
);

-- Prestadores podem atualizar (UPDATE) apenas seus próprios arquivos
create policy "Providers can update own verification files"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'provider-verifications'
  and storage.foldername(name) = public.get_current_user_id()::text
)
with check (
  bucket_id = 'provider-verifications'
  and storage.foldername(name) = public.get_current_user_id()::text
);

-- Prestadores podem excluir (DELETE) apenas seus próprios arquivos
create policy "Providers can delete own verification files"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'provider-verifications'
  and storage.foldername(name) = public.get_current_user_id()::text
);

-- Admins podem ler (SELECT) todos os arquivos de verificação
create policy "Admins can read verification files"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'provider-verifications'
  and public.is_admin()
);

-- Admins podem gerenciar (ALL) arquivos de verificação
create policy "Admins can manage verification files"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'provider-verifications'
  and public.is_admin()
)
with check (
  bucket_id = 'provider-verifications'
  and public.is_admin()
);

-- 3) Políticas de Storage para provider-backups
-- Apenas Admins podem ler/gerenciar backups (inserções serão feitas por Edge Function com service role)
create policy "Admins can read backups"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'provider-backups'
  and public.is_admin()
);

create policy "Admins can manage backups"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'provider-backups'
  and public.is_admin()
)
with check (
  bucket_id = 'provider-backups'
  and public.is_admin()
);

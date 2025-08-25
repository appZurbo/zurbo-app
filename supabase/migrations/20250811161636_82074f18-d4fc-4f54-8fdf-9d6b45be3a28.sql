-- Create helper function first
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  select exists (
    select 1 from public.users
    where auth_id = auth.uid()
      and tipo in ('admin','moderator')
  );
$$;
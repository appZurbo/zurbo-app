-- 1) Drop public read policy on users for prestadores
DROP POLICY IF EXISTS "Público pode ver prestadores" ON public.users;

-- 2) Create policy: only authenticated can view prestadores
CREATE POLICY "Authenticated can view prestadores"
ON public.users
FOR SELECT
TO authenticated
USING (tipo = 'prestador');

-- 3) Create helper function to detect admins (avoids recursion in policies elsewhere)
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

-- 4) Allow admins to view all users
CREATE POLICY IF NOT EXISTS "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (public.is_admin());
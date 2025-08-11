-- Drop public policy if still present
DROP POLICY IF EXISTS "Público pode ver prestadores" ON public.users;

-- Create auth-only view policy
CREATE POLICY "Authenticated can view prestadores"
ON public.users
FOR SELECT
TO authenticated
USING (tipo = 'prestador');

-- Admin full read
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (public.is_admin());
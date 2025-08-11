-- Re-run without IF NOT EXISTS
CREATE POLICY "Admins can view all users"
ON public.users
FOR SELECT
TO authenticated
USING (public.is_admin());
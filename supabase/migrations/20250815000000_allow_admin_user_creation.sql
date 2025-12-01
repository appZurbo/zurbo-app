-- Allow admins to insert new users (for test data generation)
CREATE POLICY "Admins can insert users" 
ON public.users 
FOR INSERT 
WITH CHECK (public.is_admin());

-- Allow admins to update any user
CREATE POLICY "Admins can update any user" 
ON public.users 
FOR UPDATE 
USING (public.is_admin());

-- Ensure is_admin function exists and is accessible
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM public.users
    WHERE auth_id = auth.uid()
    AND tipo = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;



-- Fix critical RLS issues for users table
CREATE POLICY "Users can view their own profile" 
  ON public.users 
  FOR SELECT 
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can update their own profile" 
  ON public.users 
  FOR UPDATE 
  USING (auth.uid() = auth_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.users 
  FOR INSERT 
  WITH CHECK (auth.uid() = auth_id);

CREATE POLICY "Public can view prestador basic info" 
  ON public.users 
  FOR SELECT 
  USING (tipo = 'prestador');

-- Remove dangerous overly permissive policies and replace with proper ones
DROP POLICY IF EXISTS "Authenticated users can view services prestados" ON public.servicos_prestados;
DROP POLICY IF EXISTS "Authenticated users can insert services prestados" ON public.servicos_prestados;
DROP POLICY IF EXISTS "Authenticated users can update services prestados" ON public.servicos_prestados;
DROP POLICY IF EXISTS "Authenticated users can delete services prestados" ON public.servicos_prestados;

-- Replace with secure policies for servicos_prestados
CREATE POLICY "Prestadores can manage own services" 
  ON public.servicos_prestados 
  FOR ALL 
  USING (prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Public can view services prestados" 
  ON public.servicos_prestados 
  FOR SELECT 
  USING (true);

-- Secure policies for pagamentos_pix
CREATE POLICY "Users can view own payments" 
  ON public.pagamentos_pix 
  FOR SELECT 
  USING (solicitante_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) 
         OR prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create payments they initiate" 
  ON public.pagamentos_pix 
  FOR INSERT 
  WITH CHECK (solicitante_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Add unique constraint for CPF to prevent duplicates
ALTER TABLE public.users ADD CONSTRAINT unique_cpf UNIQUE (cpf);

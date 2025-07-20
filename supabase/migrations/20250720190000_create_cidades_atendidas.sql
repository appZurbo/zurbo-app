
-- Create table for cities served by providers
CREATE TABLE public.cidades_atendidas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prestador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  cidade TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add Row Level Security (RLS)
ALTER TABLE public.cidades_atendidas ENABLE ROW LEVEL SECURITY;

-- Create policy that allows providers to manage their own served cities
CREATE POLICY "Prestadores podem gerenciar próprias cidades" 
  ON public.cidades_atendidas 
  FOR ALL 
  USING (prestador_id IN (
    SELECT id FROM public.users WHERE auth_id = auth.uid()
  ));

-- Create policy that allows public to view served cities
CREATE POLICY "Cidades atendidas são públicas" 
  ON public.cidades_atendidas 
  FOR SELECT 
  USING (true);

-- Create index for better performance
CREATE INDEX idx_cidades_atendidas_prestador_id ON public.cidades_atendidas(prestador_id);
CREATE INDEX idx_cidades_atendidas_cidade ON public.cidades_atendidas(cidade);

-- Migrate existing data from bairros_atendidos to cidades_atendidas
-- Convert bairros to cities based on common associations
INSERT INTO public.cidades_atendidas (prestador_id, cidade)
SELECT DISTINCT 
  ba.prestador_id,
  'Sinop, Mato Grosso' as cidade
FROM public.bairros_atendidos ba
ON CONFLICT DO NOTHING;

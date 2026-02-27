-- SQL para criar a tabela de analytics real
-- Execute esto no Editor SQL do Supabase

CREATE TABLE IF NOT EXISTS public.site_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    page_path TEXT NOT NULL,
    referrer TEXT,
    device_type TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Segurança)
ALTER TABLE public.site_analytics ENABLE ROW LEVEL SECURITY;

-- Permitir que qualquer pessoa insira dados (rastreamento anônimo)
CREATE POLICY "Permitir inserção anônima de analytics" 
ON public.site_analytics 
FOR INSERT 
WITH CHECK (true);

-- Apenas admins podem ler os dados
CREATE POLICY "Apenas admins podem ler analytics" 
ON public.site_analytics 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

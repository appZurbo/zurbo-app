
-- Create the pedidos table
CREATE TABLE public.pedidos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES public.users(id) NOT NULL,
  prestador_id UUID REFERENCES public.users(id) NOT NULL,
  servico_id UUID REFERENCES public.servicos(id) NOT NULL,
  titulo TEXT NOT NULL,
  descricao TEXT,
  preco_acordado NUMERIC,
  status TEXT NOT NULL DEFAULT 'pendente' CHECK (status IN ('pendente', 'aceito', 'em_andamento', 'concluido', 'cancelado')),
  data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_conclusao TIMESTAMP WITH TIME ZONE,
  endereco_completo TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on pedidos table
ALTER TABLE public.pedidos ENABLE ROW LEVEL SECURITY;

-- Create policies for pedidos
CREATE POLICY "Users can view their own pedidos as cliente" 
  ON public.pedidos 
  FOR SELECT 
  USING (cliente_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can view their own pedidos as prestador" 
  ON public.pedidos 
  FOR SELECT 
  USING (prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create pedidos as cliente" 
  ON public.pedidos 
  FOR INSERT 
  WITH CHECK (cliente_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update their own pedidos as cliente" 
  ON public.pedidos 
  FOR UPDATE 
  USING (cliente_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update their own pedidos as prestador" 
  ON public.pedidos 
  FOR UPDATE 
  USING (prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Add trigger to update updated_at column
CREATE TRIGGER update_pedidos_updated_at 
  BEFORE UPDATE ON public.pedidos 
  FOR EACH ROW 
  EXECUTE FUNCTION public.update_updated_at_column();

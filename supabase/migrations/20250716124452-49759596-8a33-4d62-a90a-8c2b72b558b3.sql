
-- Add payment confirmation fields to pedidos table
ALTER TABLE public.pedidos 
ADD COLUMN IF NOT EXISTS cliente_confirmou BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS prestador_confirmou BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS status_pagamento TEXT DEFAULT 'pendente' CHECK (status_pagamento IN ('pendente', 'pago_em_escrow', 'liberado', 'cancelado'));

-- Add stripe_account_id to users table for providers
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;

-- Update escrow_payments table to include zurbo_fee field if missing
ALTER TABLE public.escrow_payments 
ADD COLUMN IF NOT EXISTS zurbo_fee NUMERIC DEFAULT 0;

-- Create index for better performance on payment queries
CREATE INDEX IF NOT EXISTS idx_pedidos_status_pagamento ON public.pedidos(status_pagamento);
CREATE INDEX IF NOT EXISTS idx_users_stripe_account ON public.users(stripe_account_id);

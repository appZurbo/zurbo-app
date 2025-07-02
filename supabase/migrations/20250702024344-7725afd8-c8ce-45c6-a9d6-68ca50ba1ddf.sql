
-- Create stripe_accounts table
CREATE TABLE public.stripe_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  stripe_account_id TEXT NOT NULL UNIQUE,
  account_type TEXT NOT NULL DEFAULT 'express',
  charges_enabled BOOLEAN NOT NULL DEFAULT false,
  details_submitted BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create usage_limits table
CREATE TABLE public.usage_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  service_requests_hour INTEGER NOT NULL DEFAULT 0,
  service_requests_day INTEGER NOT NULL DEFAULT 0,
  active_requests INTEGER NOT NULL DEFAULT 0,
  last_request_at TIMESTAMP WITH TIME ZONE,
  blocked_until TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) for stripe_accounts
ALTER TABLE public.stripe_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for stripe_accounts - users can manage their own accounts
CREATE POLICY "Users can manage their own stripe accounts" 
  ON public.stripe_accounts 
  FOR ALL 
  USING (user_id = get_current_user_id());

-- Add Row Level Security (RLS) for usage_limits
ALTER TABLE public.usage_limits ENABLE ROW LEVEL SECURITY;

-- Create policy for usage_limits - users can manage their own limits
CREATE POLICY "Users can manage their own usage limits" 
  ON public.usage_limits 
  FOR ALL 
  USING (user_id = get_current_user_id());

-- Create indexes for better performance
CREATE INDEX idx_stripe_accounts_user_id ON public.stripe_accounts(user_id);
CREATE INDEX idx_stripe_accounts_stripe_account_id ON public.stripe_accounts(stripe_account_id);
CREATE INDEX idx_usage_limits_user_id ON public.usage_limits(user_id);

-- Add trigger to update updated_at timestamp for stripe_accounts
CREATE TRIGGER update_stripe_accounts_updated_at
  BEFORE UPDATE ON public.stripe_accounts
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Add trigger to update updated_at timestamp for usage_limits
CREATE TRIGGER update_usage_limits_updated_at
  BEFORE UPDATE ON public.usage_limits
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

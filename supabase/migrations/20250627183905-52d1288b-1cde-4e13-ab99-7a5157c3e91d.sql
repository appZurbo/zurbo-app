
-- Create enhanced chat and messaging tables with proper relationships
CREATE TABLE IF NOT EXISTS public.chat_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  prestador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  servico_solicitado TEXT NOT NULL,
  preco_proposto DECIMAL(10,2),
  status TEXT CHECK (status IN ('aguardando_preco', 'preco_definido', 'aceito', 'rejeitado', 'bloqueado')) DEFAULT 'aguardando_preco',
  pedido_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(cliente_id, prestador_id)
);

-- Create enhanced messages table
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  message_type TEXT CHECK (message_type IN ('text', 'image', 'system')) DEFAULT 'text',
  content TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create image upload tracking table
CREATE TABLE IF NOT EXISTS public.daily_image_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  upload_date DATE DEFAULT CURRENT_DATE,
  upload_count INTEGER DEFAULT 0,
  UNIQUE(user_id, upload_date)
);

-- Create user reports table
CREATE TABLE IF NOT EXISTS public.user_chat_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reported_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES public.chat_conversations(id) ON DELETE CASCADE,
  issue_type TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create SOS usage tracking table
CREATE TABLE IF NOT EXISTS public.sos_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  usage_month DATE DEFAULT DATE_TRUNC('month', CURRENT_DATE),
  usage_count INTEGER DEFAULT 0,
  UNIQUE(user_id, usage_month)
);

-- Enable RLS on all tables
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_image_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_chat_reports ENABLE ROW LEVEL SECURITY; 
ALTER TABLE public.sos_usage ENABLE ROW LEVEL SECURITY;

-- Create security definer functions to avoid RLS recursion
CREATE OR REPLACE FUNCTION public.get_current_user_id()
RETURNS UUID AS $$
  SELECT id FROM public.users WHERE auth_id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- RLS Policies for chat_conversations
CREATE POLICY "Users can view their own conversations" 
  ON public.chat_conversations 
  FOR SELECT 
  USING (cliente_id = public.get_current_user_id() OR prestador_id = public.get_current_user_id());

CREATE POLICY "Users can create conversations" 
  ON public.chat_conversations 
  FOR INSERT 
  WITH CHECK (cliente_id = public.get_current_user_id() OR prestador_id = public.get_current_user_id());

CREATE POLICY "Users can update their own conversations" 
  ON public.chat_conversations 
  FOR UPDATE 
  USING (cliente_id = public.get_current_user_id() OR prestador_id = public.get_current_user_id());

-- RLS Policies for chat_messages
CREATE POLICY "Users can view messages from their conversations" 
  ON public.chat_messages 
  FOR SELECT 
  USING (conversation_id IN (
    SELECT id FROM public.chat_conversations 
    WHERE cliente_id = public.get_current_user_id() OR prestador_id = public.get_current_user_id()
  ));

CREATE POLICY "Users can send messages in their conversations" 
  ON public.chat_messages 
  FOR INSERT 
  WITH CHECK (sender_id = public.get_current_user_id() AND conversation_id IN (
    SELECT id FROM public.chat_conversations 
    WHERE cliente_id = public.get_current_user_id() OR prestador_id = public.get_current_user_id()
  ));

-- RLS Policies for daily_image_uploads
CREATE POLICY "Users can manage their own image uploads" 
  ON public.daily_image_uploads 
  FOR ALL 
  USING (user_id = public.get_current_user_id());

-- RLS Policies for user_chat_reports
CREATE POLICY "Users can create reports" 
  ON public.user_chat_reports 
  FOR INSERT 
  WITH CHECK (reporter_id = public.get_current_user_id());

CREATE POLICY "Admins can view all reports" 
  ON public.user_chat_reports 
  FOR SELECT 
  USING ((SELECT tipo FROM public.users WHERE id = public.get_current_user_id()) IN ('admin', 'moderator'));

-- RLS Policies for sos_usage
CREATE POLICY "Users can manage their own SOS usage" 
  ON public.sos_usage 
  FOR ALL 
  USING (user_id = public.get_current_user_id());

-- Update existing users table RLS policy to use security definer function
DROP POLICY IF EXISTS "Users can view and update their own profile" ON public.users;
CREATE POLICY "Users can view and update their own profile" 
  ON public.users 
  FOR ALL 
  USING (auth_id = (SELECT auth.uid()));

-- Create function to update conversation timestamp on new message
CREATE OR REPLACE FUNCTION update_conversation_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chat_conversations 
  SET updated_at = now()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updating conversation timestamp
CREATE TRIGGER trigger_update_conversation_timestamp
  AFTER INSERT ON public.chat_messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_timestamp();

-- Create storage bucket for chat images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'chat-images', 
  'chat-images', 
  true, 
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies for chat images
CREATE POLICY "Users can upload chat images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'chat-images' AND auth.role() = 'authenticated');

CREATE POLICY "Chat images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'chat-images');

CREATE POLICY "Users can update their own chat images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own chat images"
ON storage.objects FOR DELETE
USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

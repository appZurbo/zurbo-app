
-- Criar tabela de notificações
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT CHECK (type IN ('new_client', 'new_review', 'new_message', 'system_update')) DEFAULT 'system_update',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de chats
CREATE TABLE IF NOT EXISTS public.chats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  prestador_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  last_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de mensagens
CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES public.chats(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de relatórios de usuários
CREATE TABLE IF NOT EXISTS public.user_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reported_user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reporter_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('inappropriate_content', 'spam', 'harassment', 'fake_profile')) NOT NULL,
  description TEXT NOT NULL,
  status TEXT CHECK (status IN ('pending', 'reviewed', 'resolved')) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de banimentos de usuários
CREATE TABLE IF NOT EXISTS public.user_bans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  banned_by UUID REFERENCES public.users(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de configurações do sistema
CREATE TABLE IF NOT EXISTS public.system_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES public.users(id),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Criar tabela de preferências de notificação
CREATE TABLE IF NOT EXISTS public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE UNIQUE,
  email_novos_pedidos BOOLEAN DEFAULT true,
  email_mensagens BOOLEAN DEFAULT true,
  email_avaliacoes BOOLEAN DEFAULT true,
  push_novos_pedidos BOOLEAN DEFAULT true,
  push_mensagens BOOLEAN DEFAULT true,
  push_avaliacoes BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Habilitar RLS para todas as tabelas
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_bans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;

-- Políticas para notificações
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications 
  FOR SELECT 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications 
  FOR UPDATE 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Políticas para chats
CREATE POLICY "Users can view their own chats" 
  ON public.chats 
  FOR SELECT 
  USING (cliente_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) 
         OR prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can create chats" 
  ON public.chats 
  FOR INSERT 
  WITH CHECK (cliente_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) 
              OR prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Users can update their own chats" 
  ON public.chats 
  FOR UPDATE 
  USING (cliente_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) 
         OR prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Políticas para mensagens
CREATE POLICY "Users can view messages from their chats" 
  ON public.messages 
  FOR SELECT 
  USING (chat_id IN (
    SELECT id FROM public.chats 
    WHERE cliente_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) 
       OR prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
  ));

CREATE POLICY "Users can send messages in their chats" 
  ON public.messages 
  FOR INSERT 
  WITH CHECK (sender_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
              AND chat_id IN (
                SELECT id FROM public.chats 
                WHERE cliente_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()) 
                   OR prestador_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid())
              ));

-- Políticas para relatórios (apenas admins podem ver todos)
CREATE POLICY "Users can create reports" 
  ON public.user_reports 
  FOR INSERT 
  WITH CHECK (reporter_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

CREATE POLICY "Admins can view all reports" 
  ON public.user_reports 
  FOR SELECT 
  USING ((SELECT tipo FROM public.users WHERE auth_id = auth.uid()) IN ('admin', 'moderator'));

CREATE POLICY "Admins can update reports" 
  ON public.user_reports 
  FOR UPDATE 
  USING ((SELECT tipo FROM public.users WHERE auth_id = auth.uid()) IN ('admin', 'moderator'));

-- Políticas para banimentos (apenas admins)
CREATE POLICY "Admins can manage bans" 
  ON public.user_bans 
  FOR ALL 
  USING ((SELECT tipo FROM public.users WHERE auth_id = auth.uid()) IN ('admin', 'moderator'));

-- Políticas para configurações do sistema (apenas admins)
CREATE POLICY "Admins can manage system settings" 
  ON public.system_settings 
  FOR ALL 
  USING ((SELECT tipo FROM public.users WHERE auth_id = auth.uid()) IN ('admin', 'moderator'));

-- Políticas para preferências de notificação
CREATE POLICY "Users can manage their own notification preferences" 
  ON public.notification_preferences 
  FOR ALL 
  USING (user_id IN (SELECT id FROM public.users WHERE auth_id = auth.uid()));

-- Trigger para atualizar last_message nos chats
CREATE OR REPLACE FUNCTION update_chat_last_message()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.chats 
  SET last_message = NEW.content, updated_at = now()
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_chat_last_message
  AFTER INSERT ON public.messages
  FOR EACH ROW EXECUTE FUNCTION update_chat_last_message();

-- Inserir algumas configurações padrão do sistema
INSERT INTO public.system_settings (key, value, description) VALUES
  ('maintenance_mode', 'false', 'Ativar modo de manutenção'),
  ('max_file_size', '10485760', 'Tamanho máximo de arquivo em bytes (10MB)'),
  ('registration_enabled', 'true', 'Permitir novos registros'),
  ('email_notifications', 'true', 'Enviar notificações por email')
ON CONFLICT (key) DO NOTHING;

-- Criar bucket para portfolio se não existir
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'portfolio', 
  'portfolio', 
  true, 
  10485760, -- 10MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Políticas para o bucket portfolio
CREATE POLICY "Users can upload their own portfolio images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'portfolio' AND auth.role() = 'authenticated');

CREATE POLICY "Portfolio images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'portfolio');

CREATE POLICY "Users can update their own portfolio images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own portfolio images"
ON storage.objects FOR DELETE
USING (bucket_id = 'portfolio' AND auth.uid()::text = (storage.foldername(name))[1]);


-- Enable realtime for chat messages
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;

-- Enable realtime for chat conversations
ALTER TABLE public.chat_conversations REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_conversations;

-- Add RLS policies for chat messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view messages in their conversations" ON public.chat_messages
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.chat_conversations 
    WHERE id = conversation_id 
    AND (cliente_id = auth.uid() OR prestador_id = auth.uid())
  )
);

CREATE POLICY "Users can insert messages in their conversations" ON public.chat_messages
FOR INSERT WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chat_conversations 
    WHERE id = conversation_id 
    AND (cliente_id = auth.uid() OR prestador_id = auth.uid())
  )
);

-- Add RLS policies for chat conversations
ALTER TABLE public.chat_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their conversations" ON public.chat_conversations
FOR SELECT USING (cliente_id = auth.uid() OR prestador_id = auth.uid());

CREATE POLICY "Users can update their conversations" ON public.chat_conversations
FOR UPDATE USING (cliente_id = auth.uid() OR prestador_id = auth.uid());

CREATE POLICY "Users can create conversations" ON public.chat_conversations
FOR INSERT WITH CHECK (cliente_id = auth.uid() OR prestador_id = auth.uid());

-- Update all users to have premium status
UPDATE public.users SET premium = true;

-- Add premium records for all users
INSERT INTO public.usuarios_premium (usuario_id, ativo, desde, expira_em)
SELECT id, true, now(), now() + interval '30 days'
FROM public.users
WHERE NOT EXISTS (
  SELECT 1 FROM public.usuarios_premium WHERE usuario_id = users.id
);

-- Add service status field for providers
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS em_servico boolean DEFAULT true;
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS descricao_servico text;

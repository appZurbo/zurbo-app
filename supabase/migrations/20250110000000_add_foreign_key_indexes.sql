-- Add indexes for foreign keys to improve performance
-- Based on audit findings: 38+ FKs without indexes

-- Chat system performance improvements
CREATE INDEX IF NOT EXISTS idx_chat_messages_conversation_id ON public.chat_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_sender_id ON public.chat_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_cliente_id ON public.chat_conversations(cliente_id);
CREATE INDEX IF NOT EXISTS idx_chat_conversations_prestador_id ON public.chat_conversations(prestador_id);

-- Order management performance improvements
CREATE INDEX IF NOT EXISTS idx_pedidos_cliente_id ON public.pedidos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_prestador_id ON public.pedidos(prestador_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_servico_id ON public.pedidos(servico_id);
CREATE INDEX IF NOT EXISTS idx_pedidos_status ON public.pedidos(status);

-- Transaction system performance improvements
CREATE INDEX IF NOT EXISTS idx_escrow_payments_user_id ON public.escrow_payments(user_id);
CREATE INDEX IF NOT EXISTS idx_escrow_payments_conversation_id ON public.escrow_payments(conversation_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);

-- User and profile performance improvements
CREATE INDEX IF NOT EXISTS idx_prestador_servicos_servico_id ON public.prestador_servicos(servico_id);
CREATE INDEX IF NOT EXISTS idx_prestador_servicos_prestador_id ON public.prestador_servicos(prestador_id);

-- Rating system performance improvements
CREATE INDEX IF NOT EXISTS idx_avaliacoes_avaliador_id ON public.avaliacoes(avaliador_id);
CREATE INDEX IF NOT EXISTS idx_avaliacoes_avaliado_id ON public.avaliacoes(avaliado_id);

-- Admin and moderation performance improvements
CREATE INDEX IF NOT EXISTS idx_user_reports_reported_user_id ON public.user_reports(reported_user_id);
CREATE INDEX IF NOT EXISTS idx_user_reports_reporter_id ON public.user_reports(reporter_id);
CREATE INDEX IF NOT EXISTS idx_user_bans_user_id ON public.user_bans(user_id);

-- Notification system performance improvements
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- Favorites and location performance improvements
CREATE INDEX IF NOT EXISTS idx_favoritos_user_id ON public.favoritos(user_id);
CREATE INDEX IF NOT EXISTS idx_favoritos_prestador_id ON public.favoritos(prestador_id);

-- Portfolio performance improvements
CREATE INDEX IF NOT EXISTS idx_portfolio_fotos_prestador_id ON public.portfolio_fotos(prestador_id);

-- Premium system performance improvements
CREATE INDEX IF NOT EXISTS idx_usuarios_premium_usuario_id ON public.usuarios_premium(usuario_id);

-- Location-based performance improvements
CREATE INDEX IF NOT EXISTS idx_bairros_atendidos_prestador_id ON public.bairros_atendidos(prestador_id);
CREATE INDEX IF NOT EXISTS idx_cidades_atendidas_prestador_id ON public.cidades_atendidas(prestador_id);

-- Appointment system performance improvements
CREATE INDEX IF NOT EXISTS idx_agendamentos_cliente_id ON public.agendamentos(cliente_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_prestador_id ON public.agendamentos(prestador_id);
CREATE INDEX IF NOT EXISTS idx_agendamentos_servico_id ON public.agendamentos(servico_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_pedidos_status_pagamento ON public.pedidos(status_pagamento) WHERE status_pagamento IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_premium_active ON public.usuarios_premium(ativo) WHERE ativo = true;

-- Comments
COMMENT ON INDEX idx_chat_messages_conversation_id IS 'Performance index for chat message queries by conversation';
COMMENT ON INDEX idx_pedidos_status IS 'Performance index for order status filtering';
COMMENT ON INDEX idx_escrow_payments_conversation_id IS 'Performance index for escrow payment lookups';
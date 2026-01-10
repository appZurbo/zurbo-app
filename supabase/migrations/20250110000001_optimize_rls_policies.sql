-- Optimize RLS policies performance by reducing auth.uid() calls
-- Based on audit: 47+ policies with performance issues

-- ============================================
-- USERS TABLE RLS OPTIMIZATION
-- ============================================

-- Drop existing inefficient policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.users;

-- Create optimized policies using subqueries to reduce auth.uid() calls
CREATE POLICY "users_select_policy" ON public.users
FOR SELECT USING (
  id = (SELECT auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND tipo IN ('admin', 'moderator'))
);

CREATE POLICY "users_update_policy" ON public.users
FOR UPDATE USING (
  id = (SELECT auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND tipo IN ('admin', 'moderator'))
);

-- ============================================
-- CHAT SYSTEM RLS OPTIMIZATION
-- ============================================

-- Drop inefficient chat policies
DROP POLICY IF EXISTS "Users can view their messages" ON public.messages;
DROP POLICY IF EXISTS "Users can send messages in their chats" ON public.messages;
DROP POLICY IF EXISTS "Users can view their chats" ON public.chats;
DROP POLICY IF EXISTS "Users can create chats" ON public.chats;

-- Optimized chat messages policies
CREATE POLICY "chat_messages_select_policy" ON public.messages
FOR SELECT USING (
  sender_id = (SELECT auth.uid()) OR
  EXISTS (
    SELECT 1 FROM public.chats
    WHERE id = messages.chat_id
    AND (cliente_id = auth.uid() OR prestador_id = auth.uid())
  )
);

CREATE POLICY "chat_messages_insert_policy" ON public.messages
FOR INSERT WITH CHECK (
  sender_id = (SELECT auth.uid()) AND
  EXISTS (
    SELECT 1 FROM public.chats
    WHERE id = messages.chat_id
    AND (cliente_id = auth.uid() OR prestador_id = auth.uid())
  )
);

-- Optimized chat conversations policies
CREATE POLICY "chat_conversations_select_policy" ON public.chat_conversations
FOR SELECT USING (
  cliente_id = (SELECT auth.uid()) OR
  prestador_id = (SELECT auth.uid())
);

CREATE POLICY "chat_conversations_insert_policy" ON public.chat_conversations
FOR INSERT WITH CHECK (
  cliente_id = (SELECT auth.uid()) OR
  prestador_id = (SELECT auth.uid())
);

CREATE POLICY "chat_conversations_update_policy" ON public.chat_conversations
FOR UPDATE USING (
  cliente_id = (SELECT auth.uid()) OR
  prestador_id = (SELECT auth.uid())
);

-- ============================================
-- ORDERS RLS OPTIMIZATION
-- ============================================

-- Drop inefficient order policies
DROP POLICY IF EXISTS "Users can view their orders" ON public.pedidos;
DROP POLICY IF EXISTS "Users can create orders" ON public.pedidos;
DROP POLICY IF EXISTS "Users can update their orders" ON public.pedidos;

-- Optimized order policies
CREATE POLICY "pedidos_select_policy" ON public.pedidos
FOR SELECT USING (
  cliente_id = (SELECT auth.uid()) OR
  prestador_id = (SELECT auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND tipo IN ('admin', 'moderator'))
);

CREATE POLICY "pedidos_insert_policy" ON public.pedidos
FOR INSERT WITH CHECK (
  cliente_id = (SELECT auth.uid())
);

CREATE POLICY "pedidos_update_policy" ON public.pedidos
FOR UPDATE USING (
  cliente_id = (SELECT auth.uid()) OR
  prestador_id = (SELECT auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND tipo IN ('admin', 'moderator'))
);

-- ============================================
-- ESCROW PAYMENTS RLS OPTIMIZATION
-- ============================================

-- Drop inefficient escrow policies
DROP POLICY IF EXISTS "Users can view their payments" ON public.escrow_payments;
DROP POLICY IF EXISTS "Users can create payments" ON public.escrow_payments;

-- Optimized escrow policies
CREATE POLICY "escrow_payments_select_policy" ON public.escrow_payments
FOR SELECT USING (
  user_id = (SELECT auth.uid()) OR
  EXISTS (SELECT 1 FROM public.users WHERE auth_id = auth.uid() AND tipo IN ('admin', 'moderator'))
);

CREATE POLICY "escrow_payments_insert_policy" ON public.escrow_payments
FOR INSERT WITH CHECK (
  user_id = (SELECT auth.uid())
);

-- ============================================
-- RATINGS RLS OPTIMIZATION
-- ============================================

-- Drop inefficient rating policies
DROP POLICY IF EXISTS "Users can view ratings" ON public.avaliacoes;
DROP POLICY IF EXISTS "Users can create ratings" ON public.avaliacoes;

-- Optimized rating policies
CREATE POLICY "avaliacoes_select_policy" ON public.avaliacoes
FOR SELECT USING (true); -- Public read access for ratings

CREATE POLICY "avaliacoes_insert_policy" ON public.avaliacoes
FOR INSERT WITH CHECK (
  avaliador_id = (SELECT auth.uid())
);

-- ============================================
-- NOTIFICATIONS RLS OPTIMIZATION
-- ============================================

-- Drop inefficient notification policies
DROP POLICY IF EXISTS "Users can view their notifications" ON public.notifications;

-- Optimized notification policies
CREATE POLICY "notifications_select_policy" ON public.notifications
FOR SELECT USING (
  user_id = (SELECT auth.uid())
);

CREATE POLICY "notifications_update_policy" ON public.notifications
FOR UPDATE USING (
  user_id = (SELECT auth.uid())
);

-- ============================================
-- FAVORITES RLS OPTIMIZATION
-- ============================================

-- Optimized favorites policies
CREATE POLICY "favoritos_select_policy" ON public.favoritos
FOR SELECT USING (
  user_id = (SELECT auth.uid())
);

CREATE POLICY "favoritos_insert_policy" ON public.favoritos
FOR INSERT WITH CHECK (
  user_id = (SELECT auth.uid())
);

CREATE POLICY "favoritos_delete_policy" ON public.favoritos
FOR DELETE USING (
  user_id = (SELECT auth.uid())
);

-- ============================================
-- PORTFOLIO RLS OPTIMIZATION
-- ============================================

-- Optimized portfolio policies
CREATE POLICY "portfolio_fotos_select_policy" ON public.portfolio_fotos
FOR SELECT USING (true); -- Public read access

CREATE POLICY "portfolio_fotos_insert_policy" ON public.portfolio_fotos
FOR INSERT WITH CHECK (
  prestador_id = (SELECT auth.uid())
);

CREATE POLICY "portfolio_fotos_update_policy" ON public.portfolio_fotos
FOR UPDATE USING (
  prestador_id = (SELECT auth.uid())
);

CREATE POLICY "portfolio_fotos_delete_policy" ON public.portfolio_fotos
FOR DELETE USING (
  prestador_id = (SELECT auth.uid())
);

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON POLICY users_select_policy ON public.users IS 'Optimized policy reducing auth.uid() calls';
COMMENT ON POLICY chat_messages_select_policy ON public.chat_messages IS 'Optimized chat performance policy';
COMMENT ON POLICY pedidos_select_policy ON public.pedidos IS 'Optimized orders performance policy';
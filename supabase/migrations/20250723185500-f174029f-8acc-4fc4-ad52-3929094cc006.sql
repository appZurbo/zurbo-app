-- Create optimized function to get conversations with last message
CREATE OR REPLACE FUNCTION get_conversations_with_last_message(user_id_param uuid)
RETURNS TABLE (
    id uuid,
    created_at timestamptz,
    updated_at timestamptz,
    cliente_id uuid,
    prestador_id uuid,
    servico_solicitado text,
    preco_proposto numeric,
    status text,
    client_message_count integer,
    provider_message_count integer,
    pedido_id uuid,
    cliente_nome text,
    cliente_foto_url text,
    prestador_nome text,
    prestador_foto_url text,
    last_message_content text,
    last_message_created_at timestamptz
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    WITH ranked_messages AS (
        SELECT
            m.conversation_id,
            m.content,
            m.created_at,
            ROW_NUMBER() OVER(PARTITION BY m.conversation_id ORDER BY m.created_at DESC) as rn
        FROM chat_messages m
    )
    SELECT
        c.id, 
        c.created_at, 
        c.updated_at, 
        c.cliente_id, 
        c.prestador_id, 
        c.servico_solicitado, 
        c.preco_proposto, 
        c.status,
        c.client_message_count,
        c.provider_message_count,
        c.pedido_id,
        cliente.nome as cliente_nome, 
        cliente.foto_url as cliente_foto_url,
        prestador.nome as prestador_nome, 
        prestador.foto_url as prestador_foto_url,
        lm.content as last_message_content, 
        lm.created_at as last_message_created_at
    FROM chat_conversations c
    JOIN users cliente ON c.cliente_id = cliente.id
    JOIN users prestador ON c.prestador_id = prestador.id
    LEFT JOIN ranked_messages lm ON c.id = lm.conversation_id AND lm.rn = 1
    WHERE c.cliente_id = user_id_param OR c.prestador_id = user_id_param
    ORDER BY c.updated_at DESC;
END;
$$;
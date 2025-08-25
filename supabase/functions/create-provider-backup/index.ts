
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY") ?? "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";

    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    // Cliente autenticado para obter usuário e validar admin
    const supabaseClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: `Bearer ${token}` } },
    });

    const { data: authData } = await supabaseClient.auth.getUser();
    const currentUser = authData.user;
    if (!currentUser) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 401,
      });
    }

    // Verifica admin via tabela users (evita depender de RPC)
    const { data: adminRows, error: adminErr } = await supabaseClient
      .from('users')
      .select('id, tipo')
      .eq('auth_id', currentUser.id)
      .in('tipo', ['admin', 'moderator']);

    if (adminErr) throw adminErr;
    if (!adminRows || adminRows.length === 0) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 403,
      });
    }

    const { userId } = await req.json();
    if (!userId) {
      return new Response(JSON.stringify({ error: "Missing userId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    // Cliente service role para ler tudo e salvar backup
    const supabaseService = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false }
    });

    // Coletar dados
    const [{ data: user, error: userErr }, { data: verif, error: verErr }] = await Promise.all([
      supabaseService.from('users').select('*').eq('id', userId).single(),
      supabaseService.from('provider_verifications').select('*').eq('user_id', userId).maybeSingle()
    ]);

    if (userErr) throw userErr;
    if (!user) throw new Error("User not found");

    const [{ data: pedidosProvider }, { data: pedidosClient }] = await Promise.all([
      supabaseService.from('pedidos').select('*').eq('prestador_id', userId),
      supabaseService.from('pedidos').select('*').eq('cliente_id', userId),
    ]);

    const [{ data: portfolio }, { data: servicos }] = await Promise.all([
      supabaseService.from('portfolio_fotos').select('*').eq('prestador_id', userId),
      supabaseService.from('prestador_servicos').select('*').eq('prestador_id', userId),
    ]);

    // Clientes relacionados (dos pedidos como prestador)
    const relatedClientIds = Array.from(new Set((pedidosProvider || []).map((p: any) => p.cliente_id).filter(Boolean)));
    let relatedClients: any[] = [];
    if (relatedClientIds.length > 0) {
      const { data: clientsData } = await supabaseService
        .from('users')
        .select('id, nome, email, telefone, endereco_cidade')
        .in('id', relatedClientIds);
      relatedClients = clientsData || [];
    }

    const backup = {
      version: "1.0",
      generatedAt: new Date().toISOString(),
      user,
      provider_verification: verif,
      pedidos_as_prestador: pedidosProvider || [],
      pedidos_as_cliente: pedidosClient || [],
      portfolio_fotos: portfolio || [],
      prestador_servicos: servicos || [],
      related_clients: relatedClients
    };

    // Salvar no bucket privado
    const filePath = `${userId}/${new Date().toISOString()}.json`;
    const fileBlob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
    const { error: uploadErr } = await supabaseService.storage
      .from('provider-backups')
      .upload(filePath, fileBlob);

    if (uploadErr) throw uploadErr;

    return new Response(JSON.stringify({ ok: true, path: filePath }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in create-provider-backup:", error);
    return new Response(JSON.stringify({ error: (error as any)?.message || 'Internal error' }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});

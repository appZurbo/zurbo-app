
import { supabase } from '@/integrations/supabase/client';

export const createCompleteTestData = async () => {
  try {
    console.log('Creating comprehensive test data...');

    // First, get existing users
    const { data: existingUsers } = await supabase
      .from('users')
      .select('*')
      .limit(10);

    if (!existingUsers || existingUsers.length < 2) {
      console.log('Not enough existing users to create test data');
      return false;
    }

    const clientes = existingUsers.filter(u => u.tipo === 'cliente').slice(0, 3);
    const prestadores = existingUsers.filter(u => u.tipo === 'prestador').slice(0, 5);

    if (clientes.length === 0 || prestadores.length === 0) {
      console.log('Need both clients and providers to create test data');
      return false;
    }

    // Get services
    const { data: servicos } = await supabase
      .from('servicos')
      .select('*')
      .limit(5);

    if (!servicos || servicos.length === 0) {
      console.log('No services found');
      return false;
    }

    // Create chat conversations
    const conversationData = [];
    const messageData = [];
    const pedidoData = [];

    for (let i = 0; i < 10; i++) {
      const cliente = clientes[i % clientes.length];
      const prestador = prestadores[i % prestadores.length];
      const servico = servicos[i % servicos.length];

      // Create conversation
      const conversationId = `conv-${Date.now()}-${i}`;
      const status = ['aguardando_preco', 'preco_definido', 'aceito', 'rejeitado'][i % 4];
      const preco = status !== 'aguardando_preco' ? Math.floor(Math.random() * 300) + 50 : null;

      conversationData.push({
        id: conversationId,
        cliente_id: cliente.id,
        prestador_id: prestador.id,
        servico_solicitado: servico.nome,
        status,
        preco_proposto: preco,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      });

      // Create messages for this conversation
      const messageCount = Math.floor(Math.random() * 10) + 5;
      for (let j = 0; j < messageCount; j++) {
        const isFromClient = j % 2 === 0;
        const sender = isFromClient ? cliente : prestador;
        const messageTime = new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000);

        const messages = [
          'Olá! Tenho interesse no seu serviço.',
          'Oi! Posso te ajudar sim. Qual seria o trabalho?',
          'Preciso de um reparo na instalação elétrica.',
          'Entendi. Posso ir aí avaliar sem compromisso.',
          'Perfeito! Quando seria possível?',
          'Posso ir amanhã pela manhã. Te parece bom?',
          'Ótimo! Aguardo você então.',
          'Combinado! Até amanhã.',
          'Obrigado pelo excelente trabalho!',
          'Foi um prazer te atender!'
        ];

        messageData.push({
          conversation_id: conversationId,
          sender_id: sender.id,
          message_type: 'text',
          content: messages[j % messages.length],
          created_at: messageTime.toISOString()
        });
      }

      // Create pedido if accepted
      if (status === 'aceito') {
        pedidoData.push({
          cliente_id: cliente.id,
          prestador_id: prestador.id,
          servico_id: servico.id,
          titulo: `${servico.nome} - ${cliente.nome}`,
          descricao: `Serviço de ${servico.nome} solicitado via chat`,
          preco_acordado: preco,
          status: 'aceito',
          data_solicitacao: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
          endereco_completo: `${cliente.endereco_rua}, ${cliente.endereco_bairro}, ${cliente.endereco_cidade}`
        });
      }
    }

    // Insert conversations
    const { error: convError } = await supabase
      .from('chat_conversations')
      .upsert(conversationData, { onConflict: 'id' });

    if (convError) {
      console.error('Error creating conversations:', convError);
      throw convError;
    }

    // Insert messages
    const { error: msgError } = await supabase
      .from('chat_messages')
      .insert(messageData);

    if (msgError) {
      console.error('Error creating messages:', msgError);
      throw msgError;
    }

    // Insert pedidos
    if (pedidoData.length > 0) {
      const { error: pedidoError } = await supabase
        .from('pedidos')
        .insert(pedidoData);

      if (pedidoError) {
        console.error('Error creating pedidos:', pedidoError);
        throw pedidoError;
      }
    }

    // Create some agendamentos for providers
    const agendamentoData = [];
    for (const prestador of prestadores) {
      for (let i = 0; i < 3; i++) {
        const cliente = clientes[i % clientes.length];
        const servico = servicos[i % servicos.length];
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);

        agendamentoData.push({
          prestador_id: prestador.id,
          solicitante_id: cliente.id,
          servico_id: servico.id,
          titulo: `${servico.nome} - ${cliente.nome}`,
          descricao: `Agendamento de ${servico.nome}`,
          data_agendada: futureDate.toISOString().split('T')[0],
          hora_agendada: `${Math.floor(Math.random() * 8) + 8}:00`,
          endereco: `${cliente.endereco_rua}, ${cliente.endereco_bairro}`,
          status: ['pendente', 'confirmado', 'em_andamento'][Math.floor(Math.random() * 3)],
          preco_acordado: Math.floor(Math.random() * 300) + 50,
          cliente_nome: cliente.nome
        });
      }
    }

    const { error: agendError } = await supabase
      .from('agendamentos')
      .insert(agendamentoData);

    if (agendError) {
      console.error('Error creating agendamentos:', agendError);
      throw agendError;
    }

    // Create some reports for moderation testing
    const reportData = [];
    if (conversationData.length > 5) {
      const reportedConv = conversationData[5]; // Report the 6th conversation
      reportData.push({
        reporter_id: reportedConv.cliente_id,
        reported_user_id: reportedConv.prestador_id,
        conversation_id: reportedConv.id,
        issue_type: 'inappropriate',
        description: 'Comportamento inadequado durante a negociação'
      });

      // Block this conversation
      await supabase
        .from('chat_conversations')
        .update({ status: 'bloqueado' })
        .eq('id', reportedConv.id);
    }

    if (reportData.length > 0) {
      const { error: reportError } = await supabase
        .from('user_chat_reports')
        .insert(reportData);

      if (reportError) {
        console.error('Error creating reports:', reportError);
        throw reportError;
      }
    }

    // Update all existing users to premium
    const { error: premiumError } = await supabase
      .from('users')
      .update({ premium: true })
      .neq('id', '00000000-0000-0000-0000-000000000000');

    if (premiumError) {
      console.error('Error updating users to premium:', premiumError);
      throw premiumError;
    }

    // Add premium records
    const premiumData = existingUsers.map(user => ({
      usuario_id: user.id,
      ativo: true,
      desde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      expira_em: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    }));

    const { error: premiumInsertError } = await supabase
      .from('usuarios_premium')
      .upsert(premiumData, { onConflict: 'usuario_id' });

    if (premiumInsertError) {
      console.error('Error creating premium records:', premiumInsertError);
      throw premiumInsertError;
    }

    // Add service descriptions to providers
    const serviceDescriptions = [
      'Especialista em instalações elétricas residenciais e comerciais. Atendimento rápido e confiável.',
      'Limpeza profissional com produtos ecológicos. Sua casa impecável!',
      'Encanador com 15 anos de experiência. Emergências 24h.',
      'Pinturas e texturas especiais. Transformo seu ambiente.',
      'Jardins e paisagismo. Trago vida ao seu espaço.'
    ];

    for (let i = 0; i < prestadores.length; i++) {
      await supabase
        .from('users')
        .update({ 
          descricao_servico: serviceDescriptions[i % serviceDescriptions.length],
          em_servico: true
        })
        .eq('id', prestadores[i].id);
    }

    console.log('Comprehensive test data created successfully!');
    console.log(`Created ${conversationData.length} conversations`);
    console.log(`Created ${messageData.length} messages`);
    console.log(`Created ${pedidoData.length} pedidos`);
    console.log(`Created ${agendamentoData.length} agendamentos`);
    console.log(`Created ${reportData.length} reports`);
    
    return true;
  } catch (error) {
    console.error('Error creating comprehensive test data:', error);
    return false;
  }
};


import { supabase } from '@/integrations/supabase/client';

// Comprehensive test data creation function
export const createUnifiedTestData = async () => {
  try {
    console.log('🚀 Starting comprehensive test data creation...');

    // Step 1: Create basic services if they don't exist
    const servicosBase = [
      { nome: 'Eletricista', icone: 'Zap', cor: '#f59e0b' },
      { nome: 'Encanador', icone: 'Wrench', cor: '#3b82f6' },
      { nome: 'Faxina', icone: 'Sparkles', cor: '#10b981' },
      { nome: 'Pintor', icone: 'Paintbrush', cor: '#8b5cf6' },
      { nome: 'Jardinagem', icone: 'Flower', cor: '#059669' },
      { nome: 'Cabeleireiro', icone: 'Scissors', cor: '#ec4899' },
      { nome: 'Ar Condicionado', icone: 'Wind', cor: '#06b6d4' },
      { nome: 'Manicure', icone: 'Hand', cor: '#f97316' }
    ];

    for (const servico of servicosBase) {
      await supabase
        .from('servicos')
        .upsert(servico, { onConflict: 'nome' });
    }

    console.log('✅ Services created/updated');

    // Step 2: Delete existing fake users to avoid duplicates
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .ilike('email', '%.test@zurbo.com');

    if (deleteError) {
      console.log('Note: Could not delete existing fake users:', deleteError.message);
    }

    // Step 3: Create comprehensive fake users (both clients and providers)
    const fakeUsers = [
      // Prestadores
      {
        nome: 'João Silva Santos',
        email: 'joao.silva.test@zurbo.com',
        tipo: 'prestador',
        bio: 'Eletricista experiente com 15 anos no mercado. Especialista em instalações residenciais e comerciais.',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Centro',
        endereco_rua: 'Rua das Palmeiras, 123',
        endereco_cep: '78550-000',
        cpf: '123.456.789-01',
        nota_media: 4.9,
        premium: true,
        foto_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
        auth_id: `fake-joao-${Date.now()}`,
        servicos: ['Eletricista'],
        em_servico: true,
        descricao_servico: 'Instalações elétricas residenciais e comerciais com garantia'
      },
      {
        nome: 'Maria Santos Oliveira',
        email: 'maria.santos.test@zurbo.com',
        tipo: 'prestador',
        bio: 'Profissional de limpeza há 12 anos. Especialista em limpeza residencial e pós-obra.',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Jardim Botânico',
        endereco_rua: 'Av. das Flores, 456',
        endereco_cep: '78550-010',
        cpf: '234.567.890-12',
        nota_media: 4.8,
        premium: false,
        foto_url: 'https://images.unsplash.com/photo-1494790108755-2616c00e4d8b?w=200&h=200&fit=crop&crop=face',
        auth_id: `fake-maria-${Date.now()}`,
        servicos: ['Faxina'],
        em_servico: true,
        descricao_servico: 'Limpeza residencial e comercial com produtos ecológicos'
      },
      {
        nome: 'Carlos Eduardo Pereira',
        email: 'carlos.pereira.test@zurbo.com',
        tipo: 'prestador',
        bio: 'Encanador com 18 anos de experiência. Atendo emergências 24h.',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Vila Rica',
        endereco_rua: 'Rua do Comércio, 789',
        endereco_cep: '78550-020',
        cpf: '345.678.901-23',
        nota_media: 4.7,
        premium: true,
        foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
        auth_id: `fake-carlos-${Date.now()}`,
        servicos: ['Encanador'],
        em_servico: true,
        descricao_servico: 'Encanamento e hidráulica com atendimento 24h'
      },
      {
        nome: 'Ana Paula Santos',
        email: 'ana.paula.test@zurbo.com',
        tipo: 'prestador',
        bio: 'Pintora profissional há 10 anos. Especialista em texturas e acabamentos.',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Setor Industrial',
        endereco_rua: 'Rua da Indústria, 321',
        endereco_cep: '78550-030',
        cpf: '456.789.012-34',
        nota_media: 4.6,
        premium: false,
        foto_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
        auth_id: `fake-ana-${Date.now()}`,
        servicos: ['Pintor'],
        em_servico: true,
        descricao_servico: 'Pinturas residenciais e comerciais com acabamento profissional'
      },
      {
        nome: 'Roberto Costa Lima',
        email: 'roberto.costa.test@zurbo.com',
        tipo: 'prestador',
        bio: 'Jardineiro e paisagista com 14 anos de experiência.',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Residencial Florença',
        endereco_rua: 'Rua das Orquídeas, 654',
        endereco_cep: '78550-040',
        cpf: '567.890.123-45',
        nota_media: 4.5,
        premium: true,
        foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
        auth_id: `fake-roberto-${Date.now()}`,
        servicos: ['Jardinagem'],
        em_servico: true,
        descricao_servico: 'Jardinagem e paisagismo para residências e empresas'
      },
      // Clientes
      {
        nome: 'Pedro Costa Silva',
        email: 'pedro.costa.test@zurbo.com',
        tipo: 'cliente',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Centro',
        endereco_rua: 'Rua das Palmeiras, 200',
        endereco_cep: '78550-005',
        cpf: '901.234.567-89',
        premium: false,
        foto_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
        auth_id: `fake-pedro-${Date.now()}`
      },
      {
        nome: 'Julia Ferreira Santos',
        email: 'julia.ferreira.test@zurbo.com',
        tipo: 'cliente',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Jardim Botânico',
        endereco_rua: 'Av. das Flores, 300',
        endereco_cep: '78550-015',
        cpf: '012.345.678-90',
        premium: true,
        foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
        auth_id: `fake-julia-${Date.now()}`
      },
      {
        nome: 'Marcos Antonio Souza',
        email: 'marcos.souza.test@zurbo.com',
        tipo: 'cliente',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Vila Rica',
        endereco_rua: 'Rua do Comércio, 400',
        endereco_cep: '78550-025',
        cpf: '123.987.654-32',
        premium: false,
        foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
        auth_id: `fake-marcos-${Date.now()}`
      }
    ];

    // Insert users one by one to handle errors gracefully
    const insertedUsers = [];
    for (const user of fakeUsers) {
      const { servicos, ...userData } = user;
      
      try {
        const { data: insertedUser, error: userError } = await supabase
          .from('users')
          .insert(userData)
          .select()
          .single();

        if (userError) {
          console.error('Error creating user:', user.nome, userError);
          return { success: false, error: `Error creating user ${user.nome}: ${userError.message}` };
        }

        insertedUsers.push({ ...insertedUser, servicos });
        console.log(`✅ Created user: ${insertedUser.nome}`);
      } catch (error) {
        console.error('Exception creating user:', user.nome, error);
        return { success: false, error: `Exception creating user ${user.nome}: ${error.message}` };
      }
    }

    console.log(`✅ Created ${insertedUsers.length} users`);

    // Step 4: Get services and create prestador_servicos relationships
    const { data: servicos, error: servicosError } = await supabase
      .from('servicos')
      .select('*');

    if (servicosError) {
      console.error('Error fetching services:', servicosError);
      return { success: false, error: `Error fetching services: ${servicosError.message}` };
    }

    const servicosMap = new Map();
    servicos?.forEach(servico => {
      servicosMap.set(servico.nome, servico.id);
    });

    for (const user of insertedUsers) {
      if (user.tipo === 'prestador' && user.servicos) {
        for (const servicoNome of user.servicos) {
          const servicoId = servicosMap.get(servicoNome);
          if (servicoId) {
            try {
              await supabase
                .from('prestador_servicos')
                .insert({
                  prestador_id: user.id,
                  servico_id: servicoId,
                  preco_min: Math.floor(Math.random() * 100) + 50,
                  preco_max: Math.floor(Math.random() * 200) + 150
                });
            } catch (error) {
              console.log('Note: Could not create prestador_servicos relationship:', error);
            }
          }
        }
      }

      // Add premium records
      if (user.premium) {
        try {
          await supabase
            .from('usuarios_premium')
            .insert({
              usuario_id: user.id,
              ativo: true,
              desde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              expira_em: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
            });
        } catch (error) {
          console.log('Note: Could not create premium record:', error);
        }
      }
    }

    console.log('✅ Created prestador services and premium records');

    // Step 5: Create conversations and messages
    const prestadores = insertedUsers.filter(u => u.tipo === 'prestador');
    const clientes = insertedUsers.filter(u => u.tipo === 'cliente');

    if (prestadores.length === 0 || clientes.length === 0) {
      console.log('⚠️ Not enough users to create conversations');
      return { 
        success: true, 
        data: {
          users: insertedUsers.length,
          conversations: 0,
          messages: 0,
          pedidos: 0,
          agendamentos: 0,
          avaliacoes: 0
        }
      };
    }

    const conversationData = [];
    const messageData = [];
    const pedidoData = [];

    for (let i = 0; i < 12; i++) {
      const cliente = clientes[i % clientes.length];
      const prestador = prestadores[i % prestadores.length];
      const servicoNome = prestador.servicos?.[0] || 'Serviço Geral';

      const conversationId = `conv-${Date.now()}-${i}`;
      const status = ['aguardando_preco', 'preco_definido', 'aceito', 'rejeitado', 'bloqueado'][i % 5];
      const preco = status !== 'aguardando_preco' ? Math.floor(Math.random() * 300) + 50 : null;

      conversationData.push({
        id: conversationId,
        cliente_id: cliente.id,
        prestador_id: prestador.id,
        servico_solicitado: servicoNome,
        status,
        preco_proposto: preco,
        created_at: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString()
      });

      // Create realistic messages for each conversation
      const messageTemplates = [
        { sender: 'cliente', content: `Olá! Tenho interesse no serviço de ${servicoNome}. Poderia me passar um orçamento?` },
        { sender: 'prestador', content: 'Oi! Claro, posso te ajudar sim. Qual seria exatamente o trabalho a ser feito?' },
        { sender: 'cliente', content: 'Preciso de um reparo e uma pequena instalação. Quando você poderia vir avaliar?' },
        { sender: 'prestador', content: 'Posso ir aí amanhã pela manhã para avaliar. Seria por volta das 9h?' },
        { sender: 'cliente', content: 'Perfeito! Aguardo você então. Qual seria mais ou menos o valor?' },
        { sender: 'prestador', content: `Para esse tipo de serviço, fica em torno de R$ ${preco || 150}. Mas posso confirmar após ver pessoalmente.` },
        { sender: 'cliente', content: 'Está bem! Combinado então.' },
        { sender: 'prestador', content: 'Ótimo! Até amanhã!' }
      ];

      const messageCount = Math.min(messageTemplates.length, Math.floor(Math.random() * 6) + 3);
      for (let j = 0; j < messageCount; j++) {
        const template = messageTemplates[j];
        const sender = template.sender === 'cliente' ? cliente : prestador;
        const messageTime = new Date(Date.now() - (messageCount - j) * 60 * 60 * 1000);

        messageData.push({
          conversation_id: conversationId,
          sender_id: sender.id,
          message_type: 'text',
          content: template.content,
          created_at: messageTime.toISOString()
        });
      }

      // Create pedido if accepted
      if (status === 'aceito') {
        const servicoId = servicosMap.get(servicoNome);
        if (servicoId) {
          pedidoData.push({
            cliente_id: cliente.id,
            prestador_id: prestador.id,
            servico_id: servicoId,
            titulo: `${servicoNome} - ${cliente.nome}`,
            descricao: `Serviço de ${servicoNome} solicitado via chat`,
            preco_acordado: preco,
            status: 'aceito',
            data_solicitacao: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
            endereco_completo: `${cliente.endereco_rua}, ${cliente.endereco_bairro}, ${cliente.endereco_cidade}`
          });
        }
      }
    }

    // Insert conversations
    try {
      const { error: convError } = await supabase
        .from('chat_conversations')
        .insert(conversationData);

      if (convError) {
        console.error('Error creating conversations:', convError);
        return { success: false, error: `Error creating conversations: ${convError.message}` };
      }

      console.log(`✅ Created ${conversationData.length} conversations`);
    } catch (error) {
      console.error('Exception creating conversations:', error);
      return { success: false, error: `Exception creating conversations: ${error.message}` };
    }

    // Insert messages
    try {
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert(messageData);

      if (msgError) {
        console.error('Error creating messages:', msgError);
        return { success: false, error: `Error creating messages: ${msgError.message}` };
      }

      console.log(`✅ Created ${messageData.length} messages`);
    } catch (error) {
      console.error('Exception creating messages:', error);
      return { success: false, error: `Exception creating messages: ${error.message}` };
    }

    // Insert pedidos
    if (pedidoData.length > 0) {
      try {
        const { error: pedidoError } = await supabase
          .from('pedidos')
          .insert(pedidoData);

        if (pedidoError) {
          console.error('Error creating pedidos:', pedidoError);
          // Don't return error, continue with other data
        } else {
          console.log(`✅ Created ${pedidoData.length} pedidos`);
        }
      } catch (error) {
        console.error('Exception creating pedidos:', error);
        // Don't return error, continue with other data
      }
    }

    // Step 6: Create agendamentos
    const agendamentoData = [];
    for (let i = 0; i < 8; i++) {
      const prestador = prestadores[i % prestadores.length];
      const cliente = clientes[i % clientes.length];
      const servicoNome = prestador.servicos?.[0] || 'Serviço Geral';
      const servicoId = servicosMap.get(servicoNome);
      
      if (servicoId) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);

        agendamentoData.push({
          prestador_id: prestador.id,
          solicitante_id: cliente.id,
          servico_id: servicoId,
          titulo: `${servicoNome} - ${cliente.nome}`,
          descricao: `Agendamento de ${servicoNome}`,
          data_agendada: futureDate.toISOString().split('T')[0],
          hora_agendada: `${Math.floor(Math.random() * 8) + 8}:00`,
          endereco: `${cliente.endereco_rua}, ${cliente.endereco_bairro}`,
          status: ['pendente', 'confirmado', 'em_andamento'][Math.floor(Math.random() * 3)],
          preco_acordado: Math.floor(Math.random() * 300) + 50,
          cliente_nome: cliente.nome
        });
      }
    }

    if (agendamentoData.length > 0) {
      try {
        const { error: agendError } = await supabase
          .from('agendamentos')
          .insert(agendamentoData);

        if (agendError) {
          console.error('Error creating agendamentos:', agendError);
          // Don't return error, continue with other data
        } else {
          console.log(`✅ Created ${agendamentoData.length} agendamentos`);
        }
      } catch (error) {
        console.error('Exception creating agendamentos:', error);
        // Don't return error, continue with other data
      }
    }

    // Step 7: Create some avaliacoes
    const avaliacaoData = [];
    for (let i = 0; i < 15; i++) {
      const prestador = prestadores[i % prestadores.length];
      const cliente = clientes[i % clientes.length];

      avaliacaoData.push({
        avaliador_id: cliente.id,
        avaliado_id: prestador.id,
        nota: Math.floor(Math.random() * 2) + 4, // 4 ou 5 estrelas
        comentario: [
          'Excelente profissional! Recomendo muito.',
          'Trabalho de qualidade, muito pontual.',
          'Superou minhas expectativas.',
          'Profissional competente e prestativo.',
          'Ótimo atendimento e resultado final.'
        ][i % 5],
        criado_em: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    try {
      const { error: avalError } = await supabase
        .from('avaliacoes')
        .insert(avaliacaoData);

      if (avalError) {
        console.error('Error creating avaliacoes:', avalError);
        // Don't return error, continue
      } else {
        console.log(`✅ Created ${avaliacaoData.length} avaliacoes`);
      }
    } catch (error) {
      console.error('Exception creating avaliacoes:', error);
      // Don't return error, continue
    }

    console.log('🎉 Comprehensive test data creation completed successfully!');
    
    return {
      success: true,
      data: {
        users: insertedUsers.length,
        conversations: conversationData.length,
        messages: messageData.length,
        pedidos: pedidoData.length,
        agendamentos: agendamentoData.length,
        avaliacoes: avaliacaoData.length
      }
    };

  } catch (error) {
    console.error('❌ Error creating comprehensive test data:', error);
    return { success: false, error: error.message };
  }
};

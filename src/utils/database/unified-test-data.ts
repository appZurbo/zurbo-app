
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Generate fixed UUIDs for consistent test data
const FIXED_IDS = {
  users: {
    prestador1: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
    prestador2: 'b2c3d4e5-f6g7-8901-bcde-f12345678901', 
    prestador3: 'c3d4e5f6-g7h8-9012-cdef-123456789012',
    cliente1: 'd4e5f6g7-h8i9-0123-def0-234567890123',
    cliente2: 'e5f6g7h8-i9j0-1234-ef01-345678901234'
  },
  services: {
    eletrica: 'f6g7h8i9-j0k1-2345-f012-456789012345',
    limpeza: 'g7h8i9j0-k1l2-3456-0123-567890123456',
    encanamento: 'h8i9j0k1-l2m3-4567-1234-678901234567'
  }
};

export const unifiedTestData = {
  // Users data with proper structure and required fields
  users: [
    {
      id: FIXED_IDS.users.prestador1,
      auth_id: uuidv4(),
      nome: "João Silva Eletricista",
      email: "joao.eletricista@teste.com",
      cpf: "123.456.789-00",
      telefone: "(11) 99999-1234",
      endereco_rua: "Rua das Instalações",
      endereco_numero: "123",
      endereco_bairro: "Centro",
      endereco_cidade: "São Paulo",
      endereco_cep: "01234-567",
      tipo: "prestador",
      nota_media: 4.8,
      premium: true,
      em_servico: true,
      descricao_servico: "Especialista em instalações elétricas residenciais e comerciais. Atendimento de emergência 24h com garantia total.",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: FIXED_IDS.users.prestador2,
      auth_id: uuidv4(),
      nome: "Maria Santos Limpeza",
      email: "maria.limpeza@teste.com",
      cpf: "987.654.321-00",
      telefone: "(11) 88888-5678",
      endereco_rua: "Av. da Limpeza",
      endereco_numero: "456",
      endereco_bairro: "Vila Madalena",
      endereco_cidade: "São Paulo",
      endereco_cep: "04567-890",
      tipo: "prestador",
      nota_media: 4.9,
      premium: true,
      em_servico: true,
      descricao_servico: "Limpeza profissional com produtos ecológicos. Sua casa impecável e protegida!",
      foto_url: "https://images.unsplash.com/photo-1494790108755-2616b332c32d?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: FIXED_IDS.users.prestador3,
      auth_id: uuidv4(),
      nome: "Pedro Encanador PRO",
      email: "pedro.encanador@teste.com",
      cpf: "456.123.789-00",
      telefone: "(11) 77777-9999",
      endereco_rua: "Rua dos Canos",
      endereco_numero: "789",
      endereco_bairro: "Pinheiros",
      endereco_cidade: "São Paulo",
      endereco_cep: "05678-901",
      tipo: "prestador",
      nota_media: 4.7,
      premium: true,
      em_servico: true,
      descricao_servico: "Encanador com 15 anos de experiência. Emergências 24h, desentupimentos e instalações.",
      foto_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: FIXED_IDS.users.cliente1,
      auth_id: uuidv4(),
      nome: "Carlos Oliveira",
      email: "carlos.cliente@teste.com",
      cpf: "789.123.456-00",
      telefone: "(11) 66666-1111",
      endereco_rua: "Rua dos Clientes",
      endereco_numero: "321",
      endereco_bairro: "Jardins",
      endereco_cidade: "São Paulo",
      endereco_cep: "01234-567",
      tipo: "cliente",
      nota_media: 0,
      premium: false,
      em_servico: false,
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: FIXED_IDS.users.cliente2,
      auth_id: uuidv4(),
      nome: "Ana Costa",
      email: "ana.cliente@teste.com",
      cpf: "321.654.987-00",
      telefone: "(11) 55555-2222",
      endereco_rua: "Av. dos Clientes",
      endereco_numero: "654",
      endereco_bairro: "Moema",
      endereco_cidade: "São Paulo",
      endereco_cep: "04567-890",
      tipo: "cliente",
      nota_media: 0,
      premium: true,
      em_servico: false,
      foto_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  // Services data
  services: [
    {
      id: FIXED_IDS.services.eletrica,
      nome: "Instalação Elétrica",
      ativo: true,
      icone: "zap",
      cor: "#f97316"
    },
    {
      id: FIXED_IDS.services.limpeza,
      nome: "Limpeza Residencial",
      ativo: true,
      icone: "sparkles",
      cor: "#06b6d4"
    },
    {
      id: FIXED_IDS.services.encanamento,
      nome: "Encanamento",
      ativo: true,
      icone: "wrench",
      cor: "#8b5cf6"
    }
  ]
};

// Main function to create unified test data
export const createUnifiedTestData = async () => {
  try {
    console.log('🚀 Iniciando criação de dados de teste unificados...');
    
    // Clear existing data first
    console.log('🧹 Limpando dados existentes...');
    
    const tables = [
      'chat_messages',
      'chat_conversations', 
      'avaliacoes',
      'agendamentos',
      'pedidos',
      'prestador_servicos',
      'portfolio_fotos',
      'usuarios_premium',
      'users',
      'servicos'
    ];

    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq('id', '00000000-0000-0000-0000-000000000000');
      if (error && !error.message.includes('permission denied')) {
        console.log(`Tabela ${table} limpa ou não acessível:`, error.message);
      }
    }

    // Create services first
    console.log('📋 Criando serviços...');
    const { data: servicesData, error: servicesError } = await supabase
      .from('servicos')
      .upsert(unifiedTestData.services, { onConflict: 'id' })
      .select();

    if (servicesError) {
      console.error('Erro criando serviços:', servicesError);
      throw servicesError;
    }
    console.log('✅ Serviços criados:', servicesData?.length || 0);

    // Create users
    console.log('👥 Criando usuários...');
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .upsert(unifiedTestData.users, { onConflict: 'id' })
      .select();

    if (usersError) {
      console.error('Erro criando usuários:', usersError);
      throw usersError;
    }
    console.log('✅ Usuários criados:', usersData?.length || 0);

    // Get actual user IDs for relationships
    const prestadores = usersData?.filter(u => u.tipo === 'prestador') || [];
    const clientes = usersData?.filter(u => u.tipo === 'cliente') || [];
    const serviceIds = servicesData?.map(s => s.id) || [];

    // Create premium records for PRO users
    console.log('👑 Criando registros PRO...');
    const premiumData = usersData
      ?.filter(user => user.premium)
      .map(user => ({
        usuario_id: user.id,
        ativo: true,
        desde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
        expira_em: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      })) || [];

    if (premiumData.length > 0) {
      const { error: premiumError } = await supabase
        .from('usuarios_premium')
        .upsert(premiumData, { onConflict: 'usuario_id' });
      
      if (premiumError) {
        console.error('Erro criando registros premium:', premiumError);
      } else {
        console.log('✅ Registros PRO criados:', premiumData.length);
      }
    }

    // Create prestador_servicos relationships
    console.log('🔗 Criando relações prestador-serviços...');
    const prestadorServicos = [];
    prestadores.forEach((prestador, index) => {
      const servico = serviceIds[index % serviceIds.length];
      prestadorServicos.push({
        prestador_id: prestador.id,
        servico_id: servico,
        preco_min: 50 + (index * 10),
        preco_max: 200 + (index * 50)
      });
    });

    if (prestadorServicos.length > 0) {
      const { error: psError } = await supabase
        .from('prestador_servicos')
        .upsert(prestadorServicos, { onConflict: 'prestador_id,servico_id' });
      
      if (psError) {
        console.error('Erro criando prestador_servicos:', psError);
      } else {
        console.log('✅ Relações prestador-serviços criadas:', prestadorServicos.length);
      }
    }

    // Create conversations with real user IDs
    console.log('💬 Criando conversas...');
    const conversationsData = [];
    const messagesData = [];

    for (let i = 0; i < Math.min(prestadores.length, clientes.length); i++) {
      const conversationId = `${FIXED_IDS.users.cliente1}-${prestadores[i].id}-conv`;
      const servico = servicesData?.[i % servicesData.length];
      
      conversationsData.push({
        id: conversationId,
        cliente_id: clientes[i % clientes.length].id,
        prestador_id: prestadores[i].id,
        servico_solicitado: servico?.nome || 'Serviço Geral',
        status: ['aguardando_preco', 'preco_definido', 'aceito'][i % 3],
        preco_proposto: i % 3 === 0 ? null : 150 + (i * 25),
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        updated_at: new Date().toISOString()
      });

      // Create messages for each conversation
      const clienteMessages = [
        'Olá! Preciso de um orçamento para este serviço.',
        'Quando você poderia vir fazer uma avaliação?',
        'Perfeito! Aguardo seu contato.',
        'Obrigado pelo excelente atendimento!'
      ];

      const prestadorMessages = [
        'Oi! Claro, posso te ajudar. Qual seria exatamente o trabalho?',
        'Posso ir aí amanhã pela manhã fazer uma avaliação sem compromisso.',
        'Combinado! Vou te mandar um orçamento detalhado.',
        'Foi um prazer te atender! Qualquer coisa, pode chamar.'
      ];

      for (let j = 0; j < 4; j++) {
        const isFromClient = j % 2 === 0;
        const sender = isFromClient ? clientes[i % clientes.length] : prestadores[i];
        const message = isFromClient ? clienteMessages[j] : prestadorMessages[j];
        
        messagesData.push({
          conversation_id: conversationId,
          sender_id: sender.id,
          content: message,
          message_type: 'text',
          created_at: new Date(Date.now() - (Math.random() * 6 * 60 * 60 * 1000) - (j * 30 * 60 * 1000)).toISOString()
        });
      }
    }

    if (conversationsData.length > 0) {
      const { error: convError } = await supabase
        .from('chat_conversations')
        .upsert(conversationsData, { onConflict: 'id' });
      
      if (convError) {
        console.error('Erro criando conversas:', convError);
      } else {
        console.log('✅ Conversas criadas:', conversationsData.length);
      }
    }

    if (messagesData.length > 0) {
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert(messagesData);
      
      if (msgError) {
        console.error('Erro criando mensagens:', msgError);
      } else {
        console.log('✅ Mensagens criadas:', messagesData.length);
      }
    }

    // Create reviews
    console.log('⭐ Criando avaliações...');
    const reviewsData = [];
    for (let i = 0; i < prestadores.length; i++) {
      const cliente = clientes[i % clientes.length];
      reviewsData.push({
        avaliador_id: cliente.id,
        avaliado_id: prestadores[i].id,
        nota: 4 + Math.floor(Math.random() * 2), // 4 ou 5
        comentario: [
          "Excelente profissional! Muito pontual e competente.",
          "Trabalho impecável, recomendo!",
          "Muito satisfeito com o serviço prestado.",
          "Profissional exemplar, voltaria a contratar!"
        ][i % 4],
        criado_em: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
      });
    }

    if (reviewsData.length > 0) {
      const { error: reviewsError } = await supabase
        .from('avaliacoes')
        .insert(reviewsData);
      
      if (reviewsError) {
        console.error('Erro criando avaliações:', reviewsError);
      } else {
        console.log('✅ Avaliações criadas:', reviewsData.length);
      }
    }

    // Create appointments
    console.log('📅 Criando agendamentos...');
    const agendamentosData = [];
    for (let i = 0; i < prestadores.length; i++) {
      const cliente = clientes[i % clientes.length];
      const servico = servicesData?.[i % servicesData.length];
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + Math.floor(Math.random() * 30) + 1);
      
      agendamentosData.push({
        prestador_id: prestadores[i].id,
        solicitante_id: cliente.id,
        servico_id: servico?.id,
        titulo: `${servico?.nome} - ${cliente.nome}`,
        descricao: `Agendamento de ${servico?.nome} para ${cliente.nome}`,
        data_agendada: futureDate.toISOString().split('T')[0],
        hora_agendada: `${8 + Math.floor(Math.random() * 10)}:00:00`,
        endereco: `${cliente.endereco_rua}, ${cliente.endereco_numero}`,
        status: ['pendente', 'confirmado', 'em_andamento'][Math.floor(Math.random() * 3)],
        preco_acordado: 100 + (i * 50),
        cliente_nome: cliente.nome,
        criado_em: new Date().toISOString()
      });
    }

    if (agendamentosData.length > 0) {
      const { error: agendError } = await supabase
        .from('agendamentos')
        .insert(agendamentosData);
      
      if (agendError) {
        console.error('Erro criando agendamentos:', agendError);
      } else {
        console.log('✅ Agendamentos criados:', agendamentosData.length);
      }
    }

    // Create pedidos
    console.log('📋 Criando pedidos...');
    const pedidosData = [];
    for (let i = 0; i < Math.min(prestadores.length, clientes.length); i++) {
      const cliente = clientes[i];
      const prestador = prestadores[i];
      const servico = servicesData?.[i % servicesData.length];
      
      pedidosData.push({
        cliente_id: cliente.id,
        prestador_id: prestador.id,
        servico_id: servico?.id || serviceIds[0],
        titulo: `${servico?.nome} - Solicitação de ${cliente.nome}`,
        descricao: `Solicitação de ${servico?.nome} feita por ${cliente.nome}`,
        status: ['pendente', 'aceito', 'em_andamento', 'concluido'][Math.floor(Math.random() * 4)],
        endereco_completo: `${cliente.endereco_rua}, ${cliente.endereco_numero}, ${cliente.endereco_bairro}, ${cliente.endereco_cidade}`,
        preco_acordado: Math.floor(Math.random() * 200) + 100,
        data_solicitacao: new Date(Date.now() - Math.random() * 15 * 24 * 60 * 60 * 1000).toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });
    }

    if (pedidosData.length > 0) {
      const { error: pedidosError } = await supabase
        .from('pedidos')
        .insert(pedidosData);
      
      if (pedidosError) {
        console.error('Erro criando pedidos:', pedidosError);
      } else {
        console.log('✅ Pedidos criados:', pedidosData.length);
      }
    }

    const summary = {
      usuarios: usersData?.length || 0,
      servicos: servicesData?.length || 0,
      conversas: conversationsData.length,
      mensagens: messagesData.length,
      avaliacoes: reviewsData.length,
      agendamentos: agendamentosData.length,
      pedidos: pedidosData.length,
      registros_pro: premiumData.length
    };

    console.log('🎉 Sistema de dados de teste criado com sucesso!');
    console.log('📊 Resumo:', summary);
    
    return {
      success: true,
      data: summary,
      message: 'Sistema completo de dados de teste criado com sucesso!'
    };

  } catch (error) {
    console.error('❌ Erro criando dados de teste:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      message: 'Falha na criação dos dados de teste'
    };
  }
};

// Helper function to get random UUID from test data
export const getRandomTestUUID = () => {
  const allUUIDs = [
    ...Object.values(FIXED_IDS.users),
    ...Object.values(FIXED_IDS.services)
  ];
  return allUUIDs[Math.floor(Math.random() * allUUIDs.length)];
};

export default unifiedTestData;

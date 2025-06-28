
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';

// Generate valid UUIDs for all test data
const generateValidUUID = () => uuidv4();

export const unifiedTestData = {
  // Users data with proper UUIDs
  users: [
    {
      id: generateValidUUID(),
      auth_id: generateValidUUID(),
      nome: "João Silva",
      email: "joao.silva@email.com",
      cpf: "123.456.789-00",
      telefone: "(11) 99999-1234",
      endereco: "Rua das Flores, 123",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      tipo: "prestador",
      servicos: ["Elétrica", "Instalações"],
      nota_media: 4.8,
      premium: true,
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateValidUUID(),
      auth_id: generateValidUUID(),
      nome: "Maria Santos",
      email: "maria.santos@email.com",
      cpf: "987.654.321-00",
      telefone: "(11) 88888-5678",
      endereco: "Av. Principal, 456",
      cidade: "São Paulo",
      estado: "SP",
      cep: "04567-890",
      tipo: "prestador",
      servicos: ["Limpeza", "Organização"],
      nota_media: 4.9,
      premium: false,
      foto_url: "https://images.unsplash.com/photo-1494790108755-2616b332c32?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateValidUUID(),
      auth_id: generateValidUUID(),
      nome: "Carlos Oliveira",
      email: "carlos.oliveira@email.com",
      cpf: "456.789.123-00",
      telefone: "(11) 77777-9012",
      endereco: "Rua dos Trabalhadores, 789",
      cidade: "São Paulo",
      estado: "SP",
      cep: "07890-123",
      tipo: "cliente",
      servicos: [],
      nota_media: 0,
      premium: false,
      foto_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateValidUUID(),
      auth_id: generateValidUUID(),
      nome: "Ana Costa",
      email: "ana.costa@email.com",
      cpf: "789.123.456-00",
      telefone: "(11) 66666-3456",
      endereco: "Praça Central, 321",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
      tipo: "cliente",
      servicos: [],
      nota_media: 0,
      premium: true,
      foto_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  // Conversations with proper UUIDs
  conversations: [
    {
      id: generateValidUUID(),
      participantes: [generateValidUUID(), generateValidUUID()],
      ultimo_acesso: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ],

  // Messages with proper UUIDs
  messages: [
    {
      id: generateValidUUID(),
      conversation_id: generateValidUUID(),
      sender_id: generateValidUUID(),
      content: "Olá! Preciso de um orçamento para instalação elétrica.",
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: generateValidUUID(),
      conversation_id: generateValidUUID(),
      sender_id: generateValidUUID(),
      content: "Claro! Posso ajudar. Quando seria conveniente para você?",
      timestamp: new Date().toISOString(),
      read: true
    }
  ],

  // Reviews with proper UUIDs
  reviews: [
    {
      id: generateValidUUID(),
      avaliador_id: generateValidUUID(),
      avaliado_id: generateValidUUID(),
      nota: 5,
      comentario: "Excelente profissional! Muito pontual e competente.",
      created_at: new Date().toISOString()
    },
    {
      id: generateValidUUID(),
      avaliador_id: generateValidUUID(),
      avaliado_id: generateValidUUID(),
      nota: 4,
      comentario: "Bom trabalho, recomendo!",
      created_at: new Date().toISOString()
    }
  ],

  // Appointments with proper UUIDs
  appointments: [
    {
      id: generateValidUUID(),
      cliente_id: generateValidUUID(),
      prestador_id: generateValidUUID(),
      servico: "Instalação Elétrica",
      data_agendamento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      status: "agendado",
      observacoes: "Instalação de tomadas na cozinha",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: generateValidUUID(),
      cliente_id: generateValidUUID(),
      prestador_id: generateValidUUID(),
      servico: "Limpeza Residencial",
      data_agendamento: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
      status: "confirmado",
      observacoes: "Limpeza completa do apartamento",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  ]
};

// Main function to create unified test data
export const createUnifiedTestData = async () => {
  try {
    console.log('🚀 Starting unified test data creation...');
    
    // Create users
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .insert(unifiedTestData.users)
      .select();

    if (usersError) {
      console.error('Error creating users:', usersError);
      return { success: false, error: usersError.message };
    }

    console.log('✅ Users created:', usersData?.length || 0);

    // Get actual user IDs for relationships
    const userIds = usersData?.map(u => u.id) || [];
    const prestadorIds = usersData?.filter(u => u.tipo === 'prestador').map(u => u.id) || [];
    const clienteIds = usersData?.filter(u => u.tipo === 'cliente').map(u => u.id) || [];

    // Create conversations with real user IDs
    const conversationsToInsert = [
      {
        id: generateValidUUID(),
        participantes: [prestadorIds[0] || generateValidUUID(), clienteIds[0] || generateValidUUID()],
        ultimo_acesso: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateValidUUID(),
        participantes: [prestadorIds[1] || generateValidUUID(), clienteIds[1] || generateValidUUID()],
        ultimo_acesso: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const { data: conversationsData, error: conversationsError } = await supabase
      .from('chat_conversations')
      .insert(conversationsToInsert)
      .select();

    if (conversationsError) {
      console.error('Error creating conversations:', conversationsError);
    } else {
      console.log('✅ Conversations created:', conversationsData?.length || 0);
    }

    // Create messages with real conversation and user IDs
    const conversationIds = conversationsData?.map(c => c.id) || [];
    const messagesToInsert = [
      {
        id: generateValidUUID(),
        conversation_id: conversationIds[0] || generateValidUUID(),
        sender_id: clienteIds[0] || generateValidUUID(),
        content: "Olá! Preciso de um orçamento para instalação elétrica.",
        timestamp: new Date().toISOString(),
        read: false
      },
      {
        id: generateValidUUID(),
        conversation_id: conversationIds[0] || generateValidUUID(),
        sender_id: prestadorIds[0] || generateValidUUID(),
        content: "Claro! Posso ajudar. Quando seria conveniente para você?",
        timestamp: new Date().toISOString(),
        read: true
      },
      {
        id: generateValidUUID(),
        conversation_id: conversationIds[1] || generateValidUUID(),
        sender_id: clienteIds[1] || generateValidUUID(),
        content: "Preciso de uma limpeza completa para o fim de semana.",
        timestamp: new Date().toISOString(),
        read: false
      }
    ];

    const { data: messagesData, error: messagesError } = await supabase
      .from('chat_messages')
      .insert(messagesToInsert)
      .select();

    if (messagesError) {
      console.error('Error creating messages:', messagesError);
    } else {
      console.log('✅ Messages created:', messagesData?.length || 0);
    }

    // Create reviews
    const reviewsToInsert = [
      {
        id: generateValidUUID(),
        avaliador_id: clienteIds[0] || generateValidUUID(),
        avaliado_id: prestadorIds[0] || generateValidUUID(),
        nota: 5,
        comentario: "Excelente profissional! Muito pontual e competente.",
        created_at: new Date().toISOString()
      },
      {
        id: generateValidUUID(),
        avaliador_id: clienteIds[1] || generateValidUUID(),
        avaliado_id: prestadorIds[1] || generateValidUUID(),
        nota: 4,
        comentario: "Bom trabalho, recomendo!",
        created_at: new Date().toISOString()
      }
    ];

    const { data: reviewsData, error: reviewsError } = await supabase
      .from('avaliacoes')
      .insert(reviewsToInsert)
      .select();

    if (reviewsError) {
      console.error('Error creating reviews:', reviewsError);
    } else {
      console.log('✅ Reviews created:', reviewsData?.length || 0);
    }

    // Create appointments
    const appointmentsToInsert = [
      {
        id: generateValidUUID(),
        cliente_id: clienteIds[0] || generateValidUUID(),
        prestador_id: prestadorIds[0] || generateValidUUID(),
        servico: "Instalação Elétrica",
        data_agendamento: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: "agendado",
        observacoes: "Instalação de tomadas na cozinha",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateValidUUID(),
        cliente_id: clienteIds[1] || generateValidUUID(),
        prestador_id: prestadorIds[1] || generateValidUUID(),
        servico: "Limpeza Residencial",
        data_agendamento: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: "confirmado",
        observacoes: "Limpeza completa do apartamento",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const { data: appointmentsData, error: appointmentsError } = await supabase
      .from('agendamentos')
      .insert(appointmentsToInsert)
      .select();

    if (appointmentsError) {
      console.error('Error creating appointments:', appointmentsError);
    } else {
      console.log('✅ Appointments created:', appointmentsData?.length || 0);
    }

    // Create some pedidos (orders)
    const pedidosToInsert = [
      {
        id: generateValidUUID(),
        cliente_id: clienteIds[0] || generateValidUUID(),
        prestador_id: prestadorIds[0] || generateValidUUID(),
        servico: "Instalação Elétrica",
        descricao: "Preciso instalar tomadas na cozinha",
        status: "pendente",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: generateValidUUID(),
        cliente_id: clienteIds[1] || generateValidUUID(),
        prestador_id: prestadorIds[1] || generateValidUUID(),
        servico: "Limpeza Residencial",
        descricao: "Limpeza completa do apartamento",
        status: "aceito",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];

    const { data: pedidosData, error: pedidosError } = await supabase
      .from('pedidos')
      .insert(pedidosToInsert)
      .select();

    if (pedidosError) {
      console.error('Error creating pedidos:', pedidosError);
    } else {
      console.log('✅ Pedidos created:', pedidosData?.length || 0);
    }

    const summary = {
      users: usersData?.length || 0,
      conversations: conversationsData?.length || 0,
      messages: messagesData?.length || 0,
      pedidos: pedidosData?.length || 0,
      agendamentos: appointmentsData?.length || 0,
      avaliacoes: reviewsData?.length || 0
    };

    console.log('🎉 Test data creation completed successfully!', summary);
    
    return {
      success: true,
      data: summary
    };

  } catch (error) {
    console.error('❌ Error creating unified test data:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

// Helper function to get random UUID from test data
export const getRandomTestUUID = () => {
  const allUUIDs = [
    ...unifiedTestData.users.map(u => u.id),
    ...unifiedTestData.conversations.map(c => c.id),
    ...unifiedTestData.messages.map(m => m.id),
    ...unifiedTestData.reviews.map(r => r.id),
    ...unifiedTestData.appointments.map(a => a.id)
  ];
  return allUUIDs[Math.floor(Math.random() * allUUIDs.length)];
};

// Generate more test users for demonstration
export const generateMoreTestUsers = (count: number = 10) => {
  const newUsers = [];
  const services = ["Elétrica", "Encanamento", "Limpeza", "Pintura", "Jardinagem", "Marcenaria"];
  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Brasília", "Salvador"];
  
  for (let i = 0; i < count; i++) {
    newUsers.push({
      id: generateValidUUID(),
      auth_id: generateValidUUID(),
      nome: `Prestador ${i + 1}`,
      email: `prestador${i + 1}@teste.com`,
      cpf: `${String(i).padStart(3, '0')}.${String(i).padStart(3, '0')}.${String(i).padStart(3, '0')}-${String(i % 100).padStart(2, '0')}`,
      telefone: `(11) ${String(90000 + i).padStart(5, '0')}-${String(1000 + i).padStart(4, '0')}`,
      endereco: `Rua Teste ${i + 1}, ${i * 100}`,
      cidade: cities[i % cities.length],
      estado: "SP",
      cep: `${String(i * 1000).padStart(5, '0')}-${String(i * 10).padStart(3, '0')}`,
      tipo: "prestador",
      servicos: [services[i % services.length]],
      nota_media: 4.0 + (Math.random() * 1.0),
      premium: Math.random() > 0.5,
      foto_url: `https://images.unsplash.com/photo-150700321116${i % 10}-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    });
  }
  
  return newUsers;
};

export default unifiedTestData;

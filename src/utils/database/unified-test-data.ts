
import { v4 as uuidv4 } from 'uuid';

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

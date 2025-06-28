
import { supabase } from '@/integrations/supabase/client';

// IDs fixos para evitar conflitos
const FIXED_IDS = {
  admin: '11111111-1111-1111-1111-111111111111',
  prestador1: '22222222-2222-2222-2222-222222222222',
  prestador2: '33333333-3333-3333-3333-333333333333',
  prestador3: '44444444-4444-4444-4444-444444444444',
  cliente1: '55555555-5555-5555-5555-555555555555',
  cliente2: '66666666-6666-6666-6666-666666666666',
  servico1: '77777777-7777-7777-7777-777777777777',
  servico2: '88888888-8888-8888-8888-888888888888',
  servico3: '99999999-9999-9999-9999-999999999999',
};

export const createUnifiedTestData = async () => {
  try {
    console.log('🚀 Iniciando criação do sistema completo de dados fake...');

    // 1. Criar Serviços
    console.log('📋 Criando serviços...');
    const servicosData = [
      {
        id: FIXED_IDS.servico1,
        nome: 'Limpeza Residencial',
        icone: 'home',
        cor: '#10b981',
        ativo: true
      },
      {
        id: FIXED_IDS.servico2,
        nome: 'Eletricista',
        icone: 'zap',
        cor: '#f59e0b',
        ativo: true
      },
      {
        id: FIXED_IDS.servico3,
        nome: 'Encanador',
        icone: 'droplets',
        cor: '#3b82f6',
        ativo: true
      }
    ];

    for (const servico of servicosData) {
      const { error } = await supabase
        .from('servicos')
        .upsert(servico, { onConflict: 'id' });
      
      if (error) {
        console.log(`Serviço ${servico.nome}:`, error.message);
      }
    }

    // 2. Criar Usuários
    console.log('👥 Criando usuários...');
    const usuariosData = [
      {
        id: FIXED_IDS.admin,
        nome: 'Admin Sistema',
        email: 'admin@zurbo.com',
        tipo: 'admin',
        premium: true,
        foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        endereco_cidade: 'Sinop',
        endereco_bairro: 'Centro',
        endereco_rua: 'Av. dos Ingás',
        endereco_numero: '1000',
        endereco_cep: '78550-000',
        nota_media: 5.0,
        em_servico: true,
        bio: 'Administrador do sistema Zurbo'
      },
      {
        id: FIXED_IDS.prestador1,
        nome: 'Ana Silva',
        email: 'ana@zurbo.com',
        tipo: 'prestador',
        premium: true,
        foto_url: 'https://images.unsplash.com/photo-1494790108755-2616b332c32d?w=150&h=150&fit=crop&crop=face',
        endereco_cidade: 'Sinop',
        endereco_bairro: 'Centro',
        endereco_rua: 'Rua das Flores',
        endereco_numero: '123',
        endereco_cep: '78550-001',
        nota_media: 4.8,
        em_servico: true,
        bio: 'Profissional experiente em limpeza residencial e comercial. Trabalho com produtos próprios e equipamentos modernos.',
        descricao_servico: 'Limpeza completa de residências e escritórios'
      },
      {
        id: FIXED_IDS.prestador2,
        nome: 'Carlos Santos',
        email: 'carlos@zurbo.com',
        tipo: 'prestador',
        premium: false,
        foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        endereco_cidade: 'Sinop',
        endereco_bairro: 'Jardim das Palmeiras',
        endereco_rua: 'Av. Governador Julio Campos',
        endereco_numero: '456',
        endereco_cep: '78550-002',
        nota_media: 4.9,
        em_servico: true,
        bio: 'Eletricista profissional com mais de 10 anos de experiência. Atendo emergências 24h.',
        descricao_servico: 'Instalações elétricas e manutenção'
      },
      {
        id: FIXED_IDS.prestador3,
        nome: 'Maria Oliveira',
        email: 'maria@zurbo.com',
        tipo: 'prestador',
        premium: true,
        foto_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        endereco_cidade: 'Sinop',
        endereco_bairro: 'Residencial Cidade Jardim',
        endereco_rua: 'Rua dos Ipês',
        endereco_numero: '789',
        endereco_cep: '78550-003',
        nota_media: 4.7,
        em_servico: true,
        bio: 'Especialista em serviços hidráulicos residenciais e comerciais.',
        descricao_servico: 'Reparos e instalações hidráulicas'
      },
      {
        id: FIXED_IDS.cliente1,
        nome: 'João Cliente',
        email: 'joao@cliente.com',
        tipo: 'cliente',
        premium: false,
        endereco_cidade: 'Sinop',
        endereco_bairro: 'Centro',
        endereco_rua: 'Rua Principal',
        endereco_numero: '100',
        endereco_cep: '78550-004',
        em_servico: false
      },
      {
        id: FIXED_IDS.cliente2,
        nome: 'Pedro Cliente',
        email: 'pedro@cliente.com',
        tipo: 'cliente',
        premium: true,
        endereco_cidade: 'Sinop',
        endereco_bairro: 'Jardim Tropical',
        endereco_rua: 'Av. Teles Pires',
        endereco_numero: '200',
        endereco_cep: '78550-005',
        em_servico: false
      }
    ];

    for (const usuario of usuariosData) {
      const { error } = await supabase
        .from('users')
        .upsert(usuario, { onConflict: 'id' });
      
      if (error) {
        console.log(`Usuário ${usuario.nome}:`, error.message);
      }
    }

    // 3. Criar relação Prestador-Serviços
    console.log('🔗 Criando relações prestador-serviços...');
    const prestadorServicos = [
      { prestador_id: FIXED_IDS.prestador1, servico_id: FIXED_IDS.servico1, preco_min: 50, preco_max: 150 },
      { prestador_id: FIXED_IDS.prestador2, servico_id: FIXED_IDS.servico2, preco_min: 80, preco_max: 200 },
      { prestador_id: FIXED_IDS.prestador3, servico_id: FIXED_IDS.servico3, preco_min: 60, preco_max: 180 }
    ];

    for (const ps of prestadorServicos) {
      const { error } = await supabase
        .from('prestador_servicos')
        .upsert(ps);
      
      if (error) {
        console.log('Prestador-Serviço:', error.message);
      }
    }

    // 4. Criar Avaliações
    console.log('⭐ Criando avaliações...');
    const avaliacoes = [
      {
        avaliador_id: FIXED_IDS.cliente1,
        avaliado_id: FIXED_IDS.prestador1,
        nota: 5,
        comentario: 'Excelente serviço! Muito profissional e pontual.'
      },
      {
        avaliador_id: FIXED_IDS.cliente2,
        avaliado_id: FIXED_IDS.prestador1,
        nota: 4,
        comentario: 'Bom trabalho, recomendo!'
      },
      {
        avaliador_id: FIXED_IDS.cliente1,
        avaliado_id: FIXED_IDS.prestador2,
        nota: 5,
        comentario: 'Resolveu meu problema elétrico rapidamente.'
      }
    ];

    for (const avaliacao of avaliacoes) {
      const { error } = await supabase
        .from('avaliacoes')
        .insert(avaliacao);
      
      if (error) {
        console.log('Avaliação:', error.message);
      }
    }

    // 5. Criar Conversas
    console.log('💬 Criando conversas...');
    const conversa = {
      cliente_id: FIXED_IDS.cliente1,
      prestador_id: FIXED_IDS.prestador1,
      servico_solicitado: 'Limpeza completa da casa',
      status: 'ativa'
    };

    const { data: conversaData, error: conversaError } = await supabase
      .from('chat_conversations')
      .insert(conversa)
      .select()
      .single();

    if (!conversaError && conversaData) {
      // 6. Criar Mensagens
      console.log('📨 Criando mensagens...');
      const mensagens = [
        {
          conversation_id: conversaData.id,
          sender_id: FIXED_IDS.cliente1,
          content: 'Olá! Preciso de uma limpeza completa da minha casa.',
          message_type: 'text'
        },
        {
          conversation_id: conversaData.id,
          sender_id: FIXED_IDS.prestador1,
          content: 'Olá! Posso ajudar sim. Qual o tamanho da casa?',
          message_type: 'text'
        },
        {
          conversation_id: conversaData.id,
          sender_id: FIXED_IDS.cliente1,
          content: 'São 3 quartos, 2 banheiros, sala e cozinha.',
          message_type: 'text'
        }
      ];

      for (const mensagem of mensagens) {
        const { error } = await supabase
          .from('chat_messages')
          .insert(mensagem);
        
        if (error) {
          console.log('Mensagem:', error.message);
        }
      }
    }

    // 7. Criar Pedidos
    console.log('📋 Criando pedidos...');
    const pedidos = [
      {
        cliente_id: FIXED_IDS.cliente1,
        prestador_id: FIXED_IDS.prestador1,
        servico_id: FIXED_IDS.servico1,
        titulo: 'Limpeza completa residencial',
        descricao: 'Preciso de uma limpeza completa da casa, incluindo quartos, banheiros e área comum.',
        status: 'pendente',
        preco_acordado: 120.00,
        endereco_completo: 'Rua Principal, 100, Centro, Sinop - MT'
      },
      {
        cliente_id: FIXED_IDS.cliente2,
        prestador_id: FIXED_IDS.prestador2,
        servico_id: FIXED_IDS.servico2,
        titulo: 'Instalação de ventilador de teto',
        descricao: 'Instalar ventilador de teto no quarto.',
        status: 'aceito',
        preco_acordado: 80.00,
        endereco_completo: 'Av. Teles Pires, 200, Jardim Tropical, Sinop - MT'
      }
    ];

    for (const pedido of pedidos) {
      const { error } = await supabase
        .from('pedidos')
        .insert(pedido);
      
      if (error) {
        console.log('Pedido:', error.message);
      }
    }

    // 8. Criar dados de Premium
    console.log('👑 Criando dados premium...');
    const premiumData = [
      {
        usuario_id: FIXED_IDS.admin,
        ativo: true,
        desde: new Date().toISOString(),
        expira_em: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        usuario_id: FIXED_IDS.prestador1,
        ativo: true,
        desde: new Date().toISOString(),
        expira_em: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
      }
    ];

    for (const premium of premiumData) {
      const { error } = await supabase
        .from('usuarios_premium')
        .upsert(premium);
      
      if (error) {
        console.log('Premium:', error.message);
      }
    }

    console.log('✅ Sistema completo de dados fake criado com sucesso!');
    console.log(`
    🎯 Dados criados:
    - ✅ 3 Serviços (Limpeza, Eletricista, Encanador)
    - ✅ 6 Usuários (1 Admin, 3 Prestadores, 2 Clientes)
    - ✅ 3 Relações Prestador-Serviços
    - ✅ 3 Avaliações
    - ✅ 1 Conversa com 3 mensagens
    - ✅ 2 Pedidos
    - ✅ 2 Usuários Premium
    
    🔑 Credenciais de teste:
    - Admin: admin@zurbo.com
    - Prestador PRO: ana@zurbo.com
    - Prestador Básico: carlos@zurbo.com
    - Cliente Premium: pedro@cliente.com
    - Cliente Básico: joao@cliente.com
    
    Agora você pode testar todas as funcionalidades da plataforma!
    `);

    return {
      success: true,
      message: 'Sistema completo criado com sucesso!',
      data: {
        usuarios: usuariosData.length,
        servicos: servicosData.length,
        avaliacoes: avaliacoes.length,
        pedidos: pedidos.length
      }
    };

  } catch (error) {
    console.error('❌ Erro ao criar sistema de dados:', error);
    return {
      success: false,
      message: 'Erro ao criar dados de teste',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
};

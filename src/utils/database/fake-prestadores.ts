
import { supabase } from '@/integrations/supabase/client';

// Enhanced fake data for 10 complete prestadores
export const fakePrestadores = [
  {
    nome: 'João Silva Santos',
    email: 'joao.silva.santos@teste.com',
    tipo: 'prestador',
    bio: 'Eletricista experiente com 15 anos no mercado. Especialista em instalações residenciais, comerciais e industriais. Atendimento 24h para emergências.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Centro',
    endereco_rua: 'Rua das Palmeiras, 123',
    endereco_cep: '78550-000',
    cpf: '123.456.789-01',
    nota_media: 4.9,
    premium: true,
    servicos: ['Eletricista'],
    telefone: '(66) 99999-1111',
    foto_url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 47,
    servicos_concluidos: 156,
    ganhos_mes: 3850.00
  },
  {
    nome: 'Maria Santos Oliveira',
    email: 'maria.santos.oliveira@teste.com',
    tipo: 'prestador',
    bio: 'Profissional de limpeza há 12 anos. Especialista em limpeza residencial, pós-obra e eventos. Uso produtos ecológicos e equipamentos modernos.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim Botânico',
    endereco_rua: 'Av. das Flores, 456',
    endereco_cep: '78550-010',
    cpf: '234.567.890-12',
    nota_media: 4.8,
    premium: false,
    servicos: ['Faxina'],
    telefone: '(66) 99999-2222',
    foto_url: 'https://images.unsplash.com/photo-1494790108755-2616c00e4d8b?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 32,
    servicos_concluidos: 89,
    ganhos_mes: 2100.00
  },
  {
    nome: 'Carlos Eduardo Pereira',
    email: 'carlos.eduardo.pereira@teste.com',
    tipo: 'prestador',
    bio: 'Encanador com 18 anos de experiência. Atendo emergências 24h. Especialista em vazamentos, instalações hidráulicas e sistemas de aquecimento.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Vila Rica',
    endereco_rua: 'Rua do Comércio, 789',
    endereco_cep: '78550-020',
    cpf: '345.678.901-23',
    nota_media: 4.7,
    premium: true,
    servicos: ['Encanador'],
    telefone: '(66) 99999-3333',
    foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 61,
    servicos_concluidos: 203,
    ganhos_mes: 4200.00
  },
  {
    nome: 'Ana Paula Santos',
    email: 'ana.paula.santos@teste.com',
    tipo: 'prestador',
    bio: 'Pintora profissional há 10 anos. Especialista em texturas, acabamentos especiais e restauração. Trabalho com tintas de alta qualidade.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Setor Industrial',
    endereco_rua: 'Rua da Indústria, 321',
    endereco_cep: '78550-030',
    cpf: '456.789.012-34',
    nota_media: 4.6,
    premium: false,
    servicos: ['Pintor'],
    telefone: '(66) 99999-4444',
    foto_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 28,
    servicos_concluidos: 76,
    ganhos_mes: 2850.00
  },
  {
    nome: 'Roberto Costa Lima',
    email: 'roberto.costa.lima@teste.com',
    tipo: 'prestador',
    bio: 'Jardineiro e paisagista com 14 anos de experiência. Especialista em design de jardins, manutenção de plantas e sistemas de irrigação.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Residencial Florença',
    endereco_rua: 'Rua das Orquídeas, 654',
    endereco_cep: '78550-040',
    cpf: '567.890.123-45',
    nota_media: 4.5,
    premium: true,
    servicos: ['Jardinagem'],
    telefone: '(66) 99999-5555',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 39,
    servicos_concluidos: 112,
    ganhos_mes: 3100.00
  },
  {
    nome: 'Fernanda Lima Silva',
    email: 'fernanda.lima.silva@teste.com',
    tipo: 'prestador',
    bio: 'Cabeleireira há 8 anos. Especialista em cortes modernos, coloração, tratamentos capilares e penteados para eventos especiais.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Centro',
    endereco_rua: 'Rua Bandeira Paulista, 987',
    endereco_cep: '78550-050',
    cpf: '678.901.234-56',
    nota_media: 4.9,
    premium: true,
    servicos: ['Cabeleireiro'],
    telefone: '(66) 99999-6666',
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 84,
    servicos_concluidos: 267,
    ganhos_mes: 4850.00
  },
  {
    nome: 'Ricardo Alves Costa',
    email: 'ricardo.alves.costa@teste.com',
    tipo: 'prestador',
    bio: 'Técnico em ar condicionado com 11 anos de experiência. Instalação, manutenção e reparo de equipamentos residenciais e comerciais.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Vila Popular',
    endereco_rua: 'Av. Santo Amaro, 1500',
    endereco_cep: '78550-060',
    cpf: '789.012.345-67',
    nota_media: 4.4,
    premium: false,
    servicos: ['Ar Condicionado'],
    telefone: '(66) 99999-7777',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 23,
    servicos_concluidos: 67,
    ganhos_mes: 2650.00
  },
  {
    nome: 'Patrícia Rocha Mendes',
    email: 'patricia.rocha.mendes@teste.com',
    tipo: 'prestador',
    bio: 'Manicure e pedicure profissional há 9 anos. Atendimento domiciliar com materiais esterilizados e produtos de alta qualidade.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim das Palmeiras',
    endereco_rua: 'Rua Cardoso de Almeida, 250',
    endereco_cep: '78550-070',
    cpf: '890.123.456-78',
    nota_media: 4.7,
    premium: false,
    servicos: ['Manicure'],
    telefone: '(66) 99999-8888',
    foto_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 56,
    servicos_concluidos: 178,
    ganhos_mes: 1950.00
  },
  {
    nome: 'Marcos Antonio Souza',
    email: 'marcos.antonio.souza@teste.com',
    tipo: 'prestador',
    bio: 'Pedreiro e construtor com 20 anos de experiência. Especialista em reformas, alvenaria, acabamentos e pequenas construções.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Setor Comercial',
    endereco_rua: 'Rua da Construção, 789',
    endereco_cep: '78550-080',
    cpf: '901.234.567-89',
    nota_media: 4.8,
    premium: true,
    servicos: ['Pedreiro'],
    telefone: '(66) 99999-9999',
    foto_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 73,
    servicos_concluidos: 234,
    ganhos_mes: 5200.00
  },
  {
    nome: 'Juliana Ferreira Santos',
    email: 'juliana.ferreira.santos@teste.com',
    tipo: 'prestador',
    bio: 'Massagista terapêutica há 7 anos. Especialista em massagem relaxante, desportiva e terapêutica. Atendimento domiciliar disponível.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim Itália',
    endereco_rua: 'Rua Funchal, 200',
    endereco_cep: '78550-090',
    cpf: '012.345.678-90',
    nota_media: 4.6,
    premium: false,
    servicos: ['Massagem'],
    telefone: '(66) 99999-0000',
    foto_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 41,
    servicos_concluidos: 123,
    ganhos_mes: 2750.00
  }
];

// Sample reviews for each prestador
export const fakeReviews = [
  {
    prestador_email: 'joao.silva.santos@teste.com',
    reviews: [
      { nota: 5, comentario: 'Excelente profissional! Resolveu o problema elétrico rapidamente.', avaliador_nome: 'Cliente Satisfeito' },
      { nota: 5, comentario: 'Muito competente e pontual. Recomendo!', avaliador_nome: 'Maria Cliente' },
      { nota: 4, comentario: 'Bom trabalho, mas poderia ser mais rápido.', avaliador_nome: 'João Cliente' }
    ]
  },
  {
    prestador_email: 'maria.santos.oliveira@teste.com',
    reviews: [
      { nota: 5, comentario: 'Casa ficou impecável! Muito cuidadosa com os detalhes.', avaliador_nome: 'Ana Silva' },
      { nota: 5, comentario: 'Profissional excepcional, sempre contrato seus serviços.', avaliador_nome: 'Carlos Santos' }
    ]
  }
  // Add more reviews for other prestadores as needed
];

export const createFakePrestadores = async () => {
  try {
    console.log('Criando prestadores de teste...');
    
    // First, get or create services
    const { data: servicos } = await supabase
      .from('servicos')
      .select('*');

    const servicosMap = new Map();
    servicos?.forEach(servico => {
      servicosMap.set(servico.nome, servico.id);
    });

    // Insert fake prestadores
    for (const prestador of fakePrestadores) {
      // Insert user
      const { data: insertedUser, error: userError } = await supabase
        .from('users')
        .upsert({
          nome: prestador.nome,
          email: prestador.email,
          tipo: prestador.tipo,
          bio: prestador.bio,
          endereco_cidade: prestador.endereco_cidade,
          endereco_bairro: prestador.endereco_bairro,
          endereco_rua: prestador.endereco_rua,
          endereco_cep: prestador.endereco_cep,
          cpf: prestador.cpf,
          nota_media: prestador.nota_media,
          premium: prestador.premium,
          foto_url: prestador.foto_url,
          auth_id: `fake-${prestador.email}`
        }, { onConflict: 'email' })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        continue;
      }

      // Add prestador services
      for (const servicoNome of prestador.servicos) {
        const servicoId = servicosMap.get(servicoNome);
        if (servicoId) {
          await supabase
            .from('prestador_servicos')
            .upsert({
              prestador_id: insertedUser.id,
              servico_id: servicoId,
              preco_min: Math.floor(Math.random() * 100) + 50,
              preco_max: Math.floor(Math.random() * 200) + 150
            });
        }
      }

      // Add premium plan if applicable - using 'usuarios_premium' table instead of 'plano_premium'
      if (prestador.premium) {
        await supabase
          .from('usuarios_premium')
          .upsert({
            usuario_id: insertedUser.id,
            ativo: true,
            desde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            expira_em: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
      }

      // Add some fake service history
      for (let i = 0; i < Math.min(prestador.servicos_concluidos, 10); i++) {
        const servicoId = servicosMap.get(prestador.servicos[0]);
        if (servicoId) {
          await supabase
            .from('historico_servicos')
            .insert({
              prestador_id: insertedUser.id,
              solicitante_id: insertedUser.id, // Simplified for testing
              servico_id: servicoId,
              data_servico: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
              valor: Math.floor(Math.random() * 300) + 50,
              status: 'concluido'
            });
        }
      }

      console.log(`Created prestador: ${prestador.nome}`);
    }

    console.log('Todos os prestadores foram criados com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro geral ao criar prestadores fake:', error);
    return false;
  }
};

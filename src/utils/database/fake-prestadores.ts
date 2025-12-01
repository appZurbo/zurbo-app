
import { supabase } from '@/integrations/supabase/client';

// Enhanced fake data for comprehensive coverage of all service categories
export const fakePrestadores = [
  // 1. LIMPEZA (Limpeza, Diarista)
  {
    nome: 'Maria Santos Oliveira',
    email: 'maria.limpeza@teste.com',
    tipo: 'prestador',
    bio: 'Profissional de limpeza há 12 anos. Especialista em limpeza residencial, pós-obra e eventos. Uso produtos ecológicos e equipamentos modernos.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim Botânico',
    endereco_rua: 'Av. das Flores, 456',
    endereco_cep: '78550-010',
    cpf: '234.567.890-12',
    nota_media: 4.8,
    premium: false,
    servicos: ['Limpeza'],
    telefone: '(66) 99999-2222',
    foto_url: 'https://images.unsplash.com/photo-1494790108755-2616c00e4d8b?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 32,
    servicos_concluidos: 89,
    ganhos_mes: 2100.00
  },
  {
    nome: 'Joana da Silva',
    email: 'joana.diarista@teste.com',
    tipo: 'prestador',
    bio: 'Diarista caprichosa e de confiança. Experiência em casas de família e escritórios. Referências disponíveis.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Centro',
    endereco_rua: 'Rua das Orquídeas, 101',
    endereco_cep: '78550-015',
    cpf: '999.888.777-66',
    nota_media: 4.9,
    premium: true,
    servicos: ['Diarista'],
    telefone: '(66) 99999-2233',
    foto_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 55,
    servicos_concluidos: 140,
    ganhos_mes: 3500.00
  },

  // 2. REPAROS (Montador de móveis, Pedreiro, Encanador)
  {
    nome: 'Carlos Eduardo Pereira',
    email: 'carlos.encanador@teste.com',
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
    nome: 'Pedro Montador',
    email: 'pedro.moveis@teste.com',
    tipo: 'prestador',
    bio: 'Montagem e desmontagem de móveis em geral. Guarda-roupas, estantes, armários de cozinha. Serviço rápido e limpo.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim das Oliveiras',
    endereco_rua: 'Av. dos Pinheiros, 44',
    endereco_cep: '78550-025',
    cpf: '111.222.333-44',
    nota_media: 4.5,
    premium: false,
    servicos: ['Montador de móveis'],
    telefone: '(66) 99999-3344',
    foto_url: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 28,
    servicos_concluidos: 95,
    ganhos_mes: 2800.00
  },

  // 3. ELÉTRICA (Eletricista)
  {
    nome: 'João Silva Santos',
    email: 'joao.eletrica@teste.com',
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

  // 4. BELEZA (Beleza, Cabeleireiro(a))
  {
    nome: 'Fernanda Lima Silva',
    email: 'fernanda.beleza@teste.com',
    tipo: 'prestador',
    bio: 'Cabeleireira há 8 anos. Especialista em cortes modernos, coloração, tratamentos capilares e penteados para eventos especiais.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Centro',
    endereco_rua: 'Rua Bandeira Paulista, 987',
    endereco_cep: '78550-050',
    cpf: '678.901.234-56',
    nota_media: 4.9,
    premium: true,
    servicos: ['Cabeleireiro(a)'],
    telefone: '(66) 99999-6666',
    foto_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 84,
    servicos_concluidos: 267,
    ganhos_mes: 4850.00
  },

  // 5. CONSTRUÇÃO (Construção, Pintor)
  {
    nome: 'Marcos Antonio Souza',
    email: 'marcos.construcao@teste.com',
    tipo: 'prestador',
    bio: 'Pedreiro e construtor com 20 anos de experiência. Especialista em reformas, alvenaria, acabamentos e pequenas construções.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Setor Comercial',
    endereco_rua: 'Rua da Construção, 789',
    endereco_cep: '78550-080',
    cpf: '901.234.567-89',
    nota_media: 4.8,
    premium: true,
    servicos: ['Pedreiro', 'Construção'],
    telefone: '(66) 99999-9999',
    foto_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 73,
    servicos_concluidos: 234,
    ganhos_mes: 5200.00
  },
  {
    nome: 'Ana Paula Santos',
    email: 'ana.pintora@teste.com',
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

  // 6. JARDINAGEM (Jardineiro)
  {
    nome: 'Roberto Costa Lima',
    email: 'roberto.jardim@teste.com',
    tipo: 'prestador',
    bio: 'Jardineiro e paisagista com 14 anos de experiência. Especialista em design de jardins, manutenção de plantas e sistemas de irrigação.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Residencial Florença',
    endereco_rua: 'Rua das Orquídeas, 654',
    endereco_cep: '78550-040',
    cpf: '567.890.123-45',
    nota_media: 4.5,
    premium: true,
    servicos: ['Jardineiro'],
    telefone: '(66) 99999-5555',
    foto_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 39,
    servicos_concluidos: 112,
    ganhos_mes: 3100.00
  },

  // 7. FRETES (Fretes)
  {
    nome: 'Paulo Fretes Rápidos',
    email: 'paulo.fretes@teste.com',
    tipo: 'prestador',
    bio: 'Faço fretes e mudanças para toda região. Caminhão baú, seguro de carga e ajudantes disponíveis. Pontualidade e cuidado com seus pertences.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim Primavera',
    endereco_rua: 'Av. dos Transportes, 500',
    endereco_cep: '78550-085',
    cpf: '321.654.987-00',
    nota_media: 4.8,
    premium: false,
    servicos: ['Fretes'],
    telefone: '(66) 99999-8877',
    foto_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 42,
    servicos_concluidos: 180,
    ganhos_mes: 4500.00
  },

  // 8. CHAVEIRO (Chaveiro)
  {
    nome: 'André Chaves',
    email: 'andre.chaveiro@teste.com',
    tipo: 'prestador',
    bio: 'Chaveiro 24h. Abertura de portas, cofres e veículos. Cópias de chaves codificadas. Atendimento rápido em qualquer local.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Centro',
    endereco_rua: 'Rua das Chaves, 20',
    endereco_cep: '78550-095',
    cpf: '777.666.555-44',
    nota_media: 4.9,
    premium: true,
    servicos: ['Chaveiro'],
    telefone: '(66) 99999-1122',
    foto_url: 'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 88,
    servicos_concluidos: 310,
    ganhos_mes: 5500.00
  },

  // 9. COZINHA (Cozinha)
  {
    nome: 'Chef Helena Martins',
    email: 'helena.chef@teste.com',
    tipo: 'prestador',
    bio: 'Chef de cozinha para eventos particulares e jantares especiais. Especialista em culinária brasileira e internacional.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim Imperial',
    endereco_rua: 'Av. Gastronômica, 80',
    endereco_cep: '78550-100',
    cpf: '222.333.444-55',
    nota_media: 5.0,
    premium: true,
    servicos: ['Cozinha'],
    telefone: '(66) 99999-5544',
    foto_url: 'https://images.unsplash.com/photo-1583336137498-afdf44ae98b6?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 15,
    servicos_concluidos: 40,
    ganhos_mes: 3200.00
  },

  // 10. TECNOLOGIA (Serviços de TI)
  {
    nome: 'Lucas Tech',
    email: 'lucas.ti@teste.com',
    tipo: 'prestador',
    bio: 'Suporte técnico em informática. Formatação, remoção de vírus, configuração de redes e reparo de computadores e notebooks.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Centro',
    endereco_rua: 'Rua da Tecnologia, 512',
    endereco_cep: '78550-110',
    cpf: '555.444.333-22',
    nota_media: 4.7,
    premium: false,
    servicos: ['Serviços de TI'],
    telefone: '(66) 99999-7788',
    foto_url: 'https://images.unsplash.com/photo-1504703395950-b89145154253?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 25,
    servicos_concluidos: 80,
    ganhos_mes: 2400.00
  },

  // 11. CUIDADOS (Babá, Cuidador de idosos, Pet Care)
  {
    nome: 'Sandra Cuidadores',
    email: 'sandra.cuidadora@teste.com',
    tipo: 'prestador',
    bio: 'Cuidadora de idosos com curso de enfermagem. Experiência em cuidados especiais, administração de medicamentos e companhia.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim Jacarandás',
    endereco_rua: 'Av. do Carinho, 300',
    endereco_cep: '78550-120',
    cpf: '888.999.000-11',
    nota_media: 4.9,
    premium: true,
    servicos: ['Cuidador(a) de idosos'],
    telefone: '(66) 99999-9988',
    foto_url: 'https://images.unsplash.com/photo-1554151228-14d9def656ec?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 30,
    servicos_concluidos: 60, // Contratos longos contam menos como "serviços concluídos"
    ganhos_mes: 3000.00
  },
  {
    nome: 'Julia Pet Sitter',
    email: 'julia.pets@teste.com',
    tipo: 'prestador',
    bio: 'Amante de animais! Ofereço serviços de pet sitter e dog walker. Cuido do seu pet com todo amor e carinho enquanto você viaja.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Jardim América',
    endereco_rua: 'Rua dos Animais, 55',
    endereco_cep: '78550-125',
    cpf: '111.555.999-33',
    nota_media: 4.8,
    premium: false,
    servicos: ['Pet Care'],
    telefone: '(66) 99999-1100',
    foto_url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 45,
    servicos_concluidos: 150,
    ganhos_mes: 1800.00
  },

  // 12. REFRIGERAÇÃO (Refrigeração)
  {
    nome: 'Ricardo Alves Costa',
    email: 'ricardo.refrigeracao@teste.com',
    tipo: 'prestador',
    bio: 'Técnico em ar condicionado com 11 anos de experiência. Instalação, manutenção e reparo de equipamentos residenciais e comerciais.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Vila Popular',
    endereco_rua: 'Av. Santo Amaro, 1500',
    endereco_cep: '78550-060',
    cpf: '789.012.345-67',
    nota_media: 4.4,
    premium: false,
    servicos: ['Refrigeração'],
    telefone: '(66) 99999-7777',
    foto_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 23,
    servicos_concluidos: 67,
    ganhos_mes: 2650.00
  },

  // 13. MECÂNICO (Mecânico)
  {
    nome: 'Oficina do Tiago',
    email: 'tiago.mecanico@teste.com',
    tipo: 'prestador',
    bio: 'Mecânico automotivo especializado em injeção eletrônica e revisão geral. Serviço de socorro mecânico disponível.',
    endereco_cidade: 'Sinop, Mato Grosso',
    endereco_bairro: 'Setor Industrial Norte',
    endereco_rua: 'Av. das Oficinas, 1000',
    endereco_cep: '78550-130',
    cpf: '444.555.666-77',
    nota_media: 4.6,
    premium: true,
    servicos: ['Mecânico'],
    telefone: '(66) 99999-2200',
    foto_url: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&h=200&fit=crop&crop=face',
    avaliacoes_count: 38,
    servicos_concluidos: 115,
    ganhos_mes: 5800.00
  }
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
      // CHECK IF USER EXISTS FIRST
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, auth_id')
        .eq('email', prestador.email)
        .maybeSingle();

      let finalAuthId = existingUser?.auth_id;
      
      if (!finalAuthId) {
        // Generate a new proper UUID for auth_id if user doesn't exist or has no auth_id
        finalAuthId = crypto.randomUUID();
      }

      // Prepare user data
      const userData = {
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
        auth_id: finalAuthId
      };

      // Insert user
      const { data: insertedUser, error: userError } = await supabase
        .from('users')
        .upsert(userData, { onConflict: 'email' })
        .select()
        .single();

      if (userError) {
        console.error('Error creating user:', userError);
        // Continue to next user instead of failing everything
        continue;
      }

      // Add prestador services
      for (const servicoNome of prestador.servicos) {
        let servicoId = servicosMap.get(servicoNome);
        
        // If service doesn't exist, create it on the fly (helpful for missing services)
        if (!servicoId) {
          const { data: newService } = await supabase
            .from('servicos')
            .insert({ nome: servicoNome, ativo: true })
            .select()
            .single();
            
          if (newService) {
            servicoId = newService.id;
            servicosMap.set(servicoNome, servicoId);
            console.log(`Created new service: ${servicoNome}`);
          }
        }
        
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

      // Add premium plan if applicable
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
      for (let i = 0; i < Math.min(prestador.servicos_concluidos || 0, 10); i++) {
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

      console.log(`Created/Updated prestador: ${prestador.nome}`);
    }

    console.log('Todos os prestadores foram processados com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro geral ao criar prestadores fake:', error);
    return false;
  }
};

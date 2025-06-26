
import { supabase } from '@/integrations/supabase/client';

// Dados fake para testes
export const fakeUsers = [
  {
    nome: 'João da Silva',
    email: 'joao.silva@teste.com',
    tipo: 'prestador',
    bio: 'Eletricista com 15 anos de experiência. Especialista em instalações residenciais e comerciais.',
    endereco_cidade: 'São Paulo',
    endereco_bairro: 'Vila Madalena',
    nota_media: 4.8,
    premium: true,
    servicos: ['Eletricista'],
    telefone: '(11) 99999-1111'
  },
  {
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@teste.com',
    tipo: 'prestador',
    bio: 'Faxineira profissional com foco em limpeza residencial e pós-obra.',
    endereco_cidade: 'São Paulo',
    endereco_bairro: 'Pinheiros',
    nota_media: 4.9,
    premium: false,
    servicos: ['Faxina'],
    telefone: '(11) 99999-2222'
  },
  {
    nome: 'Carlos Pereira',
    email: 'carlos.pereira@teste.com',
    tipo: 'prestador',
    bio: 'Encanador experiente, atendo emergências 24h. Especialista em vazamentos e instalações.',
    endereco_cidade: 'São Paulo',
    endereco_bairro: 'Jardins',
    nota_media: 4.7,
    premium: true,
    servicos: ['Encanador'],
    telefone: '(11) 99999-3333'
  },
  {
    nome: 'Ana Santos',
    email: 'ana.santos@teste.com',
    tipo: 'prestador',
    bio: 'Pintora profissional com especialidade em texturas e acabamentos especiais.',
    endereco_cidade: 'São Paulo',
    endereco_bairro: 'Moema',
    nota_media: 4.6,
    premium: false,
    servicos: ['Pintor'],
    telefone: '(11) 99999-4444'
  },
  {
    nome: 'Pedro Costa',
    email: 'pedro.costa@teste.com',
    tipo: 'cliente',
    endereco_cidade: 'São Paulo',
    endereco_bairro: 'Itaim Bibi'
  },
  {
    nome: 'Julia Ferreira',
    email: 'julia.ferreira@teste.com',
    tipo: 'cliente',
    endereco_cidade: 'São Paulo',
    endereco_bairro: 'Vila Olímpia'
  }
];

export const createFakeUsers = async () => {
  try {
    console.log('Criando usuários de teste...');
    
    // Inserir usuários fake
    const { data: insertedUsers, error: usersError } = await supabase
      .from('users')
      .upsert(fakeUsers.map(user => ({
        nome: user.nome,
        email: user.email,
        tipo: user.tipo,
        bio: user.bio || null,
        endereco_cidade: user.endereco_cidade || null,
        endereco_bairro: user.endereco_bairro || null,
        nota_media: user.nota_media || 0,
        premium: user.premium || false,
        auth_id: `fake-${user.email}` // ID fake para teste
      })), { onConflict: 'email' })
      .select();

    if (usersError) {
      console.error('Erro ao criar usuários:', usersError);
      return;
    }

    console.log('Usuários criados:', insertedUsers);

    // Adicionar dados para o usuário real também
    const { error: realUserError } = await supabase
      .from('users')
      .upsert({
        email: 'roquematheus@live.com',
        nome: 'Matheus Roque',
        tipo: 'prestador',
        bio: 'Desenvolvedor e empreendedor, fundador do Zurbo.',
        endereco_cidade: 'São Paulo',
        endereco_bairro: 'Centro',
        nota_media: 5.0,
        premium: true
      }, { onConflict: 'email' });

    if (realUserError) {
      console.error('Erro ao atualizar usuário real:', realUserError);
    }

    return insertedUsers;
  } catch (error) {
    console.error('Erro geral ao criar dados fake:', error);
  }
};

export const createFakeHistorico = async () => {
  try {
    // Buscar prestadores para criar histórico
    const { data: prestadores } = await supabase
      .from('users')
      .select('id')
      .eq('tipo', 'prestador')
      .limit(5);

    if (!prestadores || prestadores.length === 0) return;

    const historicoFake = [];
    
    prestadores.forEach(prestador => {
      // Criar alguns registros de histórico para cada prestador
      for (let i = 0; i < 5; i++) {
        historicoFake.push({
          prestador_id: prestador.id,
          solicitante_id: prestador.id, // Simplificado para teste
          servico_id: prestador.id, // Simplificado para teste
          data_servico: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          valor: Math.floor(Math.random() * 500) + 50,
          status: 'concluido'
        });
      }
    });

    const { error } = await supabase
      .from('historico_servicos')
      .insert(historicoFake);

    if (error) {
      console.error('Erro ao criar histórico fake:', error);
    } else {
      console.log('Histórico fake criado com sucesso');
    }
  } catch (error) {
    console.error('Erro geral ao criar histórico:', error);
  }
};

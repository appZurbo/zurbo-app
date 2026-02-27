import { supabase } from '@/integrations/supabase/client';

// Dados fake para testes - 10 usuários completos
export const fakeUsers = [
  {
    nome: 'João da Silva',
    email: 'joao.silva@teste.com',
    tipo: 'prestador',
    bio: 'Eletricista com 15 anos de experiência. Especialista em instalações residenciais e comerciais.',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Vila Madalena',
    endereco_rua: 'Rua Harmonia, 123',
    endereco_cep: '05435-000',
    cpf: '123.456.789-01',
    nota_media: 4.8,
    premium: true,
    servicos: ['Eletricista'],
    telefone: '(66) 99914-5353',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Joao'
  },
  {
    nome: 'Maria Oliveira',
    email: 'maria.oliveira@teste.com',
    tipo: 'prestador',
    bio: 'Faxineira profissional com foco em limpeza residencial e pós-obra. Trabalho com produtos ecológicos.',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Pinheiros',
    endereco_rua: 'Rua dos Pinheiros, 456',
    endereco_cep: '05422-001',
    cpf: '234.567.890-12',
    nota_media: 4.9,
    premium: false,
    servicos: ['Faxina'],
    telefone: '(66) 99914-5353',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Maria'
  },
  {
    nome: 'Carlos Pereira',
    email: 'carlos.pereira@teste.com',
    tipo: 'prestador',
    bio: 'Encanador experiente, atendo emergências 24h. Especialista em vazamentos e instalações hidráulicas.',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Jardins',
    endereco_rua: 'Rua Augusta, 789',
    endereco_cep: '01305-100',
    cpf: '345.678.901-23',
    nota_media: 4.7,
    premium: true,
    servicos: ['Encanador'],
    telefone: '(66) 99914-5353',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Carlos'
  },
  {
    nome: 'Ana Santos',
    email: 'ana.santos@teste.com',
    tipo: 'prestador',
    bio: 'Pintora profissional com especialidade em texturas e acabamentos especiais. 10 anos de experiência.',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Moema',
    endereco_rua: 'Av. Ibirapuera, 321',
    endereco_cep: '04029-200',
    cpf: '456.789.012-34',
    nota_media: 4.6,
    premium: false,
    servicos: ['Pintor'],
    telefone: '(66) 99914-5353',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Ana'
  },
  {
    nome: 'Roberto Costa',
    email: 'roberto.costa@teste.com',
    tipo: 'prestador',
    bio: 'Jardineiro e paisagista. Especialista em manutenção de jardins e criação de espaços verdes.',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Vila Olímpia',
    endereco_rua: 'Rua Olimpíadas, 654',
    endereco_cep: '04551-000',
    cpf: '567.890.123-45',
    nota_media: 4.5,
    premium: true,
    servicos: ['Jardinagem'],
    telefone: '(66) 99914-5353',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Roberto'
  },
  {
    nome: 'Fernanda Lima',
    email: 'fernanda.lima@teste.com',
    tipo: 'prestador',
    bio: 'Cabeleireira profissional. Especialista em cortes modernos, coloração e tratamentos capilares.',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Itaim Bibi',
    endereco_rua: 'Rua Bandeira Paulista, 987',
    endereco_cep: '04532-001',
    cpf: '678.901.234-56',
    nota_media: 4.9,
    premium: true,
    servicos: ['Cabeleireiro'],
    telefone: '(66) 99914-5353',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Fernanda'
  },
  {
    nome: 'Ricardo Alves',
    email: 'ricardo.alves@teste.com',
    tipo: 'prestador',
    bio: 'Técnico em ar condicionado. Instalação, manutenção e reparo de equipamentos de climatização.',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Brooklin',
    endereco_rua: 'Av. Santo Amaro, 1500',
    endereco_cep: '04506-000',
    cpf: '789.012.345-67',
    nota_media: 4.4,
    premium: false,
    servicos: ['Ar Condicionado'],
    telefone: '(66) 99914-5353',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Ricardo'
  },
  {
    nome: 'Patrícia Rocha',
    email: 'patricia.rocha@teste.com',
    tipo: 'prestador',
    bio: 'Manicure e pedicure profissional. Atendimento domiciliar com materiais esterilizados.',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Perdizes',
    endereco_rua: 'Rua Cardoso de Almeida, 250',
    endereco_cep: '05013-001',
    cpf: '890.123.456-78',
    nota_media: 4.7,
    premium: false,
    servicos: ['Manicure'],
    telefone: '(66) 99914-5353',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Patricia'
  },
  {
    nome: 'Pedro Costa',
    email: 'pedro.costa@teste.com',
    tipo: 'cliente',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Itaim Bibi',
    endereco_rua: 'Rua Pedroso Alvarenga, 100',
    endereco_cep: '04531-004',
    cpf: '901.234.567-89',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Pedro'
  },
  {
    nome: 'Julia Ferreira',
    email: 'julia.ferreira@teste.com',
    tipo: 'cliente',
    endereco_cidade: 'Sinop',
    endereco_bairro: 'Vila Olímpia',
    endereco_rua: 'Rua Funchal, 200',
    endereco_cep: '04551-060',
    cpf: '012.345.678-90',
    foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Julia'
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
        endereco_rua: user.endereco_rua || null,
        endereco_cep: user.endereco_cep || null,
        cpf: user.cpf || null,
        nota_media: user.nota_media || 0,
        premium: user.premium || false,
        foto_url: user.foto_url || `https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=${encodeURIComponent(user.nome)}`,
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
        endereco_cidade: 'Sinop',
        endereco_bairro: 'Centro',
        endereco_cep: '01310-100',
        cpf: '000.000.000-00',
        nota_media: 5.0,
        premium: true,
        foto_url: 'https://api.dicebear.com/7.x/avataaars/svg?mouth=smile,serious,default&seed=Matheus'
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
      .limit(8);

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

// Função para criar agendamentos fake
export const createFakeAgendamentos = async () => {
  try {
    const { data: prestadores } = await supabase
      .from('users')
      .select('id')
      .eq('tipo', 'prestador')
      .limit(8);

    const { data: clientes } = await supabase
      .from('users')
      .select('id')
      .eq('tipo', 'cliente')
      .limit(2);

    if (!prestadores || !clientes || prestadores.length === 0 || clientes.length === 0) return;

    const agendamentosFake = [];

    prestadores.forEach(prestador => {
      // Criar 2-3 agendamentos para cada prestador
      for (let i = 0; i < Math.floor(Math.random() * 3) + 2; i++) {
        const cliente = clientes[Math.floor(Math.random() * clientes.length)];
        const dataFutura = new Date();
        dataFutura.setDate(dataFutura.getDate() + Math.floor(Math.random() * 30) + 1);

        agendamentosFake.push({
          prestador_id: prestador.id,
          solicitante_id: cliente.id,
          titulo: `Serviço ${i + 1}`,
          descricao: `Descrição do serviço ${i + 1}`,
          data_agendada: dataFutura.toISOString().split('T')[0],
          hora_agendada: `${Math.floor(Math.random() * 12) + 8}:00`,
          endereco: 'Endereço do serviço',
          status: ['pendente', 'confirmado', 'em_andamento'][Math.floor(Math.random() * 3)],
          preco_acordado: Math.floor(Math.random() * 300) + 50,
          cliente_nome: 'Cliente Teste'
        });
      }
    });

    const { error } = await supabase
      .from('agendamentos')
      .insert(agendamentosFake);

    if (error) {
      console.error('Erro ao criar agendamentos fake:', error);
    } else {
      console.log('Agendamentos fake criados com sucesso');
    }
  } catch (error) {
    console.error('Erro geral ao criar agendamentos:', error);
  }
};

import { createFakePrestadores } from './fake-prestadores';

// Add the new function to create all fake data
export const createAllFakeData = async () => {
  try {
    console.log('Iniciando criação de dados de teste...');

    // Create original fake users
    await createFakeUsers();

    // Create fake prestadores with enhanced data
    await createFakePrestadores();

    // Create fake agendamentos
    await createFakeAgendamentos();

    // Create fake historico
    await createFakeHistorico();

    console.log('Todos os dados de teste foram criados com sucesso!');
    return true;
  } catch (error) {
    console.error('Erro ao criar dados de teste:', error);
    return false;
  }
};

// Export the new enhanced prestadores creation function
export { createFakePrestadores } from './fake-prestadores';

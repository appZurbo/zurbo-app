
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/toast-system";
import { Users, Loader2, Database, Settings } from 'lucide-react';

export const EnhancedFakeDataGenerator = () => {
  const [loading, setLoading] = useState(false);

  const generateCompleteTestData = async () => {
    setLoading(true);
    try {
      // Gerar prestadores com dados completos
      const providers = await generateProviders();
      
      // Gerar clientes
      const clients = await generateClients();
      
      // Gerar administradores
      const admins = await generateAdmins();
      
      // Gerar conversas e pedidos
      await generateConversationsAndOrders(providers, clients);
      
      // Gerar dados de pagamento
      await generatePaymentData();

      toast({
        title: "Dados de Teste Criados",
        description: `${providers.length + clients.length + admins.length} usuários e dados relacionados criados com sucesso`,
      });

    } catch (error) {
      console.error('Error generating test data:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar dados de teste",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const generateProviders = async () => {
    const services = await getServices();
    const providers = [];

    const providerData = [
      { nome: 'João Silva Reparos', email: 'joao.reparos@test.com', servicos: ['Encanador', 'Eletricista'], premium: true },
      { nome: 'Maria Limpeza Pro', email: 'maria.limpeza@test.com', servicos: ['Diarista', 'Limpeza'], premium: true },
      { nome: 'Carlos Jardim Verde', email: 'carlos.jardim@test.com', servicos: ['Jardineiro'], premium: false },
      { nome: 'Ana Beleza Total', email: 'ana.beleza@test.com', servicos: ['Manicure', 'Cabeleireira'], premium: true },
      { nome: 'Pedro Pintor Mestre', email: 'pedro.pintor@test.com', servicos: ['Pintor'], premium: false },
      { nome: 'Luiza Cozinha Gourmet', email: 'luiza.cozinha@test.com', servicos: ['Cozinheira'], premium: true },
      { nome: 'Roberto Marceneiro', email: 'roberto.marceneiro@test.com', servicos: ['Marceneiro'], premium: false },
      { nome: 'Sofia Cuidados Idosos', email: 'sofia.cuidados@test.com', servicos: ['Cuidador'], premium: true },
      { nome: 'Diego Tech Rápido', email: 'diego.tech@test.com', servicos: ['Técnico em Informática'], premium: false },
      { nome: 'Camila Pet Care', email: 'camila.pet@test.com', servicos: ['Pet Sitter'], premium: false }
    ];

    for (const provider of providerData) {
      const userData = {
        nome: provider.nome,
        email: provider.email,
        tipo: 'prestador',
        bio: `Profissional experiente em ${provider.servicos.join(', ')}. Atendimento de qualidade e pontualidade garantida.`,
        descricao_servico: `Especialista em ${provider.servicos.join(' e ')} com mais de 5 anos de experiência no mercado.`,
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: ['Centro', 'Jardim Botânico', 'Setor Comercial', 'Vila Rica'][Math.floor(Math.random() * 4)],
        latitude: -11.8647 + (Math.random() - 0.5) * 0.1,
        longitude: -55.5039 + (Math.random() - 0.5) * 0.1,
        nota_media: 3.5 + Math.random() * 1.5,
        premium: provider.premium,
        em_servico: true,
        is_test_user: true
      };

      const { data: user, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating provider:', error);
        continue;
      }

      // Adicionar serviços do prestador
      for (const serviceName of provider.servicos) {
        const service = services.find(s => s.nome === serviceName);
        if (service) {
          await supabase
            .from('prestador_servicos')
            .insert({
              prestador_id: user.id,
              servico_id: service.id,
              preco_min: 50 + Math.random() * 50,
              preco_max: 100 + Math.random() * 200
            });
        }
      }

      // Adicionar avaliações fake
      await generateReviews(user.id);
      
      // Adicionar ao plano premium se aplicável
      if (provider.premium) {
        await supabase
          .from('usuarios_premium')
          .insert({
            usuario_id: user.id,
            ativo: true,
            desde: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
            expira_em: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          });
      }

      providers.push(user);
    }

    return providers;
  };

  const generateClients = async () => {
    const clients = [];
    const clientData = [
      { nome: 'Cliente Test 01', email: 'cliente01@test.com' },
      { nome: 'Cliente Test 02', email: 'cliente02@test.com' },
      { nome: 'Cliente Test 03', email: 'cliente03@test.com' },
      { nome: 'Cliente Test 04', email: 'cliente04@test.com' },
      { nome: 'Cliente Test 05', email: 'cliente05@test.com' },
      { nome: 'Cliente Test 06', email: 'cliente06@test.com' },
      { nome: 'Cliente Test 07', email: 'cliente07@test.com' },
      { nome: 'Cliente Test 08', email: 'cliente08@test.com' },
      { nome: 'Cliente Test 09', email: 'cliente09@test.com' },
      { nome: 'Cliente Test 10', email: 'cliente10@test.com' }
    ];

    for (const client of clientData) {
      const userData = {
        nome: client.nome,
        email: client.email,
        tipo: 'cliente',
        bio: 'Cliente de teste para validação do sistema',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: ['Centro', 'Jardim Botânico', 'Setor Comercial', 'Vila Rica'][Math.floor(Math.random() * 4)],
        latitude: -11.8647 + (Math.random() - 0.5) * 0.1,
        longitude: -55.5039 + (Math.random() - 0.5) * 0.1,
        em_servico: true,
        is_test_user: true
      };

      const { data: user, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating client:', error);
        continue;
      }

      clients.push(user);
    }

    return clients;
  };

  const generateAdmins = async () => {
    const admins = [];
    const adminData = [
      { nome: 'Admin Test 01', email: 'admin01@test.com' },
      { nome: 'Admin Test 02', email: 'admin02@test.com' }
    ];

    for (const admin of adminData) {
      const userData = {
        nome: admin.nome,
        email: admin.email,
        tipo: 'admin',
        bio: 'Administrador de teste do sistema',
        endereco_cidade: 'Sinop, Mato Grosso',
        endereco_bairro: 'Centro',
        latitude: -11.8647,
        longitude: -55.5039,
        em_servico: true,
        is_test_user: true
      };

      const { data: user, error } = await supabase
        .from('users')
        .insert(userData)
        .select()
        .single();

      if (error) {
        console.error('Error creating admin:', error);
        continue;
      }

      admins.push(user);
    }

    return admins;
  };

  const generateConversationsAndOrders = async (providers: any[], clients: any[]) => {
    // Gerar algumas conversas e pedidos entre clientes e prestadores
    for (let i = 0; i < 15; i++) {
      const client = clients[Math.floor(Math.random() * clients.length)];
      const provider = providers[Math.floor(Math.random() * providers.length)];
      
      // Criar conversa
      const { data: conversation } = await supabase
        .from('chat_conversations')
        .insert({
          cliente_id: client.id,
          prestador_id: provider.id,
          servico_solicitado: 'Serviço de teste',
          status: Math.random() > 0.5 ? 'aceito' : 'aguardando_preco',
          preco_proposto: 50 + Math.random() * 200
        })
        .select()
        .single();

      if (conversation) {
        // Adicionar algumas mensagens
        await supabase
          .from('chat_messages')
          .insert([
            {
              conversation_id: conversation.id,
              sender_id: client.id,
              content: 'Olá, preciso de um orçamento para o serviço.',
              message_type: 'text'
            },
            {
              conversation_id: conversation.id,
              sender_id: provider.id,
              content: 'Claro! Posso te ajudar. Qual seria o serviço exatamente?',
              message_type: 'text'
            }
          ]);
      }
    }
  };

  const generatePaymentData = async () => {
    // Gerar alguns pagamentos de teste
    const { data: conversations } = await supabase
      .from('chat_conversations')
      .select('*')
      .limit(5);

    if (conversations) {
      for (const conv of conversations) {
        if (conv.preco_proposto) {
          await supabase
            .from('escrow_payments')
            .insert({
              conversation_id: conv.id,
              amount: conv.preco_proposto,
              currency: 'BRL',
              zurbo_fee: conv.preco_proposto * 0.05,
              status: Math.random() > 0.5 ? 'authorized' : 'captured',
              stripe_payment_intent_id: `pi_test_${Math.random().toString(36).substr(2, 9)}`
            });
        }
      }
    }
  };

  const generateReviews = async (providerId: string) => {
    const reviewCount = Math.floor(Math.random() * 8) + 2;
    const comments = [
      'Excelente profissional, muito pontual e caprichoso.',
      'Serviço de qualidade, recomendo!',
      'Muito atencioso e preço justo.',
      'Trabalho bem feito, ficou perfeito.',
      'Profissional competente e educado.',
      'Superou as expectativas, parabéns!',
      'Serviço rápido e eficiente.',
      'Muito satisfeito com o resultado.'
    ];

    for (let i = 0; i < reviewCount; i++) {
      await supabase
        .from('avaliacoes')
        .insert({
          avaliado_id: providerId,
          avaliador_id: providerId, // Fake reviews
          nota: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          comentario: comments[Math.floor(Math.random() * comments.length)],
          criado_em: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString()
        });
    }
  };

  const getServices = async () => {
    const { data: services } = await supabase
      .from('servicos')
      .select('id, nome')
      .eq('ativo', true);
    
    return services || [];
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Gerador de Dados Completo
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 text-sm text-gray-600">
          <p>Este gerador criará um conjunto completo de dados de teste:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>10 prestadores com perfis completos e avaliações</li>
            <li>10 clientes de teste</li>
            <li>2 administradores</li>
            <li>Conversas e mensagens entre usuários</li>
            <li>Pedidos e histórico de serviços</li>
            <li>Dados de pagamento e transações</li>
            <li>5 usuários premium com planos ativos</li>
          </ul>
        </div>
        
        <Button 
          onClick={generateCompleteTestData}
          disabled={loading}
          className="w-full mt-4"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando dados completos...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Gerar Dados Completos de Teste
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

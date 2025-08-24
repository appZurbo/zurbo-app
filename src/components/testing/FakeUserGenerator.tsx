
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { toast } from "@/hooks/use-toast";
import { Users, Loader2 } from 'lucide-react';

export const FakeUserGenerator = () => {
  const [loading, setLoading] = useState(false);

  const fakeUsers = {
    clients: [
      { nome: 'Ana Lima', email: 'ana.lima@fake.com', bio: 'Cliente frequente, busca serviços de qualidade' },
      { nome: 'Rafael Tech', email: 'rafael.tech@fake.com', bio: 'Profissional de TI, precisa de serviços domésticos' },
      { nome: 'Cliente Test01', email: 'cliente.test01@fake.com', bio: 'Cliente teste para validação' },
      { nome: 'Teste Normal', email: 'teste.normal@fake.com', bio: 'Usuário padrão do sistema' },
      { nome: 'Juliana Compras', email: 'juliana.compras@fake.com', bio: 'Sempre busca os melhores prestadores' },
      { nome: 'Cliente Inativo', email: 'cliente.inativo@fake.com', bio: 'Cliente com baixa atividade' }
    ],
    providers: [
      { 
        nome: 'Matheus Serviços', 
        email: 'matheus.servicos@fake.com', 
        bio: 'Prestador experiente com 5 anos no mercado',
        descricao_servico: 'Serviços gerais de manutenção e reparo',
        servicos: ['Encanador', 'Eletricista']
      },
      { 
        nome: 'Bruno Fix', 
        email: 'bruno.fix@fake.com', 
        bio: 'Especialista em reparos rápidos',
        descricao_servico: 'Reparos domésticos com agilidade',
        servicos: ['Marceneiro', 'Pintor']
      },
      { 
        nome: 'Prestador Express', 
        email: 'prestador.express@fake.com', 
        bio: 'Atendimento rápido e eficiente',
        descricao_servico: 'Serviços expressos para emergências',
        servicos: ['Chaveiro', 'Eletricista']
      },
      { 
        nome: 'Daniel Pro', 
        email: 'daniel.pro@fake.com', 
        bio: 'Profissional certificado e confiável',
        descricao_servico: 'Serviços profissionais de alta qualidade',
        servicos: ['Encanador', 'Técnico em Ar Condicionado']
      },
      { 
        nome: 'Fake Prestador', 
        email: 'fake.prestador@fake.com', 
        bio: 'Prestador para testes do sistema',
        descricao_servico: 'Serviços de teste e validação',
        servicos: ['Limpeza', 'Jardinagem']
      },
      { 
        nome: 'Prestador Top', 
        email: 'prestador.top@fake.com', 
        bio: 'Prestador premium com excelente avaliação',
        descricao_servico: 'Serviços premium com garantia',
        servicos: ['Pintor', 'Marceneiro']
      }
    ]
  };

  const generateFakeUsers = async () => {
    setLoading(true);
    try {
      // Get available services
      const { data: services } = await supabase
        .from('servicos')
        .select('id, nome')
        .eq('ativo', true);

      const serviceMap = services?.reduce((acc, service) => {
        acc[service.nome] = service.id;
        return acc;
      }, {} as Record<string, string>) || {};

      // Create clients
      const clientPromises = fakeUsers.clients.map(async (client) => {
        const { data: userData, error } = await supabase
          .from('users')
          .insert({
            nome: client.nome,
            email: client.email,
            tipo: 'cliente',
            bio: client.bio,
            endereco_cidade: 'São Paulo',
            endereco_bairro: 'Centro',
            latitude: -23.5505 + (Math.random() - 0.5) * 0.1,
            longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
            em_servico: true
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating client:', error);
          return null;
        }

        return userData;
      });

      // Create providers
      const providerPromises = fakeUsers.providers.map(async (provider) => {
        const { data: userData, error } = await supabase
          .from('users')
          .insert({
            nome: provider.nome,
            email: provider.email,
            tipo: 'prestador',
            bio: provider.bio,
            descricao_servico: provider.descricao_servico,
            endereco_cidade: 'São Paulo',
            endereco_bairro: 'Centro',
            latitude: -23.5505 + (Math.random() - 0.5) * 0.1,
            longitude: -46.6333 + (Math.random() - 0.5) * 0.1,
            nota_media: 4 + Math.random(),
            premium: Math.random() > 0.5,
            em_servico: true
          })
          .select()
          .single();

        if (error) {
          console.error('Error creating provider:', error);
          return null;
        }

        // Add services for provider
        if (userData && provider.servicos) {
          const serviceInserts = provider.servicos
            .map(serviceName => {
              const serviceId = serviceMap[serviceName];
              if (serviceId) {
                return {
                  prestador_id: userData.id,
                  servico_id: serviceId,
                  preco_min: 50 + Math.random() * 100,
                  preco_max: 150 + Math.random() * 200
                };
              }
              return null;
            })
            .filter(Boolean);

          if (serviceInserts.length > 0) {
            await supabase
              .from('prestador_servicos')
              .insert(serviceInserts);
          }

          // Add some fake reviews
          const reviewCount = Math.floor(Math.random() * 5) + 1;
          for (let i = 0; i < reviewCount; i++) {
            await supabase
              .from('avaliacoes')
              .insert({
                avaliado_id: userData.id,
                avaliador_id: userData.id, // Self-review for simplicity
                nota: Math.floor(Math.random() * 2) + 4, // 4-5 stars
                comentario: `Ótimo serviço, recomendo! Avaliação ${i + 1}`,
                criado_em: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
              });
          }
        }

        return userData;
      });

      const [clients, providers] = await Promise.all([
        Promise.all(clientPromises),
        Promise.all(providerPromises)
      ]);

      const successCount = clients.filter(Boolean).length + providers.filter(Boolean).length;
      
      toast({
        title: "Usuários Fake Criados",
        description: `${successCount} usuários foram criados com sucesso`,
      });

    } catch (error) {
      console.error('Error generating fake users:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar usuários fake",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Gerar Usuários Fake
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Serão criados:</p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>6 clientes de teste</li>
              <li>6 prestadores com serviços</li>
              <li>Avaliações e dados realistas</li>
            </ul>
          </div>
          
          <Button 
            onClick={generateFakeUsers}
            disabled={loading}
            className="w-full"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Criando usuários...
              </>
            ) : (
              'Gerar Usuários Fake'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

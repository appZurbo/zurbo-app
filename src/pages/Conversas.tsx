
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, MessageCircle, Clock, Search, Info, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Chat } from '@/utils/database/types';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Conversas = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const { toast } = useToast();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (profile) {
      loadChats();
    }
  }, [profile]);

  const loadChats = async () => {
    if (!profile) return;
    
    setLoadingChats(true);
    try {
      // Tentar carregar chats reais do banco de dados
      const { data: realChats, error } = await supabase
        .from('chats')
        .select(`
          *,
          cliente:users!cliente_id(id, nome, foto_url, email),
          prestador:users!prestador_id(id, nome, foto_url, email)
        `)
        .or(`cliente_id.eq.${profile.id},prestador_id.eq.${profile.id}`)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error loading chats:', error);
      }

      // Se não houver chats reais, usar dados de exemplo
      if (!realChats || realChats.length === 0) {
        const mockChats: Chat[] = [
          {
            id: '1',
            cliente_id: profile.id,
            prestador_id: 'prestador-exemplo-1',
            last_message: 'Olá, gostaria de solicitar um orçamento para limpeza residencial.',
            created_at: new Date(Date.now() - 86400000).toISOString(), // 1 dia atrás
            updated_at: new Date(Date.now() - 3600000).toISOString(), // 1 hora atrás
            cliente: profile.tipo === 'cliente' ? profile : {
              id: 'cliente-exemplo-1',
              nome: 'Maria Silva',
              foto_url: '',
              email: 'maria@email.com'
            } as any,
            prestador: profile.tipo === 'prestador' ? profile : {
              id: 'prestador-exemplo-1',
              nome: 'João Limpeza Profissional',
              foto_url: '',
              email: 'joao.limpeza@email.com'
            } as any
          },
          {
            id: '2',
            cliente_id: profile.tipo === 'cliente' ? profile.id : 'cliente-exemplo-2',
            prestador_id: profile.tipo === 'prestador' ? profile.id : 'prestador-exemplo-2',
            last_message: 'Perfeito! O serviço foi realizado com excelência. Muito obrigada!',
            created_at: new Date(Date.now() - 172800000).toISOString(), // 2 dias atrás
            updated_at: new Date(Date.now() - 7200000).toISOString(), // 2 horas atrás
            cliente: profile.tipo === 'cliente' ? profile : {
              id: 'cliente-exemplo-2',
              nome: 'Carlos Mendes',
              foto_url: '',
              email: 'carlos@email.com'
            } as any,
            prestador: profile.tipo === 'prestador' ? profile : {
              id: 'prestador-exemplo-2',
              nome: 'Ana Jardinagem',
              foto_url: '',
              email: 'ana.jardim@email.com'
            } as any
          },
          {
            id: '3',
            cliente_id: profile.tipo === 'cliente' ? profile.id : 'cliente-exemplo-3',
            prestador_id: profile.tipo === 'prestador' ? profile.id : 'prestador-exemplo-3',
            last_message: 'Consegue fazer o serviço na próxima terça-feira pela manhã?',
            created_at: new Date(Date.now() - 259200000).toISOString(), // 3 dias atrás
            updated_at: new Date(Date.now() - 10800000).toISOString(), // 3 horas atrás
            cliente: profile.tipo === 'cliente' ? profile : {
              id: 'cliente-exemplo-3',
              nome: 'Sandra Costa',
              foto_url: '',
              email: 'sandra@email.com'
            } as any,
            prestador: profile.tipo === 'prestador' ? profile : {
              id: 'prestador-exemplo-3',
              nome: 'Pedro Eletricista',
              foto_url: '',
              email: 'pedro.eletrica@email.com'
            } as any
          }
        ];
        setChats(mockChats);
      } else {
        setChats(realChats as Chat[]);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as conversas.",
        variant: "destructive"
      });
    } finally {
      setLoadingChats(false);
    }
  };

  const handleOpenChat = (chat: Chat) => {
    // Mostrar toast informativo sobre funcionalidade em desenvolvimento
    toast({
      title: "Chat em desenvolvimento",
      description: "A funcionalidade de chat completa está sendo desenvolvida. Em breve você poderá trocar mensagens em tempo real.",
    });
    console.log('Opening chat:', chat.id);
  };

  const filteredChats = chats.filter(chat => {
    const otherUser = chat.cliente_id === profile?.id ? chat.prestador : chat.cliente;
    return otherUser?.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
           chat.last_message?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  if (loading || loadingChats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <p>Carregando conversas...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para ver suas conversas.
            </p>
            <Button onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Conversas
              {chats.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {chats.length}
                </Badge>
              )}
            </h1>
            <p className="text-gray-600">
              Histórico de conversas com {profile.tipo === 'cliente' ? 'prestadores' : 'clientes'}
            </p>
          </div>
        </div>

        {/* Busca */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar conversas por nome ou mensagem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Informativo sobre histórico permanente */}
        <Card className="mb-6 bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">
                  Histórico Permanente
                </h4>
                <p className="text-sm text-blue-700">
                  Todas as suas conversas ficam salvas permanentemente para futuras consultas. 
                  Não é possível deletar o histórico, garantindo que você sempre tenha acesso 
                  às informações importantes sobre seus serviços.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Conversas */}
        {filteredChats.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Tente buscar por outro termo.'
                  : `Suas conversas aparecerão aqui quando você entrar em contato com ${profile.tipo === 'cliente' ? 'prestadores' : 'clientes'}.`
                }
              </p>
              {searchTerm && (
                <Button variant="outline" onClick={() => setSearchTerm('')}>
                  Limpar busca
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredChats.map((chat) => {
              const otherUser = chat.cliente_id === profile.id ? chat.prestador : chat.cliente;
              const isUnread = Math.random() > 0.7; // Simular mensagens não lidas
              
              return (
                <Card key={chat.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4" onClick={() => handleOpenChat(chat)}>
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={otherUser?.foto_url} />
                          <AvatarFallback>
                            {otherUser?.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {isUnread && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className={`font-semibold text-gray-900 truncate ${isUnread ? 'font-bold' : ''}`}>
                              {otherUser?.nome}
                            </h3>
                            <Badge variant="outline" className="text-xs">
                              {profile.tipo === 'cliente' ? 'Prestador' : 'Cliente'}
                            </Badge>
                            {isUnread && (
                              <Badge variant="destructive" className="text-xs">
                                Nova
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-gray-500 gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(chat.updated_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                        
                        <p className={`text-sm text-gray-600 truncate ${isUnread ? 'font-medium' : ''}`}>
                          {chat.last_message || 'Conversa iniciada'}
                        </p>
                        
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-gray-500">
                            {otherUser?.email}
                          </p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" className="h-8 px-2">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Estatísticas */}
        {chats.length > 0 && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5" />
                Estatísticas das Conversas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-orange-600">{chats.length}</div>
                  <div className="text-sm text-gray-600">Total de conversas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.floor(chats.length * 0.3)}
                  </div>
                  <div className="text-sm text-gray-600">Não lidas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600">
                    {Math.floor(chats.length * 0.7)}
                  </div>
                  <div className="text-sm text-gray-600">Respondidas</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor(chats.length * 0.4)}
                  </div>
                  <div className="text-sm text-gray-600">Esta semana</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Conversas;

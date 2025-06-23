
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft, MessageCircle, Clock, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Chat } from '@/utils/database/types';
import { useToast } from '@/hooks/use-toast';

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
      const { data, error } = await supabase
        .from('chats')
        .select(`
          *,
          cliente:users!chats_cliente_id_fkey (nome, foto_url, email),
          prestador:users!chats_prestador_id_fkey (nome, foto_url, email)
        `)
        .or(`cliente_id.eq.${profile.id},prestador_id.eq.${profile.id}`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setChats((data || []) as Chat[]);
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
    navigate(`/chat/${chat.id}`);
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
            <span className="text-white font-bold text-2xl">Z</span>
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
            <Button onClick={() => navigate('/auth')}>
              Fazer Login
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
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <MessageCircle className="h-6 w-6" />
              Conversas
            </h1>
            <p className="text-gray-600">
              Histórico de conversas com clientes e prestadores
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

        {/* Lista de Conversas */}
        {filteredChats.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold mb-2">
                {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
              </h3>
              <p className="text-gray-600">
                {searchTerm 
                  ? 'Tente buscar por outro termo.'
                  : 'Suas conversas aparecerão aqui quando você entrar em contato com prestadores ou clientes.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {filteredChats.map((chat) => {
              const otherUser = chat.cliente_id === profile.id ? chat.prestador : chat.cliente;
              
              return (
                <Card key={chat.id} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-4" onClick={() => handleOpenChat(chat)}>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={otherUser?.foto_url} />
                        <AvatarFallback>
                          {otherUser?.nome.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {otherUser?.nome}
                          </h3>
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
                        
                        <p className="text-sm text-gray-600 truncate">
                          {chat.last_message || 'Conversa iniciada'}
                        </p>
                        
                        <p className="text-xs text-gray-500 mt-1">
                          {otherUser?.email}
                        </p>
                      </div>
                      
                      <div className="flex-shrink-0">
                        <Button variant="ghost" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversas;

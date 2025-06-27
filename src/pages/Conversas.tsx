
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, MessageCircle, Users, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ChatItem {
  id: string;
  otherUser: {
    id: string;
    nome: string;
    foto_url?: string;
    tipo: 'cliente' | 'prestador';
  };
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
}

const Conversas = () => {
  const navigate = useNavigate();
  const { profile, loading } = useAuth();
  const isMobile = useMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const [chats, setChats] = useState<ChatItem[]>([]);

  // Mock data - em uma aplicação real, isso viria do banco de dados
  useEffect(() => {
    const mockChats: ChatItem[] = [
      {
        id: '1',
        otherUser: {
          id: 'prestador1',
          nome: 'João Silva',
          foto_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
          tipo: 'prestador'
        },
        lastMessage: 'Olá! Posso ajudar com o reparo elétrico hoje às 14h.',
        lastMessageTime: '2024-01-20T10:30:00',
        unreadCount: 2,
        isOnline: true
      },
      {
        id: '2',
        otherUser: {
          id: 'prestador2',
          nome: 'Maria Santos',
          foto_url: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
          tipo: 'prestador'
        },
        lastMessage: 'Serviço de limpeza finalizado com sucesso!',
        lastMessageTime: '2024-01-19T16:45:00',
        unreadCount: 0,
        isOnline: false
      },
      {
        id: '3',
        otherUser: {
          id: 'suporte',
          nome: 'Suporte Zurbo',
          foto_url: undefined,
          tipo: 'prestador'
        },
        lastMessage: 'Obrigado pelo seu feedback! Estamos sempre melhorando.',
        lastMessageTime: '2024-01-18T09:15:00',
        unreadCount: 0,
        isOnline: true
      }
    ];
    setChats(mockChats);
  }, []);

  const filteredChats = chats.filter(chat =>
    chat.otherUser.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleChatClick = (chatId: string) => {
    // Navegar para a conversa específica
    navigate(`/chat/${chatId}`);
  };

  if (loading) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando conversas...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Você precisa estar logado para ver suas conversas.
              </p>
              <Button onClick={() => navigate('/auth')} className="w-full">
                Fazer Login
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <UnifiedHeader />
      <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/')}
              className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {!isMobile && 'Voltar'}
            </Button>
            <div className="flex-1">
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Suas Conversas
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Histórico de mensagens com prestadores e suporte
              </p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar conversas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Chat List */}
          {filteredChats.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold mb-2">
                  {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? 'Tente buscar por um nome diferente.'
                    : 'Suas conversas com prestadores aparecerão aqui.'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={() => navigate('/')}>
                    Encontrar Prestadores
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {filteredChats.map(chat => (
                <Card 
                  key={chat.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleChatClick(chat.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={chat.otherUser.foto_url} alt={chat.otherUser.nome} />
                          <AvatarFallback>
                            {chat.otherUser.nome.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        {chat.isOnline && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full" />
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-900 truncate">
                            {chat.otherUser.nome}
                          </h4>
                          <div className="flex items-center gap-2">
                            {chat.unreadCount > 0 && (
                              <Badge className="bg-orange-500 text-white">
                                {chat.unreadCount}
                              </Badge>
                            )}
                            <span className="text-xs text-gray-500">
                              <Clock className="h-3 w-3 inline mr-1" />
                              {format(new Date(chat.lastMessageTime), 'HH:mm', { locale: ptBR })}
                            </span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {chat.lastMessage}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Conversas;

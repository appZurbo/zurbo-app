import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useMobile } from '@/hooks/useMobile';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { useEnhancedChat } from '@/hooks/useEnhancedChat';
import { ConversationList } from '@/components/chat/ConversationList';
import { ChatInterface } from '@/components/chat/ChatInterface';
import { PageWithDock } from '@/components/layout/PageWithDock';

const Conversas = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const isMobile = useMobile();
  const [searchTerm, setSearchTerm] = useState('');
  
  const {
    conversations,
    currentConversation,
    setCurrentConversation,
    messages,
    loading,
    imageUploadInfo,
    sendMessage,
    uploadImage,
    setPrice,
    respondToPrice,
    reportUser,
    loadMessages
  } = useEnhancedChat();

  const filteredConversations = conversations.filter(conv => {
    const isClient = conv.cliente_id === profile?.id;
    const otherUser = isClient ? conv.prestador : conv.cliente;
    return otherUser?.nome?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           conv.servico_solicitado.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleConversationSelect = (conversation: any) => {
    setCurrentConversation(conversation);
    loadMessages(conversation.id);
  };

  const handleBackToList = () => {
    setCurrentConversation(null);
  };

  if (authLoading) {
    return (
      <PageWithDock>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando conversas...</p>
          </div>
        </div>
      </PageWithDock>
    );
  }

  if (!profile) {
    return (
      <PageWithDock>
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
      </PageWithDock>
    );
  }

  return (
    <PageWithDock>
      <UnifiedHeader />
      <div className="min-h-screen bg-gray-50">
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-6'}`}>
          
          {/* Mobile: Show chat interface when conversation is selected */}
          {isMobile && currentConversation ? (
            <div className="h-[calc(100vh-140px)]">
              <div className="flex items-center gap-3 mb-4">
                <Button variant="ghost" onClick={handleBackToList} className="h-10 w-10 p-0">
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold text-gray-900">Conversa</h1>
              </div>
              
              <Card className="h-full">
                <ChatInterface
                  conversation={currentConversation}
                  messages={messages}
                  imageUploadInfo={imageUploadInfo}
                  onSendMessage={(content) => sendMessage(currentConversation.id, content)}
                  onUploadImage={(file) => uploadImage(currentConversation.id, file)}
                  onSetPrice={(price) => setPrice(currentConversation.id, price)}
                  onRespondToPrice={(accept) => respondToPrice(currentConversation.id, accept)}
                  onReportUser={(issueType, description) => {
                    const reportedUserId = currentConversation.cliente_id === profile.id 
                      ? currentConversation.prestador_id 
                      : currentConversation.cliente_id;
                    reportUser(currentConversation.id, reportedUserId, issueType, description);
                  }}
                />
              </Card>
            </div>
          ) : (
            <>
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
                    Histórico de mensagens e negociações
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Conversation List */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Conversas</CardTitle>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar conversas..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="text-center py-8">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                          <p className="text-sm text-gray-600 mt-2">Carregando...</p>
                        </div>
                      ) : filteredConversations.length === 0 ? (
                        <div className="text-center py-8">
                          <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-lg font-semibold mb-2">
                            {searchTerm ? 'Nenhuma conversa encontrada' : 'Nenhuma conversa ainda'}
                          </h3>
                          <p className="text-gray-600 text-sm">
                            {searchTerm 
                              ? 'Tente buscar por um nome diferente.'
                              : 'Suas conversas com prestadores aparecerão aqui.'
                            }
                          </p>
                        </div>
                      ) : (
                        <ConversationList
                          conversations={filteredConversations}
                          currentUserId={profile.id}
                          onConversationSelect={handleConversationSelect}
                        />
                      )}
                    </CardContent>
                  </Card>
                </div>

                {/* Chat Interface - Desktop */}
                <div className="lg:col-span-2 hidden lg:block">
                  <Card className="h-[600px]">
                    {currentConversation ? (
                      <ChatInterface
                        conversation={currentConversation}
                        messages={messages}
                        imageUploadInfo={imageUploadInfo}
                        onSendMessage={(content) => sendMessage(currentConversation.id, content)}
                        onUploadImage={(file) => uploadImage(currentConversation.id, file)}
                        onSetPrice={(price) => setPrice(currentConversation.id, price)}
                        onRespondToPrice={(accept) => respondToPrice(currentConversation.id, accept)}
                        onReportUser={(issueType, description) => {
                          const reportedUserId = currentConversation.cliente_id === profile.id 
                            ? currentConversation.prestador_id 
                            : currentConversation.cliente_id;
                          reportUser(currentConversation.id, reportedUserId, issueType, description);
                        }}
                      />
                    ) : (
                      <CardContent className="h-full flex items-center justify-center">
                        <div className="text-center">
                          <MessageCircle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                          <h3 className="text-xl font-semibold mb-2">Selecione uma conversa</h3>
                          <p className="text-gray-600">
                            Escolha uma conversa da lista para começar a chatear.
                          </p>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </PageWithDock>
  );
};

export default Conversas;

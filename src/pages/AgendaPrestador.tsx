
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UnifiedHeader } from '@/components/layout/UnifiedHeader';
import { NovoCompromissoModal } from '@/components/agenda/NovoCompromissoModal';
import { useMobile } from '@/hooks/useMobile';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Calendar, Clock, MapPin, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Agendamento {
  id: string;
  titulo: string;
  descricao?: string;
  data_agendada: string;
  hora_agendada: string;
  endereco?: string;
  status: string;
  cliente_nome?: string;
}

const AgendaPrestador = () => {
  const navigate = useNavigate();
  const { profile, loading: authLoading } = useAuth();
  const isMobile = useMobile();
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadAgendamentos();
    }
  }, [profile]);

  const loadAgendamentos = async () => {
    if (!profile) return;
    
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*')
        .eq('prestador_id', profile.id)
        .order('data_agendada', { ascending: true });

      if (error) throw error;
      setAgendamentos(data || []);
    } catch (error) {
      console.error('Error loading agendamentos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-800';
      case 'pendente':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelado':
        return 'bg-red-100 text-red-800';
      case 'concluido':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'Confirmado';
      case 'pendente':
        return 'Pendente';
      case 'cancelado':
        return 'Cancelado';
      case 'concluido':
        return 'Concluído';
      default:
        return status;
    }
  };

  if (authLoading) {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
              <span className="text-white font-bold text-2xl">Z</span>
            </div>
            <p className="text-gray-600">Carregando agenda...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profile || profile.tipo !== 'prestador') {
    return (
      <div>
        <UnifiedHeader />
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardContent className="p-6 text-center">
              <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
              <p className="text-gray-600 mb-4">
                Apenas prestadores podem acessar a agenda.
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
        <div className={`${isMobile ? 'px-4 py-4' : 'max-w-6xl mx-auto p-6'}`}>
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                onClick={() => navigate('/prestador-dashboard')}
                className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {!isMobile && 'Voltar'}
              </Button>
              
              <div className="flex-1">
                <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                  Minha Agenda
                </h1>
                <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                  Gerencie seus compromissos e agendamentos
                </p>
              </div>
            </div>

            {/* Novo Compromisso Button */}
            <NovoCompromissoModal />
          </div>

          {/* Agenda Content */}
          <div className="grid gap-6">
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">Carregando agenda...</p>
                  </div>
                </CardContent>
              </Card>
            ) : agendamentos.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                  <h3 className="text-xl font-semibold mb-2">Agenda vazia</h3>
                  <p className="text-gray-600 mb-4">
                    Você ainda não possui compromissos agendados.
                  </p>
                  <NovoCompromissoModal />
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {agendamentos.map((agendamento) => (
                  <Card key={agendamento.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 className="font-semibold text-lg">{agendamento.titulo}</h3>
                            <Badge className={getStatusColor(agendamento.status)}>
                              {getStatusText(agendamento.status)}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                {format(new Date(agendamento.data_agendada), 'dd \'de\' MMMM \'de\' yyyy', { locale: ptBR })}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <span>{agendamento.hora_agendada}</span>
                            </div>
                            
                            {agendamento.endereco && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span>{agendamento.endereco}</span>
                              </div>
                            )}
                            
                            {agendamento.cliente_nome && (
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                <span>{agendamento.cliente_nome}</span>
                              </div>
                            )}
                          </div>
                          
                          {agendamento.descricao && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{agendamento.descricao}</p>
                            </div>
                          )}
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
    </div>
  );
};

export default AgendaPrestador;

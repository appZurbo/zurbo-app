
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, DollarSign, User, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  requestName: string;
  providerName: string;
  requestDate: string;
  scheduledDate: string;
  location: string;
  agreedPrice: number;
  status: 'pending' | 'confirmed_by_provider' | 'confirmed_by_both' | 'completed' | 'cancelled';
  isEmergency: boolean;
  providerId: string;
  clientId: string;
}

export const AppointmentSystem = () => {
  const { profile } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Mock data for testing
  useEffect(() => {
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        requestName: 'Corte de Cabelo Feminino',
        providerName: 'Luciana Pereira',
        requestDate: '2024-01-20',
        scheduledDate: '2024-01-25T15:00:00',
        location: 'Rua das Palmeiras, 105 - Sinop, MT',
        agreedPrice: 60,
        status: 'pending',
        isEmergency: false,
        providerId: 'prest001',
        clientId: profile?.id || 'usr001'
      },
      {
        id: '2',
        requestName: 'Reparo Elétrico Emergencial',
        providerName: 'João Silva',
        requestDate: '2024-01-22',
        scheduledDate: '2024-01-24T09:30:00',
        location: 'Avenida das Acácias, 900 - Sinop, MT',
        agreedPrice: 90,
        status: 'confirmed_by_provider',
        isEmergency: true,
        providerId: 'prest002',
        clientId: profile?.id || 'usr002'
      }
    ];
    setAppointments(mockAppointments);
  }, [profile?.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800';
      case 'confirmed_by_provider':
        return 'bg-yellow-100 text-yellow-800';
      case 'confirmed_by_both':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Aguardando Confirmação';
      case 'confirmed_by_provider':
        return 'Prestador Confirmou';
      case 'confirmed_by_both':
        return 'Confirmado por Ambos';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return 'Desconhecido';
    }
  };

  const getActionButton = (appointment: Appointment) => {
    const now = new Date();
    const scheduledTime = new Date(appointment.scheduledDate);
    const thirtyMinutesBefore = new Date(scheduledTime.getTime() - 30 * 60 * 1000);

    if (appointment.status === 'pending') {
      return (
        <Button variant="outline" disabled>
          Confirmar Prestador
        </Button>
      );
    }

    if (appointment.status === 'confirmed_by_provider') {
      if (now >= thirtyMinutesBefore) {
        return (
          <Button 
            className="bg-green-500 hover:bg-green-600"
            onClick={() => handleConfirmArrival(appointment.id)}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Confirmar Chegada
          </Button>
        );
      } else {
        return (
          <Button variant="outline" disabled>
            Aguardando Horário
          </Button>
        );
      }
    }

    if (appointment.status === 'confirmed_by_both') {
      return (
        <Button 
          onClick={() => handleComplete(appointment.id)}
          className="bg-blue-500 hover:bg-blue-600"
        >
          <CheckCircle className="h-4 w-4 mr-2" />
          Completar
        </Button>
      );
    }

    return null;
  };

  const handleConfirmArrival = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed_by_both' as const }
          : apt
      )
    );
    toast({
      title: "Chegada confirmada!",
      description: "Agora você pode completar o serviço quando terminado.",
    });
  };

  const handleComplete = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'completed' as const }
          : apt
      )
    );
    toast({
      title: "Serviço concluído!",
      description: "O atendimento foi marcado como completado.",
    });
  };

  const handleCancel = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'cancelled' as const }
          : apt
      )
    );
    toast({
      title: "Solicitação cancelada",
      description: "O agendamento foi cancelado com sucesso.",
    });
  };

  const handleAcceptProposal = (appointmentId: string) => {
    setAppointments(prev => 
      prev.map(apt => 
        apt.id === appointmentId 
          ? { ...apt, status: 'confirmed_by_provider' as const }
          : apt
      )
    );
    toast({
      title: "Proposta aceita!",
      description: "O prestador foi notificado da sua aceitação.",
    });
  };

  const activeAppointments = appointments.filter(apt => apt.status !== 'completed' && apt.status !== 'cancelled');
  const completedAppointments = appointments.filter(apt => apt.status === 'completed' || apt.status === 'cancelled');

  return (
    <div className="space-y-6">
      {/* Active Appointments */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Agendamentos Ativos</h3>
        {activeAppointments.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-500">Nenhum agendamento ativo</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {activeAppointments.map(appointment => (
              <Card key={appointment.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{appointment.requestName}</CardTitle>
                    {appointment.isEmergency && (
                      <Badge className="bg-red-100 text-red-800">Emergencial</Badge>
                    )}
                  </div>
                  <Badge className={getStatusColor(appointment.status)}>
                    {getStatusText(appointment.status)}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <User className="h-4 w-4 text-gray-500" />
                    <span>{appointment.providerName}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Solicitado em: {format(new Date(appointment.requestDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>Agendado para: {format(new Date(appointment.scheduledDate), 'dd/MM/yyyy \'às\' HH:mm', { locale: ptBR })}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>{appointment.location}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                    <span>R$ {appointment.agreedPrice.toFixed(2)}</span>
                  </div>

                  <div className="flex gap-2 pt-3 border-t">
                    {getActionButton(appointment)}
                    
                    {appointment.isEmergency && appointment.status === 'pending' && (
                      <Button 
                        onClick={() => handleAcceptProposal(appointment.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        Aceitar Proposta
                      </Button>
                    )}
                    
                    {appointment.status !== 'completed' && appointment.status !== 'cancelled' && (
                      <Button 
                        variant="outline"
                        onClick={() => handleCancel(appointment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Completed Appointments */}
      {completedAppointments.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Histórico</h3>
          <div className="space-y-4">
            {completedAppointments.map(appointment => (
              <Card key={appointment.id} className="opacity-75">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{appointment.requestName}</CardTitle>
                    <Badge className={getStatusColor(appointment.status)}>
                      {getStatusText(appointment.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{appointment.providerName}</span>
                    <span>•</span>
                    <span>{format(new Date(appointment.scheduledDate), 'dd/MM/yyyy', { locale: ptBR })}</span>
                    <span>•</span>
                    <span>R$ {appointment.agreedPrice.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

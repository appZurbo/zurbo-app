
import { useState } from 'react';
import { X, Calendar, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  prestador: {
    id: string;
    name: string;
    category: string;
    price: string;
  };
  onSchedule: (data: any) => void;
}

const ScheduleModal = ({ isOpen, onClose, prestador, onSchedule }: ScheduleModalProps) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    
    const scheduleData = {
      prestadorId: prestador.id,
      date: selectedDate,
      time: selectedTime,
      description,
      status: 'aguardando'
    };

    onSchedule(scheduleData);
    onClose();
  };

  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-2 top-2"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Agendar Serviço</span>
          </CardTitle>
          <div className="text-sm text-gray-600">
            <p><strong>{prestador.name}</strong> - {prestador.category}</p>
            <p>{prestador.price}</p>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSchedule} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Selecione a Data
                </Label>
                <CalendarComponent
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date.getDay() === 0}
                  className="rounded-md border"
                />
              </div>
              
              <div>
                <Label className="text-base font-semibold mb-3 block">
                  Horário Disponível
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "gradient-bg" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <Label htmlFor="description" className="text-base font-semibold">
                Descreva o serviço necessário
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detalhe o que precisa ser feito, tamanho do ambiente, materiais necessários, etc."
                className="mt-2"
                rows={4}
                required
              />
            </div>
            
            {selectedDate && selectedTime && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">Resumo do Agendamento</h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Data:</strong> {selectedDate.toLocaleDateString('pt-BR')}</p>
                  <p><strong>Horário:</strong> {selectedTime}</p>
                  <p><strong>Prestador:</strong> {prestador.name}</p>
                  <p><strong>Valor:</strong> {prestador.price}</p>
                </div>
              </div>
            )}
            
            <div className="flex space-x-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="flex-1 gradient-bg"
                disabled={!selectedDate || !selectedTime || !description.trim()}
              >
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScheduleModal;

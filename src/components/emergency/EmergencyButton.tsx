
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertTriangle, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { StarBorder } from '@/components/ui/star-border';

export const EmergencyButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    servico: '',
    localizacao: '',
    horario_preferido: '',
    descricao: '',
    orcamento_maximo: ''
  });

  const servicos = [
    'Eletricista',
    'Encanador',
    'Chaveiro',
    'Mecânico',
    'Limpeza',
    'Pintura',
    'Jardinagem',
    'Informática',
    'Outros'
  ];

  const handleSubmit = () => {
    if (!formData.servico || !formData.localizacao) {
      toast.error('Por favor, preencha o serviço e localização.');
      return;
    }

    // Simular envio para prestadores em serviço
    toast.success('Sua solicitação foi enviada para prestadores disponíveis na sua região.');

    setIsOpen(false);
    setFormData({
      servico: '',
      localizacao: '',
      horario_preferido: '',
      descricao: '',
      orcamento_maximo: ''
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <StarBorder 
          className="w-full cursor-pointer"
          color="#ef4444"
          speed="2s"
        >
          <div className="flex items-center justify-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            SOS Emergência
          </div>
        </StarBorder>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            Solicitação de Emergência
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="servico">Tipo de Serviço *</Label>
            <Select value={formData.servico} onValueChange={(value) => 
              setFormData(prev => ({ ...prev, servico: value }))
            }>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o serviço" />
              </SelectTrigger>
              <SelectContent>
                {servicos.map(servico => (
                  <SelectItem key={servico} value={servico}>
                    {servico}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="localizacao">Localização *</Label>
            <div className="flex gap-2">
              <Input
                id="localizacao"
                placeholder="Endereço completo"
                value={formData.localizacao}
                onChange={(e) => setFormData(prev => ({ ...prev, localizacao: e.target.value }))}
              />
              <Button variant="outline" size="sm">
                <MapPin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div>
            <Label htmlFor="horario">Horário Preferido</Label>
            <Input
              id="horario"
              type="time"
              value={formData.horario_preferido}
              onChange={(e) => setFormData(prev => ({ ...prev, horario_preferido: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="orcamento">Orçamento Máximo (R$)</Label>
            <Input
              id="orcamento"
              type="number"
              placeholder="0,00"
              value={formData.orcamento_maximo}
              onChange={(e) => setFormData(prev => ({ ...prev, orcamento_maximo: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="descricao">Descrição do Problema</Label>
            <Textarea
              id="descricao"
              placeholder="Descreva detalhadamente o problema..."
              value={formData.descricao}
              onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => setIsOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              className="flex-1 bg-red-500 hover:bg-red-600"
              onClick={handleSubmit}
            >
              Enviar SOS
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

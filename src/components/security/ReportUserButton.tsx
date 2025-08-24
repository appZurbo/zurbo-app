
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Flag } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { securityLogger } from '@/utils/securityLogger';
import { ReportUserButtonProps } from '@/types';

const ReportUserButton = ({ reportedUserId, reportedUserName, variant = 'button' }: ReportUserButtonProps) => {
  const [open, setOpen] = useState(false);
  const [reportType, setReportType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const { profile, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async () => {
    if (!reportType || !description.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione o tipo de denúncia e descreva o problema",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('user_reports')
        .insert({
          reporter_id: profile?.id,
          reported_user_id: reportedUserId,
          type: reportType,
          description: description.trim(),
        });

      if (error) throw error;

      // Log security event
      await securityLogger.logEvent({
        event_type: 'suspicious_activity',
        user_id: profile?.id,
        details: { 
          action: 'user_report_created',
          reported_user: reportedUserId,
          report_type: reportType 
        },
        severity: 'medium'
      });

      toast({
        title: "Denúncia enviada",
        description: "Obrigado por ajudar a manter nossa comunidade segura",
      });

      setOpen(false);
      setReportType('');
      setDescription('');
    } catch (error: any) {
      toast({
        title: "Erro ao enviar denúncia",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const trigger = variant === 'icon' ? (
    <Button variant="ghost" size="sm">
      <Flag className="h-4 w-4" />
    </Button>
  ) : (
    <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
      <AlertTriangle className="h-4 w-4 mr-2" />
      Reportar
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar {reportedUserName}</DialogTitle>
          <DialogDescription>
            Sua denúncia nos ajuda a manter a comunidade segura. 
            Todas as denúncias são analisadas pela nossa equipe.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="report-type">Tipo de problema</Label>
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo de problema" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="inappropriate_behavior">Comportamento inadequado</SelectItem>
                <SelectItem value="spam">Spam ou conteúdo irrelevante</SelectItem>
                <SelectItem value="fraud">Fraude ou golpe</SelectItem>
                <SelectItem value="fake_profile">Perfil falso</SelectItem>
                <SelectItem value="harassment">Assédio</SelectItem>
                <SelectItem value="other">Outro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="description">Descreva o problema</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva detalhadamente o que aconteceu..."
              rows={4}
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Denúncia'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReportUserButton;

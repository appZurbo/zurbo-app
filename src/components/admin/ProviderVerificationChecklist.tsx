
import React from 'react';
import { CheckCircle, XCircle, FileText, User, Image as ImageIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ChecklistProps {
  hasDocument: boolean;
  hasSelfie: boolean;
  hasProfileData: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}

export const ProviderVerificationChecklist: React.FC<ChecklistProps> = ({
  hasDocument,
  hasSelfie,
  hasProfileData,
  status = 'pending'
}) => {
  const Item = ({ ok, label, Icon }: { ok: boolean; label: string; Icon: any }) => (
    <div className="flex items-center gap-2 text-sm">
      {ok ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-500" />}
      <Icon className="h-4 w-4 text-muted-foreground" />
      <span>{label}</span>
    </div>
  );

  const statusLabel =
    status === 'approved' ? 'Aprovado' : status === 'rejected' ? 'Recusado' : 'Pendente';
  const statusVariant =
    status === 'approved' ? 'default' : status === 'rejected' ? 'secondary' : 'outline';

  return (
    <div className="space-y-2">
      <div className="flex gap-2 items-center">
        <span className="text-sm text-muted-foreground">Status:</span>
        <Badge variant={statusVariant as any}>{statusLabel}</Badge>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        <Item ok={hasDocument} label="Documento" Icon={FileText} />
        <Item ok={hasSelfie} label="Selfie" Icon={ImageIcon} />
        <Item ok={hasProfileData} label="Dados fornecidos" Icon={User} />
      </div>
    </div>
  );
};

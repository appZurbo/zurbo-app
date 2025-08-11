
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

export type VerificationFiles = {
  documentFile?: File | null;
  selfieFile?: File | null;
};

interface ProviderVerificationUploadProps {
  value: VerificationFiles;
  onChange: (files: VerificationFiles) => void;
}

const ProviderVerificationUpload: React.FC<ProviderVerificationUploadProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-3 rounded-lg border p-4">
      <p className="font-medium">Verificação do Prestador</p>
      <p className="text-xs text-muted-foreground">
        Envie um documento oficial (RG/CPF/CNH) e uma selfie nítida. Seus arquivos são privados e usados apenas para validação.
      </p>

      <div className="space-y-2">
        <Label htmlFor="doc">Documento (frente)</Label>
        <Input
          id="doc"
          type="file"
          accept="image/*,application/pdf"
          onChange={(e) => onChange({ ...value, documentFile: e.target.files?.[0] || null })}
        />
        {value.documentFile && (
          <p className="text-xs text-muted-foreground truncate">Selecionado: {value.documentFile.name}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="selfie">Selfie</Label>
        <Input
          id="selfie"
          type="file"
          accept="image/*"
          onChange={(e) => onChange({ ...value, selfieFile: e.target.files?.[0] || null })}
        />
        {value.selfieFile && (
          <p className="text-xs text-muted-foreground truncate">Selecionado: {value.selfieFile.name}</p>
        )}
      </div>
    </div>
  );
};

export default ProviderVerificationUpload;

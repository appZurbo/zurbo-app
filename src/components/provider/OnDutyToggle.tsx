
import React, { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff } from 'lucide-react';
import { toast } from 'sonner';

export const OnDutyToggle = () => {
  const [isOnDuty, setIsOnDuty] = useState(false);
  

  const handleToggle = (checked: boolean) => {
    setIsOnDuty(checked);
    
    if (checked) {
      toast.success("Agora você receberá notificações de pedidos emergenciais.");
    } else {
      toast("Você não receberá mais notificações emergenciais.");
    }
  };

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {isOnDuty ? (
              <Bell className="h-5 w-5 text-green-500" />
            ) : (
              <BellOff className="h-5 w-5 text-gray-400" />
            )}
            <div>
              <Label htmlFor="on-duty" className="text-base font-medium">
                Em Serviço
              </Label>
              <p className="text-sm text-gray-600">
                Receba notificações de pedidos emergenciais
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge 
              variant={isOnDuty ? "default" : "secondary"}
              className={isOnDuty ? "bg-green-500" : ""}
            >
              {isOnDuty ? "Ativo" : "Inativo"}
            </Badge>
            <Switch
              id="on-duty"
              checked={isOnDuty}
              onCheckedChange={handleToggle}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

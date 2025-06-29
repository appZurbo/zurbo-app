
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface RLSCheck {
  table: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
}

export const RLSValidator = () => {
  const { profile } = useAuth();
  const [checks, setChecks] = useState<RLSCheck[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      runRLSChecks();
    }
  }, [profile]);

  const runRLSChecks = async () => {
    const results: RLSCheck[] = [];

    try {
      // Test users table access
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .neq('id', profile?.id)
        .limit(1);

      if (userError || userData?.length === 0) {
        results.push({
          table: 'users',
          status: 'pass',
          message: 'RLS properly prevents access to other users data'
        });
      } else {
        results.push({
          table: 'users',
          status: 'fail',
          message: 'RLS allows unauthorized access to other users data'
        });
      }

      // Test chat_conversations access
      const { data: chatData, error: chatError } = await supabase
        .from('chat_conversations')
        .select('*')
        .neq('cliente_id', profile?.id)
        .neq('prestador_id', profile?.id)
        .limit(1);

      if (chatError || chatData?.length === 0) {
        results.push({
          table: 'chat_conversations',
          status: 'pass',
          message: 'RLS properly restricts conversation access'
        });
      } else {
        results.push({
          table: 'chat_conversations',
          status: 'fail',
          message: 'RLS allows unauthorized conversation access'
        });
      }

      // Test escrow_payments access
      const { data: escrowData, error: escrowError } = await supabase
        .from('escrow_payments')
        .select('*')
        .limit(1);

      if (escrowError) {
        results.push({
          table: 'escrow_payments',
          status: 'pass',
          message: 'RLS properly restricts escrow payment access'
        });
      } else {
        results.push({
          table: 'escrow_payments',
          status: 'warning',
          message: 'Escrow payments accessible - verify user ownership'
        });
      }

    } catch (error) {
      console.error('RLS check error:', error);
      results.push({
        table: 'general',
        status: 'fail',
        message: 'RLS check failed with error'
      });
    }

    setChecks(results);
    setLoading(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'fail':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-800';
      case 'fail':
        return 'bg-red-100 text-red-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!profile) return null;

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          RLS Security Validation
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Validating security policies...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {checks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(check.status)}
                  <div>
                    <p className="font-medium">{check.table}</p>
                    <p className="text-sm text-gray-600">{check.message}</p>
                  </div>
                </div>
                <Badge className={getStatusColor(check.status)}>
                  {check.status}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

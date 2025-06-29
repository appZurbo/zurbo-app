
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { MessageCircle, Clock, CheckCircle, XCircle } from 'lucide-react';

interface LatencyTest {
  messageId: string;
  sentAt: number;
  receivedAt?: number;
  latency?: number;
}

export const RealtimeTester = () => {
  const { profile } = useAuth();
  const [isConnected, setIsConnected] = useState(false);
  const [latencyTests, setLatencyTests] = useState<LatencyTest[]>([]);
  const [averageLatency, setAverageLatency] = useState<number | null>(null);
  const [testing, setTesting] = useState(false);

  useEffect(() => {
    if (!profile) return;

    const channel = supabase
      .channel('realtime-test')
      .on('broadcast', { event: 'test-message' }, (payload) => {
        const receivedAt = Date.now();
        console.log('Received test message:', payload, 'at', receivedAt);
        
        setLatencyTests(prev => {
          const updated = prev.map(test => {
            if (test.messageId === payload.messageId && !test.receivedAt) {
              const latency = receivedAt - test.sentAt;
              return {
                ...test,
                receivedAt,
                latency
              };
            }
            return test;
          });
          return updated;
        });
      })
      .subscribe((status) => {
        console.log('Realtime status:', status);
        setIsConnected(status === 'SUBSCRIBED');
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [profile]);

  useEffect(() => {
    const completedTests = latencyTests.filter(test => test.latency);
    if (completedTests.length > 0) {
      const avg = completedTests.reduce((sum, test) => sum + (test.latency || 0), 0) / completedTests.length;
      setAverageLatency(Math.round(avg));
    }
  }, [latencyTests]);

  const runLatencyTest = async () => {
    if (!isConnected) return;
    
    setTesting(true);
    const testCount = 5;
    const newTests: LatencyTest[] = [];

    for (let i = 0; i < testCount; i++) {
      const messageId = `test-${Date.now()}-${i}`;
      const sentAt = Date.now();
      
      const testMessage: LatencyTest = {
        messageId,
        sentAt
      };
      
      newTests.push(testMessage);
      
      // Send broadcast message
      await supabase.channel('realtime-test').send({
        type: 'broadcast',
        event: 'test-message',
        payload: { messageId, sentAt, userId: profile?.id }
      });

      // Wait a bit between messages
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    setLatencyTests(newTests);
    
    // Wait for responses (max 5 seconds)
    setTimeout(() => {
      setTesting(false);
    }, 5000);
  };

  const getLatencyColor = (latency?: number) => {
    if (!latency) return 'bg-gray-100 text-gray-800';
    if (latency < 200) return 'bg-green-100 text-green-800';
    if (latency < 500) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getLatencyStatus = (latency?: number) => {
    if (!latency) return 'pending';
    if (latency < 400) return 'good';
    return 'poor';
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Teste de Latência Realtime
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status da Conexão:</span>
            <Badge className={isConnected ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
              {isConnected ? 'Conectado' : 'Desconectado'}
            </Badge>
          </div>

          {/* Average Latency */}
          {averageLatency !== null && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Latência Média:</span>
              <Badge className={getLatencyColor(averageLatency)}>
                {averageLatency}ms
              </Badge>
            </div>
          )}

          {/* Test Button */}
          <Button 
            onClick={runLatencyTest}
            disabled={!isConnected || testing}
            className="w-full"
          >
            {testing ? 'Testando...' : 'Executar Teste de Latência'}
          </Button>

          {/* Test Results */}
          {latencyTests.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Resultados dos Testes:</h4>
              <div className="space-y-2">
                {latencyTests.map((test, index) => (
                  <div key={test.messageId} className="flex items-center justify-between p-2 border rounded">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Teste {index + 1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {test.latency ? (
                        <>
                          <Badge className={getLatencyColor(test.latency)}>
                            {test.latency}ms
                          </Badge>
                          {getLatencyStatus(test.latency) === 'good' ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" />
                          )}
                        </>
                      ) : (
                        <Badge className="bg-gray-100 text-gray-800">
                          Aguardando...
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Benchmark Results */}
          {averageLatency !== null && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">Avaliação de Performance:</h4>
              <div className="text-sm text-gray-600">
                {averageLatency < 200 && "✅ Excelente - Latência muito baixa"}
                {averageLatency >= 200 && averageLatency < 400 && "✅ Boa - Latência dentro do esperado"}
                {averageLatency >= 400 && averageLatency < 1000 && "⚠️ Aceitável - Latência um pouco alta"}
                {averageLatency >= 1000 && "❌ Ruim - Latência muito alta"}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

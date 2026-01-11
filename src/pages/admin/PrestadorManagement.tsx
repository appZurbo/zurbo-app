import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ArrowLeft, 
  Search, 
  Eye, 
  UserX, 
  CheckCircle, 
  XCircle,
  MapPin,
  Star,
  Phone,
  Mail,
  FileText,
  Image as ImageIcon
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ProviderVerificationChecklist } from '@/components/admin/ProviderVerificationChecklist';

interface Prestador {
  id: string;
  nome: string;
  email: string;
  telefone?: string;
  foto_perfil?: string;
  verificado?: boolean;
  ativo?: boolean;
  endereco_cidade?: string;
  endereco_bairro?: string;
  cidade?: string;
  bairro?: string;
  servicos?: string[];
  media_avaliacoes?: number;
  total_avaliacoes?: number;
  created_at?: string;
}

interface VerificationRow {
  id: string;
  user_id: string;
  document_url?: string | null;
  selfie_url?: string | null;
  status: 'pending' | 'approved' | 'rejected';
  updated_at?: string;
}

// Novo alias simples para evitar tipos profundos
type PendingVerification = VerificationRow & { user: Prestador };

const PrestadorManagement = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const { toast } = useToast();
  
  const [prestadores, setPrestadores] = useState<Prestador[]>([]);
  const [pendingVerifs, setPendingVerifs] = useState<PendingVerification[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'verified' | 'active'>('all');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
    loadPrestadores();
    loadPendingVerifications();
  }, [isAdmin, navigate]);

  const loadPrestadores = async () => {
    try {
      setLoading(true);
      // Busca simples para evitar types complexos do Supabase
      const response: any = await (supabase as any)
        .from('users')
        .select('*')
        .eq('tipo', 'prestador')
        .eq('ativo', true)
        .order('created_at', { ascending: false });
      
      const { data, error } = response;

      if (error) throw error;
      
      // Mapeia explicitamente para o tipo Prestador (evita conflito com tipos gerados do Supabase)
      const transformedData: Prestador[] = (data || []).map((user: any) => ({
        id: user.id,
        nome: user.nome,
        email: user.email,
        telefone: user.telefone ?? undefined,
        foto_perfil: user.foto_perfil || user.foto_url || undefined,
        verificado: !!user.verificado,
        ativo: user.ativo !== false,
        endereco_cidade: user.endereco_cidade,
        endereco_bairro: user.endereco_bairro,
        cidade: user.endereco_cidade,
        bairro: user.endereco_bairro,
        servicos: user.servicos ?? undefined,
        media_avaliacoes: user.media_avaliacoes ?? user.nota_media,
        total_avaliacoes: user.total_avaliacoes ?? undefined,
        created_at: user.created_at,
      }));
      
      setPrestadores(transformedData);
    } catch (error) {
      console.error('Error loading prestadores:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os prestadores.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const loadPendingVerifications = async () => {
    try {
      setLoadingPending(true);
      // Buscar verificações pendentes - cast para any para evitar tipos profundos
      const verifsQuery = supabase
        .from('provider_verifications')
        .select('*')
        .eq('status', 'pending')
        .order('updated_at', { ascending: false });
      const { data: verifs, error: verErr } = await (verifsQuery as any);

      if (verErr) throw verErr;

      const userIds = (verifs || []).map((v: any) => v.user_id);
      if (userIds.length === 0) {
        setPendingVerifs([]);
        return;
      }

      const usersQuery = supabase
        .from('users')
        .select('*')
        .in('id', userIds);
      const { data: usersData, error: usersErr } = await (usersQuery as any);

      if (usersErr) throw usersErr;

      const merged: PendingVerification[] = (verifs || [])
        .map((v: any) => {
          const u: any = (usersData || []).find((x: any) => x.id === v.user_id);
          if (!u) return null;
          const prestador: Prestador = {
            id: u.id,
            nome: u.nome,
            email: u.email,
            telefone: u.telefone ?? undefined,
            foto_perfil: u.foto_perfil || u.foto_url || undefined,
            verificado: !!u.verificado,
            ativo: u.ativo !== false,
            endereco_cidade: u.endereco_cidade,
            endereco_bairro: u.endereco_bairro,
            cidade: u.endereco_cidade,
            bairro: u.endereco_bairro,
            servicos: u.servicos ?? undefined,
            media_avaliacoes: u.media_avaliacoes ?? u.nota_media,
            total_avaliacoes: u.total_avaliacoes ?? undefined,
            created_at: u.created_at,
          };
          return { ...(v as VerificationRow), user: prestador };
        })
        .filter((x): x is PendingVerification => !!x);

      setPendingVerifs(merged);
    } catch (error) {
      console.error('Error loading pending verifications:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar solicitações pendentes.",
        variant: "destructive"
      });
    } finally {
      setLoadingPending(false);
    }
  };

  const handleStatusChange = async (prestadorId: string, field: 'verificado' | 'ativo', value: boolean) => {
    try {
      // Faz cast do payload para any, pois 'verificado' pode não constar nos tipos gerados
      const { error } = await supabase
        .from('users')
        .update({ [field]: value } as any)
        .eq('id', prestadorId);

      if (error) throw error;

      setPrestadores(prev => 
        prev.map(p => 
          p.id === prestadorId 
            ? { ...p, [field]: value }
            : p
        )
      );

      toast({
        title: "Sucesso",
        description: `Status do prestador ${value ? 'ativado' : 'desativado'} com sucesso.`
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status.",
        variant: "destructive"
      });
    }
  };

  const createSignedUrl = async (path?: string | null) => {
    if (!path) return null;
    const { data, error } = await supabase
      .storage
      .from('provider-verifications')
      .createSignedUrl(path, 60 * 10); // 10 minutos

    if (error) {
      console.error('Error creating signed URL', error);
      toast({
        title: "Erro",
        description: "Não foi possível gerar link do arquivo.",
        variant: "destructive"
      });
      return null;
    }
    return data.signedUrl;
  };

  const approveProvider = async (userId: string, verifId: string) => {
    try {
      // Aprovar verificação
      const { error: verErr } = await supabase
        .from('provider_verifications')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', verifId);

      if (verErr) throw verErr;

      // Marcar usuário como verificado e ativo - cast para any
      const { error: usrErr } = await supabase
        .from('users')
        .update({ verificado: true, ativo: true } as any)
        .eq('id', userId);

      if (usrErr) throw usrErr;

      // Chamar Edge Function para backup
      const { data: backupRes, error: backupErr } = await supabase.functions.invoke('create-provider-backup', {
        body: { userId }
      });

      if (backupErr) {
        console.warn('Backup function error:', backupErr);
      } else {
        console.log('Backup result:', backupRes);
      }

      toast({
        title: "Prestador aprovado",
        description: "O prestador foi aprovado e seus dados foram salvos em backup."
      });

      // Atualiza listas
      await loadPrestadores();
      await loadPendingVerifications();
    } catch (e) {
      console.error('Error approving provider:', e);
      toast({
        title: "Erro",
        description: "Não foi possível aprovar o prestador.",
        variant: "destructive"
      });
    }
  };

  const rejectProvider = async (verifId: string) => {
    try {
      const { error } = await supabase
        .from('provider_verifications')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString()
        })
        .eq('id', verifId);

      if (error) throw error;

      toast({
        title: "Solicitação recusada",
        description: "O prestador foi marcado como recusado."
      });

      await loadPendingVerifications();
    } catch (e) {
      console.error('Error rejecting provider:', e);
      toast({
        title: "Erro",
        description: "Não foi possível recusar o prestador.",
        variant: "destructive"
      });
    }
  };

  const filteredPrestadores = prestadores.filter(prestador => {
    const matchesSearch = 
      prestador.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestador.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestador.cidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prestador.bairro?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filterStatus === 'all' ||
      (filterStatus === 'verified' && prestador.verificado) ||
      (filterStatus === 'active' && prestador.ativo);

    return matchesSearch && matchesFilter;
  });

  if (!isAdmin) {
    return null;
  }

  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar
            </Button>
            <div className="flex-1">
              <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
                Gerenciar Prestadores
              </h1>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
                Visualize, aprove e gerencie os prestadores de serviço
              </p>
            </div>
          </div>

          {/* Pendentes de aprovação */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Solicitações aguardando aprovação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {loadingPending ? (
                <p>Carregando solicitações...</p>
              ) : pendingVerifs.length === 0 ? (
                <p className="text-gray-500">Nenhuma solicitação pendente.</p>
              ) : (
                pendingVerifs.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg bg-white">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={(item.user as any)?.foto_perfil} />
                          <AvatarFallback>
                            {item.user.nome.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>

                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{item.user.nome}</h3>
                            <Badge variant="outline">Prestador</Badge>
                          </div>
                          <div className="mt-1 text-sm text-gray-600 flex flex-col sm:flex-row sm:items-center gap-2">
                            <span className="flex items-center gap-1">
                              <Mail className="h-4 w-4" /> {item.user.email}
                            </span>
                            {item.user.telefone && (
                              <span className="flex items-center gap-1">
                                <Phone className="h-4 w-4" /> {item.user.telefone}
                              </span>
                            )}
                            {item.user.endereco_cidade && (
                              <span className="flex items-center gap-1">
                                <MapPin className="h-4 w-4" /> {item.user.endereco_cidade}
                              </span>
                            )}
                          </div>

                          <div className="mt-3">
                            <ProviderVerificationChecklist
                              hasDocument={!!item.document_url}
                              hasSelfie={!!item.selfie_url}
                              hasProfileData={!!(item.user.nome && item.user.email)}
                              status={item.status}
                            />
                          </div>

                          <div className="mt-3 flex flex-wrap gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                const url = await createSignedUrl(item.document_url || undefined);
                                if (url) window.open(url, '_blank');
                              }}
                            >
                              <FileText className="h-4 w-4 mr-1" />
                              Ver Documento
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={async () => {
                                const url = await createSignedUrl(item.selfie_url || undefined);
                                if (url) window.open(url, '_blank');
                              }}
                            >
                              <ImageIcon className="h-4 w-4 mr-1" />
                              Ver Selfie
                            </Button>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => approveProvider(item.user_id, item.id)}
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => rejectProvider(item.id)}
                        >
                          <XCircle className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Filtros simples */}
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Buscar por nome, email, cidade..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={filterStatus === 'all' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('all')}
                    size="sm"
                  >
                    Todos
                  </Button>
                  <Button
                    variant={filterStatus === 'verified' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('verified')}
                    size="sm"
                  >
                    Verificados
                  </Button>
                  <Button
                    variant={filterStatus === 'active' ? 'default' : 'outline'}
                    onClick={() => setFilterStatus('active')}
                    size="sm"
                  >
                    Ativos
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Prestadores Ativos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {loading ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p>Carregando prestadores...</p>
                </CardContent>
              </Card>
            ) : filteredPrestadores.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <p className="text-gray-500">Nenhum prestador encontrado.</p>
                </CardContent>
              </Card>
            ) : (
              filteredPrestadores.map((prestador) => (
                <Card key={prestador.id}>
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={prestador.foto_perfil} />
                          <AvatarFallback>
                            {prestador.nome.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-lg">{prestador.nome}</h3>
                            {prestador.verificado && (
                              <Badge variant="outline" className="text-green-600 border-green-600">
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Verificado
                              </Badge>
                            )}
                            <Badge variant={(prestador.ativo ?? true) ? 'default' : 'secondary'}>
                              {(prestador.ativo ?? true) ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                          
                          <div className="space-y-1 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <a href={`mailto:${prestador.email}`} className="hover:underline">{prestador.email}</a>
                            </div>
                            {prestador.telefone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                <a href={`tel:${prestador.telefone}`} className="hover:underline">{prestador.telefone}</a>
                              </div>
                            )}
                            {prestador.cidade && (
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                {prestador.cidade} {prestador.bairro ? `- ${prestador.bairro}` : ''}
                              </div>
                            )}
                            {prestador.media_avaliacoes && (
                              <div className="flex items-center gap-2">
                                <Star className="h-4 w-4" />
                                {prestador.media_avaliacoes.toFixed(1)} ({prestador.total_avaliacoes} avaliações)
                              </div>
                            )}
                          </div>

                          <div className="mt-3 flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/prestador/${prestador.id}`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Perfil
                            </Button>
                            {prestador.telefone && (
                              <Button asChild variant="outline" size="sm">
                                <a href={`tel:${prestador.telefone}`}>Ligar</a>
                              </Button>
                            )}
                            <Button asChild variant="outline" size="sm">
                              <a href={`mailto:${prestador.email}`}>Email</a>
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(prestador.id, 'verificado', !(prestador.verificado || false))}
                        >
                          {prestador.verificado ? (
                            <XCircle className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStatusChange(prestador.id, 'ativo', !(prestador.ativo ?? true))}
                        >
                          {(prestador.ativo ?? true) ? (
                            <UserX className="h-4 w-4 text-red-500" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </UnifiedLayout>
  );
};

export default PrestadorManagement;

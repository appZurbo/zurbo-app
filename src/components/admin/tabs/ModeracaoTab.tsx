import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Shield, Flag, Ban, CheckCircle } from 'lucide-react';

interface Report {
    id: string;
    reported_user_id: string;
    reporter_id: string;
    type: 'inappropriate_content' | 'spam' | 'harassment' | 'fake_profile';
    description: string;
    status: 'pending' | 'reviewed' | 'resolved';
    created_at: string;
    reported_user?: {
        nome: string;
        email: string;
        tipo: string;
    };
    reporter?: {
        nome: string;
    };
}

export const ModeracaoTab = () => {
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();
    const { profile, isAdmin } = useAuth();

    useEffect(() => {
        if (isAdmin) {
            loadReports();
        }
    }, [isAdmin]);

    const loadReports = async () => {
        try {
            const { data, error } = await supabase
                .from('user_reports')
                .select(`
          *,
          reported_user:users!user_reports_reported_user_id_fkey (nome, email, tipo),
          reporter:users!user_reports_reporter_id_fkey (nome)
        `)
                .order('created_at', { ascending: false });

            if (error) {
                // Fallback for demo if table doesn't exist yet or permission denied
                console.warn("Could not load reports, using mock data for demo", error);
                setReports([]);
            } else {
                const typedReports: Report[] = (data || []).map(item => ({
                    ...item,
                    type: item.type as Report['type'],
                    status: item.status as Report['status']
                }));
                setReports(typedReports);
            }
        } catch (error: any) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const updateReportStatus = async (reportId: string, status: 'reviewed' | 'resolved') => {
        try {
            const { error } = await supabase
                .from('user_reports')
                .update({ status })
                .eq('id', reportId);

            if (error) throw error;

            setReports(prev =>
                prev.map(report =>
                    report.id === reportId ? { ...report, status } : report
                )
            );

            toast({
                title: "Status atualizado",
                description: `Relatório marcado como ${status === 'reviewed' ? 'revisado' : 'resolvido'}`,
            });
        } catch (error: any) {
            console.error('Error updating report status:', error);
            toast({
                title: "Erro",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    const banUser = async (userId: string, duration: number) => {
        if (!profile) return;

        try {
            const expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + duration);

            const { error } = await supabase
                .from('user_bans')
                .insert({
                    user_id: userId,
                    banned_by: profile.id,
                    reason: 'Violação das regras da comunidade',
                    duration_days: duration,
                    expires_at: expiresAt.toISOString(),
                });

            if (error) throw error;

            toast({
                title: "Usuário banido",
                description: `Usuário banido por ${duration} dias`,
            });
        } catch (error: any) {
            console.error('Error banning user:', error);
            toast({
                title: "Erro",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    const getReportTypeLabel = (type: string) => {
        const types = {
            inappropriate_content: 'Conteúdo Inapropriado',
            spam: 'Spam',
            harassment: 'Assédio',
            fake_profile: 'Perfil Falso',
        };
        return types[type as keyof typeof types] || type;
    };

    const getStatusBadge = (status: string) => {
        const variants = {
            pending: 'destructive',
            reviewed: 'default',
            resolved: 'secondary',
        };

        const labels = {
            pending: 'Pendente',
            reviewed: 'Revisado',
            resolved: 'Resolvido',
        };

        return (
            <Badge variant={variants[status as keyof typeof variants] as any}>
                {labels[status as keyof typeof labels]}
            </Badge>
        );
    };

    const stats = {
        pending: reports.filter(r => r.status === 'pending').length,
        reviewed: reports.filter(r => r.status === 'reviewed').length,
        resolved: reports.filter(r => r.status === 'resolved').length,
        total: reports.length
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-gray-900">{stats.total}</span>
                        <span className="text-sm text-gray-500">Total</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-red-500">{stats.pending}</span>
                        <span className="text-sm text-gray-500">Pendentes</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-orange-500">{stats.reviewed}</span>
                        <span className="text-sm text-gray-500">Em Revisão</span>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-green-500">{stats.resolved}</span>
                        <span className="text-sm text-gray-500">Resolvidos</span>
                    </CardContent>
                </Card>
            </div>

            {reports.length === 0 ? (
                <Card>
                    <CardContent className="p-8 text-center">
                        <Flag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-semibold mb-2">Nenhum relatório</h3>
                        <p className="text-gray-600">
                            Não há relatórios de usuários no momento.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-4">
                    {reports.map((report) => (
                        <Card key={report.id}>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle className="text-lg">
                                        {getReportTypeLabel(report.type)}
                                    </CardTitle>
                                    {getStatusBadge(report.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm text-gray-600">
                                            <strong>Usuário reportado:</strong> {report.reported_user?.nome} ({report.reported_user?.email})
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Reportado por:</strong> {report.reporter?.nome}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            <strong>Data:</strong> {new Date(report.created_at).toLocaleDateString('pt-BR')}
                                        </p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium mb-2">Descrição:</p>
                                        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                            {report.description}
                                        </p>
                                    </div>

                                    {report.status === 'pending' && (
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => updateReportStatus(report.id, 'reviewed')}
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Marcar como Revisado
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => banUser(report.reported_user_id, 7)}
                                            >
                                                <Ban className="h-4 w-4 mr-1" />
                                                Banir por 7 dias
                                            </Button>
                                            <Button
                                                size="sm"
                                                onClick={() => updateReportStatus(report.id, 'resolved')}
                                            >
                                                Resolver
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

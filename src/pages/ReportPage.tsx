
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { getUserProfile } from '@/utils/database';
import ReportUserButton from '@/components/security/ReportUserButton';

const ReportPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [reportedUser, setReportedUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
      return;
    }

    if (id) {
      loadUserData();
    }
  }, [id, isAuthenticated]);

  const loadUserData = async () => {
    try {
      const userData = await getUserProfile(id!);
      setReportedUser(userData);
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!reportedUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-red-500" />
            <h3 className="text-lg font-semibold mb-2">Usuário não encontrado</h3>
            <p className="text-gray-600 mb-4">
              O usuário que você tentou reportar não foi encontrado.
            </p>
            <Button onClick={() => navigate('/')} className="w-full">
              Voltar ao início
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto p-4">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Reportar Usuário</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Denunciar {reportedUser.nome}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Importante:</strong> Use este recurso apenas para reportar comportamentos 
                inadequados, spam, fraudes ou violações das nossas regras da comunidade. 
                Denúncias falsas podem resultar em penalidades na sua conta.
              </p>
            </div>

            <div className="flex items-center gap-4 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold text-lg">
                  {reportedUser.nome?.[0]?.toUpperCase()}
                </span>
              </div>
              <div>
                <h3 className="font-semibold">{reportedUser.nome}</h3>
                <p className="text-sm text-gray-600">
                  {reportedUser.tipo === 'prestador' ? 'Prestador de Serviços' : 'Cliente'}
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <ReportUserButton 
                reportedUserId={reportedUser.id}
                reportedUserName={reportedUser.nome}
                variant="button"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportPage;

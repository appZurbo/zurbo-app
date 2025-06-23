
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings as SettingsIcon, User, Wrench } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { UserSettings } from '@/components/settings/UserSettings';
import PrestadorSettings from './PrestadorSettings';

const Settings = () => {
  const navigate = useNavigate();
  const { profile, isPrestador, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-500 rounded-xl flex items-center justify-center animate-pulse">
            <span className="text-white font-bold text-2xl">Z</span>
          </div>
          <p>Carregando configurações...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Acesso Restrito</h3>
            <p className="text-gray-600 mb-4">
              Você precisa estar logado para acessar as configurações.
            </p>
            <Button onClick={() => navigate('/auth')}>
              Fazer Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => navigate('/')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <SettingsIcon className="h-6 w-6" />
              Configurações
            </h1>
            <p className="text-gray-600">
              {isPrestador ? (
                <>
                  <Wrench className="h-4 w-4 inline mr-1" />
                  Painel do Prestador de Serviços
                </>
              ) : (
                <>
                  <User className="h-4 w-4 inline mr-1" />
                  Configurações do Cliente
                </>
              )}
            </p>
          </div>
        </div>

        {isPrestador ? <PrestadorSettings /> : <UserSettings />}
      </div>
    </div>
  );
};

export default Settings;

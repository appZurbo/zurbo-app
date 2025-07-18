import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const SocialAuthSetupGuide: React.FC = () => {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configuração de Login Social
        </CardTitle>
        <CardDescription>
          Para ativar o login com Google, Facebook e Apple, siga os passos abaixo:
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Google Setup */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Google OAuth</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">1. Acesse o Google Cloud Console</p>
                <Button
                  variant="link"
                  className="h-auto p-0 text-blue-600"
                  onClick={() => window.open('https://console.cloud.google.com/', '_blank')}
                >
                  https://console.cloud.google.com/
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>2. Crie ou selecione um projeto</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>3. Ative a Google+ API</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>4. Configure a tela de consentimento OAuth</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p>5. Crie credenciais OAuth 2.0</p>
                <p className="text-gray-600 ml-6">- Adicione seu domínio em "Origens JavaScript autorizadas"</p>
                <p className="text-gray-600 ml-6">- Adicione a URL de callback do Supabase em "URIs de redirecionamento"</p>
              </div>
            </div>
          </div>
        </div>

        {/* Facebook Setup */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Facebook Login</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">1. Acesse o Facebook Developers</p>
                <Button
                  variant="link"
                  className="h-auto p-0 text-blue-600"
                  onClick={() => window.open('https://developers.facebook.com/', '_blank')}
                >
                  https://developers.facebook.com/
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>2. Crie um novo app</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>3. Adicione o produto "Facebook Login"</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>4. Configure as URLs de redirecionamento OAuth válidas</p>
            </div>
          </div>
        </div>

        {/* Apple Setup */}
        <div className="space-y-3">
          <h3 className="font-semibold text-lg">Apple Sign In</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium">1. Acesse o Apple Developer Portal</p>
                <Button
                  variant="link"
                  className="h-auto p-0 text-blue-600"
                  onClick={() => window.open('https://developer.apple.com/', '_blank')}
                >
                  https://developer.apple.com/
                  <ExternalLink className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>2. Registre um App ID</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>3. Ative o "Sign In with Apple"</p>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
              <p>4. Configure os domínios e subdomínios</p>
            </div>
          </div>
        </div>

        {/* Supabase Configuration */}
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            <strong>Configuração no Supabase:</strong>
            <br />
            1. Acesse o painel do Supabase → Authentication → Providers
            <br />
            2. Ative os provedores desejados (Google, Facebook, Apple)
            <br />
            3. Insira as credenciais obtidas (Client ID, Client Secret)
            <br />
            4. Configure as URLs de redirecionamento
            <br />
            5. Salve as configurações
          </AlertDescription>
        </Alert>

        <div className="flex justify-center">
          <Button
            onClick={() => window.open('https://supabase.com/dashboard/project/mbzxifrkabfnufliawzo/auth/providers', '_blank')}
            className="flex items-center gap-2"
          >
            Configurar no Supabase
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

import { useState } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServiceCategories from '@/components/ServiceCategories';
import PrestadorList from '@/components/PrestadorList';
import AuthModal from '@/components/AuthModal';
import ChatModal from '@/components/ChatModal';
import ScheduleModal from '@/components/ScheduleModal';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register-client' | 'register-prestador'>('login');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [selectedPrestador, setSelectedPrestador] = useState(null);
  
  const { toast } = useToast();

  const handleLogin = (userData: any) => {
    setUser(userData);
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo(a), ${userData.name}!`,
    });
  };

  const handleLogout = () => {
    setUser(null);
    setSelectedCategory('');
    setShowSearch(false);
    toast({
      title: "Logout realizado",
      description: "Até logo!",
    });
  };

  const handleBecomePrestador = () => {
    setAuthTab('register-prestador');
    setShowAuthModal(true);
  };

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setShowSearch(true);
  };

  const handleSearch = (query: string) => {
    setShowSearch(true);
    toast({
      title: "Buscando prestadores...",
      description: "Encontrando os melhores profissionais para você!",
    });
  };

  const handleViewProfile = (prestadorId: string) => {
    toast({
      title: "Abrindo perfil",
      description: "Carregando informações do prestador...",
    });
  };

  const handleSchedule = (prestadorId: string) => {
    const prestador = {
      id: prestadorId,
      name: 'Ana Silva',
      category: 'Limpeza Residencial',
      price: 'R$ 80/dia'
    };
    setSelectedPrestador(prestador);
    setShowSchedule(true);
  };

  const handleChat = (prestadorId: string) => {
    const prestador = {
      id: prestadorId,
      name: 'Ana Silva',
      avatar: '',
      isOnline: true
    };
    setSelectedPrestador(prestador);
    setShowChat(true);
  };

  const handleConfirmSchedule = (scheduleData: any) => {
    toast({
      title: "Agendamento solicitado!",
      description: "O prestador será notificado e você receberá uma confirmação em breve.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        user={user}
        onLogin={() => setShowAuthModal(true)}
        onLogout={handleLogout}
        onBecomePrestador={handleBecomePrestador}
      />
      
      {!showSearch ? (
        <>
          <HeroSection onSearch={handleSearch} />
          <ServiceCategories onCategorySelect={handleCategorySelect} />
          
          <section className="py-16 bg-white">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <h2 className="text-3xl font-bold mb-8">Como funciona o ZURBO</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">1</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Escolha o Serviço</h3>
                  <p className="text-gray-600">Navegue pelas categorias e encontre o que precisa</p>
                </div>
                <div className="animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">2</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Conecte-se</h3>
                  <p className="text-gray-600">Converse com prestadores e agende o serviço</p>
                </div>
                <div className="animate-fade-in">
                  <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl font-bold text-green-600">3</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Avalie</h3>
                  <p className="text-gray-600">Compartilhe sua experiência e ajude outros usuários</p>
                </div>
              </div>
            </div>
          </section>
        </>
      ) : (
        <PrestadorList
          category={selectedCategory}
          onViewProfile={handleViewProfile}
          onSchedule={handleSchedule}
          onChat={handleChat}
        />
      )}

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLogin={handleLogin}
        defaultTab={authTab}
      />

      {selectedPrestador && (
        <>
          <ChatModal
            isOpen={showChat}
            onClose={() => setShowChat(false)}
            prestador={selectedPrestador}
          />
          
          <ScheduleModal
            isOpen={showSchedule}
            onClose={() => setShowSchedule(false)}
            prestador={selectedPrestador}
            onSchedule={handleConfirmSchedule}
          />
        </>
      )}

      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4 gradient-bg bg-clip-text text-transparent">ZURBO</h3>
              <p className="text-gray-300">Conectando você aos melhores prestadores de serviços da sua região.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Clientes</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Como funciona</li>
                <li>Categorias</li>
                <li>Avaliações</li>
                <li>Suporte</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Prestadores</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Cadastre-se</li>
                <li>Central do Prestador</li>
                <li>Dicas</li>
                <li>Comissões</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-300">
                <li>suporte@zurbo.com</li>
                <li>(11) 99999-9999</li>
                <li>Termos de Uso</li>
                <li>Privacidade</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 ZURBO. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import { useState, useEffect } from 'react';
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
  const {
    toast
  } = useToast();
  const handleLogin = (userData: any) => {
    setUser(userData);
    toast({
      title: "Login realizado com sucesso!",
      description: `Bem-vindo(a), ${userData.name}!`
    });
  };
  const handleLogout = () => {
    setUser(null);
    setSelectedCategory('');
    setShowSearch(false);
    toast({
      title: "Logout realizado",
      description: "Até logo!"
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
      description: "Encontrando os melhores profissionais para você!"
    });
  };
  const handleViewProfile = (prestadorId: string) => {
    toast({
      title: "Abrindo perfil",
      description: "Carregando informações do prestador..."
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
      description: "O prestador será notificado e você receberá uma confirmação em breve."
    });
  };

  // Add scroll animation effect
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1
    });
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    animatedElements.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [showSearch]);
  return <div className="min-h-screen bg-gray-50">
      <Header user={user} onLogin={() => setShowAuthModal(true)} onLogout={handleLogout} onBecomePrestador={handleBecomePrestador} />
      
      {!showSearch ? <>
          <HeroSection onSearch={handleSearch} />
          <ServiceCategories onCategorySelect={handleCategorySelect} />
          
          <section className="bg-white py-[22px]">
            <div className="max-w-6xl mx-auto px-4 text-center">
              <div className="animate-on-scroll mb-16">
                <h2 className="text-4xl font-bold mb-6 text-gray-900">
                  Como funciona o <span className="text-gradient">ZURBO</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Três passos simples para conectar você ao profissional ideal
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-12">
                <div className="animate-on-scroll hover-lift" style={{
              animationDelay: '0.1s'
            }}>
                  <div className="w-20 h-20 mx-auto mb-6 orange-gradient rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">1</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Escolha o Serviço</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Navegue pelas categorias e encontre exatamente o que precisa para sua casa ou negócio
                  </p>
                </div>
                
                <div className="animate-on-scroll hover-lift" style={{
              animationDelay: '0.2s'
            }}>
                  <div className="w-20 h-20 mx-auto mb-6 orange-gradient rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">2</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Conecte-se</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Converse diretamente com prestadores qualificados e agende o melhor horário
                  </p>
                </div>
                
                <div className="animate-on-scroll hover-lift" style={{
              animationDelay: '0.3s'
            }}>
                  <div className="w-20 h-20 mx-auto mb-6 orange-gradient rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-3xl font-bold text-white">3</span>
                  </div>
                  <h3 className="text-2xl font-semibold mb-4 text-gray-900">Avalie</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Compartilhe sua experiência e ajude outros usuários a encontrar os melhores profissionais
                  </p>
                </div>
              </div>
            </div>
          </section>
        </> : <PrestadorList category={selectedCategory} onViewProfile={handleViewProfile} onSchedule={handleSchedule} onChat={handleChat} />}

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} onLogin={handleLogin} defaultTab={authTab} />

      {selectedPrestador && <>
          <ChatModal isOpen={showChat} onClose={() => setShowChat(false)} prestador={selectedPrestador} />
          
          <ScheduleModal isOpen={showSchedule} onClose={() => setShowSchedule(false)} prestador={selectedPrestador} onSchedule={handleConfirmSchedule} />
        </>}

      <footer className="text-white py-16 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="animate-on-scroll">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 orange-gradient rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">Z</span>
                </div>
                <h3 className="text-2xl font-bold text-gradient">ZURBO</h3>
              </div>
              <p className="leading-relaxed text-zinc-50">
                Conectando você aos melhores prestadores de serviços da sua região com segurança e praticidade.
              </p>
            </div>
            
            <div className="animate-on-scroll" style={{
            animationDelay: '0.1s'
          }}>
              <h4 className="font-semibold mb-6 text-lg text-zinc-50">Para Clientes</h4>
              <ul className="space-y-3 text-gray-300 bg-transparent">
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Como funciona</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Categorias</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors bg-transparent">Avaliações</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Suporte</li>
              </ul>
            </div>
            
            <div className="animate-on-scroll" style={{
            animationDelay: '0.2s'
          }}>
              <h4 className="font-semibold mb-6 text-lg text-zinc-50">Para Prestadores</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Cadastre-se</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Central do Prestador</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Dicas</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Comissões</li>
              </ul>
            </div>
            
            <div className="animate-on-scroll" style={{
            animationDelay: '0.3s'
          }}>
              <h4 className="font-semibold mb-6 text-lg text-zinc-50">Contato</h4>
              <ul className="space-y-3 text-gray-300">
                <li className="hover:text-orange-400 cursor-pointer transition-colors">suporte@zurbo.com</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">(11) 99999-9999</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Termos de Uso</li>
                <li className="hover:text-orange-400 cursor-pointer transition-colors">Privacidade</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center text-gray-400">
            <p className="font-normal text-gray-100"> ZURBO® Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>;
};
export default Index;
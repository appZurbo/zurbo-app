import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ArrowLeft, Search, ChevronDown, MessageCircle, Phone, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMobile } from '@/hooks/useMobile';
const CentralAjuda = () => {
  const navigate = useNavigate();
  const isMobile = useMobile();
  const [searchTerm, setSearchTerm] = useState('');
  const faqItems = [{
    category: "Conta e Cadastro",
    questions: [{
      question: "Como criar uma conta no ZURBO?",
      answer: "Para criar sua conta, clique em 'Entrar' no menu superior e depois em 'Cadastre-se'. Escolha se você é cliente ou prestador de serviços e preencha os dados solicitados."
    }, {
      question: "Esqueci minha senha, como recuperar?",
      answer: "Na tela de login, clique em 'Esqueci minha senha'. Digite seu email e enviaremos um link para redefinir sua senha."
    }, {
      question: "Como alterar informações do meu perfil?",
      answer: "Acesse 'Configurações' no menu e vá para a aba 'Perfil'. Lá você pode editar suas informações pessoais e profissionais."
    }]
  }, {
    category: "Para Clientes",
    questions: [{
      question: "Como encontrar um prestador de serviços?",
      answer: "Use a barra de busca na página inicial ou navegue pelas categorias. Você pode filtrar por localização, preço e avaliações."
    }, {
      question: "Como entrar em contato com um prestador?",
      answer: "No perfil do prestador, clique em 'Conversar' para iniciar um chat direto ou use o botão 'Agendar Serviço'."
    }, {
      question: "Como avaliar um serviço?",
      answer: "Após a conclusão do serviço, você receberá uma notificação para avaliá-lo. Acesse 'Meus Pedidos' e deixe sua avaliação."
    }]
  }, {
    category: "Para Prestadores",
    questions: [{
      question: "Como cadastrar meus serviços?",
      answer: "Nas configurações, vá para 'Serviços' e adicione os tipos de serviço que você oferece, com preços e descrições."
    }, {
      question: "Como funciona o plano Premium?",
      answer: "O plano Premium oferece destaque nos resultados de busca, mais fotos no portfólio e estatísticas avançadas."
    }, {
      question: "Como definir minha área de atendimento?",
      answer: "Em 'Configurações > Bairros', você pode adicionar os bairros onde atende e definir se cobra taxa de deslocamento."
    }]
  }, {
    category: "Pagamentos e Segurança",
    questions: [{
      question: "Como funciona o pagamento?",
      answer: "Os pagamentos são negociados diretamente entre cliente e prestador. Recomendamos usar métodos seguros como PIX ou transferência."
    }, {
      question: "O ZURBO é seguro?",
      answer: "Sim! Verificamos todos os prestadores, temos sistema de avaliações e chat seguro. Em caso de problemas, entre em contato conosco."
    }, {
      question: "Como denunciar um usuário?",
      answer: "No perfil do usuário, clique nos três pontos e selecione 'Denunciar'. Nossa equipe analisará o caso em até 24 horas."
    }]
  }];
  const filteredFAQ = faqItems.map(category => ({
    ...category,
    questions: category.questions.filter(item => item.question.toLowerCase().includes(searchTerm.toLowerCase()) || item.answer.toLowerCase().includes(searchTerm.toLowerCase()))
  })).filter(category => category.questions.length > 0);
  return <div className={`min-h-screen bg-gray-50 ${isMobile ? 'pb-20' : ''}`}>
    <div className={`${isMobile ? 'px-4 py-4' : 'max-w-4xl mx-auto p-6'}`}>
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Button variant="ghost" onClick={() => navigate('/')} className={`${isMobile ? 'h-10 w-10 p-0' : ''}`}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          {!isMobile && 'Voltar'}
        </Button>
        <div>
          <h1 className={`font-bold text-gray-900 ${isMobile ? 'text-xl' : 'text-3xl'}`}>
            Central de Ajuda
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            Encontre respostas para suas dúvidas
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-8">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input placeholder="Buscar na central de ajuda..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10" />
      </div>

      {/* Contact Options */}
      <div className="grid gap-4 mb-8 md:grid-cols-3">
        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <MessageCircle className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Chat Online</h3>
            <p className="text-sm text-gray-600">Fale conosco em tempo real</p>
          </CardContent>
        </Card>

        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Mail className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Email</h3>
            <p className="text-sm text-gray-600">contato@zurbo.com.br</p>
          </CardContent>
        </Card>

        <Card className="text-center cursor-pointer hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <Phone className="h-8 w-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Telefone</h3>
            <p className="text-sm text-gray-600">(66) 99914-5353</p>
          </CardContent>
        </Card>
      </div>

      {/* FAQ */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Perguntas Frequentes</h2>

        {filteredFAQ.length === 0 ? <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-600">Nenhum resultado encontrado para "{searchTerm}"</p>
            <Button variant="outline" onClick={() => setSearchTerm('')} className="mt-4">
              Limpar busca
            </Button>
          </CardContent>
        </Card> : filteredFAQ.map((category, categoryIndex) => <Card key={categoryIndex}>
          <CardHeader>
            <CardTitle>{category.category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {category.questions.map((item, index) => <Collapsible key={index}>
              <CollapsibleTrigger className="flex w-full items-center justify-between text-left p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium">{item.question}</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </CollapsibleTrigger>
              <CollapsibleContent className="px-3 pb-3">
                <p className="text-gray-600 mt-2">{item.answer}</p>
              </CollapsibleContent>
            </Collapsible>)}
          </CardContent>
        </Card>)}
      </div>

      {/* Still need help */}
      <Card className="mt-8">
        <CardContent className="p-8 text-center">
          <h3 className="text-xl font-semibold mb-4">Ainda precisa de ajuda?</h3>
          <p className="text-gray-600 mb-6">
            Nossa equipe de suporte está sempre pronta para ajudar você.
          </p>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Entrar em Contato
          </Button>
        </CardContent>
      </Card>
    </div>
  </div>;
};
export default CentralAjuda;
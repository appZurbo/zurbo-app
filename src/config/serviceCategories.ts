import { 
  Wrench, Zap, Scissors, Brush, Hammer, TreePine, Car, Home, Laptop, Baby,
  ChefHat, Heart, Droplets, Truck, Sparkles, Snowflake, Monitor, Paintbrush, Key
} from 'lucide-react';

export interface ServiceCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  image: string;
  serviceIds: string[];
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'limpeza',
    name: 'Limpeza',
    icon: Sparkles,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    image: 'limpeza.png',
    serviceIds: ['13e3d8e2-ca44-4f37-bf48-d5900766a4ed', '49b33016-e956-432d-9887-40f54e02e630'] // Limpeza, Diarista
  },
  {
    id: 'reparos',
    name: 'Reparos',
    icon: Wrench,
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    image: 'reparos.png',
    serviceIds: ['ce1a57d6-df65-42e4-bc5e-1daf54ba5958', 'eed94aa8-4055-40ac-a7cf-18212dfc97e3'] // Montador de móveis, Pedreiro
  },
  {
    id: 'eletrica',
    name: 'Elétrica',
    icon: Zap,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    image: 'eletricista.png',
    serviceIds: ['929a9d65-45ae-4bc3-9aca-8672d9700d7b', 'bd19e35c-d9a8-41a6-a792-5e4343309139'] // Elétrica, Eletricista
  },
  {
    id: 'beleza',
    name: 'Beleza',
    icon: Scissors,
    color: 'bg-pink-50 border-pink-200 hover:bg-pink-100',
    image: 'beleza.png',
    serviceIds: ['ca56750e-8d06-4586-958c-c3d6c9a7b995', 'db2f4ed1-9506-4c01-8ea1-87a068dc2e9b'] // Beleza, Cabeleireiro(a)
  },
  {
    id: 'construcao',
    name: 'Construção',
    icon: Hammer,
    color: 'bg-green-50 border-green-200 hover:bg-green-100',
    image: 'construcao.png',
    serviceIds: ['fb0f8f1d-6734-4d25-b9e4-bcae95faf5b5', 'bc344b0e-551a-4253-90bf-74a8ad8095ca', 'a0e99c0b-dc37-4ff1-93c4-895f3d784fd9'] // Construção, Pintor, Pintura
  },
  {
    id: 'jardinagem',
    name: 'Jardinagem',
    icon: TreePine,
    color: 'bg-emerald-50 border-emerald-200 hover:bg-emerald-100',
    image: 'jardinagem.png',
    serviceIds: ['3a876101-e4b9-40fa-828f-7a25ee4d3127', 'f2f93a54-860e-4af3-941b-95e32a772428'] // Jardinagem, Jardineiro
  },
  {
    id: 'fretes',
    name: 'Fretes',
    icon: Truck,
    color: 'bg-red-50 border-red-200 hover:bg-red-100',
    image: 'frete2 (1).png',
    serviceIds: ['5c19ce68-8639-4eed-bf3c-1ec673d43add', 'd61fbe10-657a-45a4-9476-8a2f37988c42'] // Fretes, Serviços de Frete
  },
  {
    id: 'chaveiro',
    name: 'Chaveiro',
    icon: Key,
    color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100',
    image: 'chaveiro.png',
    serviceIds: [] // Em breve
  },
  {
    id: 'encanador',
    name: 'Encanador',
    icon: Droplets,
    color: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    image: 'lovable-uploads/encanador.png',
    serviceIds: [] // Em breve
  },
  {
    id: 'cozinha',
    name: 'Cozinha',
    icon: ChefHat,
    color: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    image: 'lovable-uploads/cozinha.png',
    serviceIds: [] // Em breve
  },
  {
    id: 'tecnologia',
    name: 'Tecnologia',
    icon: Laptop,
    color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100',
    image: 'tecnicoinformatica.png',
    serviceIds: ['b8a42132-1792-4ee4-bafe-b74f771e26ab'] // Serviços de TI
  },
  {
    id: 'cuidados',
    name: 'Cuidados',
    icon: Baby,
    color: 'bg-teal-50 border-teal-200 hover:bg-teal-100',
    image: 'cuidados2 (1).png',
    serviceIds: ['ab0869db-7537-46fe-b823-b8490ab364ff', '480b2d2c-58a6-4000-8a47-e75a949d882d', '70fc8f4b-f6b9-465e-864d-e497631948b4'] // Babá, Cuidador(a) de idosos, Pet Care
  },
  {
    id: 'refrigeracao',
    name: 'Refrigeração',
    icon: Snowflake,
    color: 'bg-cyan-50 border-cyan-200 hover:bg-cyan-100',
    image: 'refrigeracao.png',
    serviceIds: ['d7956946-b312-4f8b-bfae-e6ca5f91e3f3', 'd397bcc6-883a-495f-b19e-f1a34c1b0312'] // Manutenção de Ar-condicionado, Refrigeração
  },
  {
    id: 'mecanico',
    name: 'Mecânico',
    icon: Car,
    color: 'bg-gray-50 border-gray-200 hover:bg-gray-100',
    image: 'mecanicos.png',
    serviceIds: [] // Em breve
  }
];

// Mapeamento completo de ícones para todos os serviços
export const serviceIconMap = {
  // Serviços existentes
  'babá': { icon: Baby, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  'beleza': { icon: Scissors, color: 'text-pink-600', bgColor: 'bg-pink-100' },
  'cabeleireiro(a)': { icon: Scissors, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  'construção': { icon: Hammer, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'cozinha': { icon: ChefHat, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'cuidador(a) de idosos': { icon: Heart, color: 'text-red-600', bgColor: 'bg-red-100' },
  'diarista': { icon: Sparkles, color: 'text-emerald-600', bgColor: 'bg-emerald-100' },
  'elétrica': { icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'eletricista': { icon: Zap, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'encanador': { icon: Droplets, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'encanamento': { icon: Droplets, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'fretes': { icon: Truck, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'jardinagem': { icon: TreePine, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'jardineiro': { icon: TreePine, color: 'text-green-600', bgColor: 'bg-green-100' },
  'limpeza': { icon: Sparkles, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'manutenção de ar-condicionado': { icon: Snowflake, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  'montador de móveis': { icon: Wrench, color: 'text-lime-600', bgColor: 'bg-lime-100' },
  'pedreiro': { icon: Hammer, color: 'text-gray-600', bgColor: 'bg-gray-100' },
  'pet care': { icon: Heart, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'pintor': { icon: Paintbrush, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  'pintura': { icon: Paintbrush, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'refrigeração': { icon: Snowflake, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  'serviços de frete': { icon: Truck, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  'serviços de ti': { icon: Monitor, color: 'text-cyan-600', bgColor: 'bg-cyan-100' },
  
  // Categorias principais (fallback)
  'chaveiro': { icon: Key, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
  'marido de aluguel': { icon: Hammer, color: 'text-green-600', bgColor: 'bg-green-100' }
};

export const getServiceIcon = (serviceName: string) => {
  const normalizedName = serviceName.toLowerCase();
  return serviceIconMap[normalizedName] || {
    icon: Wrench,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100'
  };
};

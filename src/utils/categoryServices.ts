
import { serviceCategories } from '@/config/serviceCategories';

// Service names mapped by category for display in modals
export const categoryServiceNames: Record<string, string[]> = {
  limpeza: ['Limpeza', 'Diarista'],
  reparos: ['Montador de móveis', 'Pedreiro'],
  eletrica: ['Elétrica', 'Eletricista'],
  beleza: ['Beleza', 'Cabeleireiro(a)'],
  construcao: ['Construção', 'Pedreiro', 'Pintor', 'Pintura'],
  jardinagem: ['Jardinagem', 'Jardineiro'],
  fretes: ['Fretes', 'Serviços de Frete'],
  domestico: ['Cozinha', 'Encanador', 'Encanamento'],
  tecnologia: ['Serviços de TI'],
  cuidados: ['Babá', 'Cuidador(a) de idosos', 'Pet Care'],
  refrigeracao: ['Manutenção de Ar-condicionado', 'Refrigeração'],
  mecanico: ['Serviços Mecânicos']
};

// Category descriptions for modals
export const categoryDescriptions: Record<string, string> = {
  limpeza: 'Serviços completos de limpeza residencial e comercial, incluindo limpeza profunda, manutenção regular e cuidados domésticos.',
  reparos: 'Reparos gerais para sua casa ou escritório, incluindo montagem de móveis, pequenos consertos e manutenções.',
  eletrica: 'Serviços elétricos profissionais e seguros, desde pequenos reparos até instalações completas e manutenções preventivas.',
  beleza: 'Serviços de beleza e cuidados pessoais no conforto da sua casa, incluindo cabelo, maquiagem e tratamentos estéticos.',
  construcao: 'Serviços de construção, reforma e pintura para transformar e renovar seus espaços com qualidade profissional.',
  jardinagem: 'Cuidados completos para seu jardim, incluindo poda, plantio, manutenção de gramados e paisagismo.',
  fretes: 'Serviços de transporte e mudanças com segurança e pontualidade para suas necessidades de logística.',
  domestico: 'Serviços domésticos essenciais como encanamento, cozinha e manutenções gerais da casa.',
  tecnologia: 'Suporte técnico especializado em informática, reparos de equipamentos e soluções tecnológicas.',
  cuidados: 'Cuidados especializados para crianças, idosos e pets com profissionais qualificados e experientes.',
  refrigeracao: 'Manutenção e reparo de sistemas de refrigeração e ar-condicionado para seu conforto.',
  mecanico: 'Serviços mecânicos especializados para manutenção e reparo de veículos.'
};

export const getCategoryInfo = (categoryId: string) => {
  const category = serviceCategories.find(cat => cat.id === categoryId);
  return {
    category,
    services: categoryServiceNames[categoryId] || [],
    description: categoryDescriptions[categoryId] || 'Serviços profissionais de qualidade.'
  };
};

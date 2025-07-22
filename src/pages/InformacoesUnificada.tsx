import React from 'react';
import { UnifiedLayout } from '@/components/layout/UnifiedLayout';
import WatermarkSection from '@/components/sections/WatermarkSection';

const InformacoesUnificada = () => {
  return (
    <UnifiedLayout>
      <div className="min-h-screen bg-gray-50">
        {/* Conteúdo da página InformacoesUnificada */}
        <div className="container mx-auto py-8">
          <h1 className="text-2xl font-bold mb-4">Informações Unificadas</h1>
          <p className="mb-4">
            Esta é uma página de informações unificadas. Adicione aqui o conteúdo
            relevante para todos os usuários.
          </p>
          {/* Adicione mais conteúdo conforme necessário */}
        </div>
      </div>
      
      <WatermarkSection />
    </UnifiedLayout>
  );
};

export default InformacoesUnificada;

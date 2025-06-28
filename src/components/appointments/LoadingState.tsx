
import React from 'react';

export const LoadingState: React.FC = () => {
  return (
    <div className="text-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
      <p className="text-sm text-gray-600 mt-2">Carregando pedidos...</p>
    </div>
  );
};


import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useState } from 'react';

export const TestBanner = () => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <Alert className="bg-yellow-50 border-yellow-200 text-yellow-800 mx-4 sm:mx-6 lg:mx-8 mt-4 relative">
      <Button
        variant="ghost"
        size="sm"
        className="absolute top-2 right-2 h-6 w-6 p-0 text-yellow-600 hover:text-yellow-800 hover:bg-yellow-100"
        onClick={() => setIsVisible(false)}
      >
        <X className="h-4 w-4" />
      </Button>
      <AlertDescription className="text-center py-2 pr-8">
        <span className="text-lg">🚀</span>
        <strong className="mx-2">O Zurbo está em testes</strong>
        e sua experiência definirá nosso futuro. Nos ajude a crescer, deixe avaliações ou comentários e recomende o Zurbo para todo mundo!
      </AlertDescription>
    </Alert>
  );
};

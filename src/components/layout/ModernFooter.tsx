import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';
export const ModernFooter = () => {
  return <footer className="bg-gray-900 text-white relative overflow-hidden">
      
      
      {/* Marca d'água "zurbo" */}
      <div className="absolute left-1/2 transform -translate-x-1/2 text-orange-500 font-extrabold text-[15vw] lowercase select-none z-0" style={{
      bottom: '-6.5vw'
    }}>
        zurbo
      </div>
    </footer>;
};
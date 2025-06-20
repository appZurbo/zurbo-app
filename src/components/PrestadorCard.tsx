
import { Star, MapPin, Clock, MessageCircle, Calendar } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface PrestadorCardProps {
  prestador: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    reviewCount: number;
    distance: string;
    category: string;
    price: string;
    description: string;
    responseTime: string;
    isOnline: boolean;
  };
  onViewProfile: (id: string) => void;
  onSchedule: (id: string) => void;
  onChat: (id: string) => void;
}

const PrestadorCard = ({ prestador, onViewProfile, onSchedule, onChat }: PrestadorCardProps) => {
  return (
    <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={prestador.avatar} />
              <AvatarFallback>
                {prestador.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {prestador.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-lg">{prestador.name}</h3>
                <p className="text-gray-600 text-sm">{prestador.category}</p>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-green-600">{prestador.price}</div>
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{prestador.rating}</span>
                  <span>({prestador.reviewCount})</span>
                </div>
              </div>
            </div>
            
            <p className="text-gray-600 mt-2 text-sm line-clamp-2">{prestador.description}</p>
            
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <MapPin className="h-4 w-4" />
                  <span>{prestador.distance}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{prestador.responseTime}</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onChat(prestador.id)}
                >
                  <MessageCircle className="h-4 w-4 mr-1" />
                  Chat
                </Button>
                <Button 
                  size="sm"
                  className="gradient-bg"
                  onClick={() => onSchedule(prestador.id)}
                >
                  <Calendar className="h-4 w-4 mr-1" />
                  Agendar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PrestadorCard;

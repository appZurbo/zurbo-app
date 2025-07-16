import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MoreVertical, CheckCircle, AlertTriangle } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { UserProfile, Pedido } from '@/utils/database/types';
import { ConfirmacaoServico } from '@/components/pedidos/ConfirmacaoServico';

interface PedidoCardProps {
  pedido: Pedido;
  currentUser?: UserProfile | null;
  onUpdate?: () => void;
}

export const PedidoCard: React.FC<PedidoCardProps> = ({ pedido, currentUser, onUpdate }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatarData = (data: string) => {
    return format(new Date(data), 'dd \'de\' MMMM \'às\' HH:mm', { locale: ptBR });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pendente':
        return <Badge variant="outline">Pendente</Badge>;
      case 'aceito':
        return <Badge className="bg-green-100 text-green-800 border-green-200">Aceito</Badge>;
      case 'em_andamento':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Em Andamento</Badge>;
      case 'concluido':
        return <Badge className="bg-green-500 text-white border-green-600"><CheckCircle className="h-4 w-4 mr-1" /> Concluído</Badge>;
      case 'cancelado':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><AlertTriangle className="h-4 w-4 mr-1" /> Cancelado</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-start">
          <Avatar className="mr-4">
            <AvatarImage src={pedido.servico?.icone} />
            <AvatarFallback>{pedido.servico?.nome?.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{pedido.titulo}</h4>
            <p className="text-xs text-gray-500">
              Solicitado em: {formatarData(pedido.data_solicitacao)}
            </p>
            {getStatusBadge(pedido.status)}
          </div>
          <DropdownMenu className="ml-auto">
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Abrir menu</span>
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Editar
              </DropdownMenuItem>
              <DropdownMenuItem>
                Cancelar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h5 className="text-sm font-medium">Detalhes do Pedido</h5>
          <p className="text-sm text-gray-700">
            <strong>Serviço:</strong> {pedido.servico?.nome}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Cliente:</strong> {pedido.cliente?.nome}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Prestador:</strong> {pedido.prestador?.nome}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Preço Acordado:</strong> R$ {pedido.preco_acordado?.toFixed(2)}
          </p>
          {isExpanded && (
            <>
              <p className="text-sm text-gray-700">
                <strong>Endereço:</strong> {pedido.endereco_completo}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Descrição:</strong> {pedido.descricao}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Observações:</strong> {pedido.observacoes}
              </p>
            </>
          )}
          <Button variant="link" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? "Ver Menos" : "Ver Mais"}
          </Button>
        </div>
        
        {/* Add service confirmation component */}
        {currentUser && (
          <ConfirmacaoServico 
            pedido={pedido} 
            user={currentUser} 
            onUpdate={onUpdate}
          />
        )}
      </CardContent>
    </Card>
  );
};

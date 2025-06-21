
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { useComments } from '@/hooks/useComments';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CommentsListProps {
  userId: string;
}

export const CommentsList = ({ userId }: CommentsListProps) => {
  const { comments, loading } = useComments(userId);

  if (loading) {
    return <div className="text-center py-4">Carregando comentários...</div>;
  }

  if (comments.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma avaliação ainda</p>
        <p className="text-sm">Seja o primeiro a avaliar!</p>
      </div>
    );
  }

  const averageRating = comments.reduce((sum, comment) => sum + comment.nota, 0) / comments.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-500">
            {averageRating.toFixed(1)}
          </div>
          <StarRating rating={Math.round(averageRating)} readonly size="sm" />
          <p className="text-xs text-gray-600 mt-1">
            {comments.length} avaliação{comments.length !== 1 ? 'ões' : ''}
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {comments.map((comment) => (
          <Card key={comment.id}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={comment.avaliador?.foto_url} />
                  <AvatarFallback>
                    {comment.avaliador?.nome?.charAt(0) || '?'}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">
                      {comment.avaliador?.nome || 'Usuário'}
                    </span>
                    <StarRating rating={comment.nota} readonly size="sm" />
                  </div>
                  
                  <p className="text-gray-700 text-sm mb-2">
                    {comment.comentario}
                  </p>
                  
                  <p className="text-xs text-gray-500">
                    {formatDistanceToNow(new Date(comment.criado_em), {
                      addSuffix: true,
                      locale: ptBR
                    })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

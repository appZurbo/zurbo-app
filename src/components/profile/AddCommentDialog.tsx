
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { StarRating } from '@/components/ui/star-rating';
import { MessageSquare } from 'lucide-react';
import { useComments } from '@/hooks/useComments';

interface AddCommentDialogProps {
  userId: string;
  userName: string;
}

export const AddCommentDialog = ({ userId, userName }: AddCommentDialogProps) => {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const { addComment, submitting } = useComments();

  const handleSubmit = async () => {
    if (!comment.trim() || rating === 0) return;

    const success = await addComment(userId, comment.trim(), rating);
    if (success) {
      setOpen(false);
      setComment('');
      setRating(0);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquare className="h-4 w-4 mr-2" />
          Avaliar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Avaliar {userName}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Sua avaliação</Label>
            <div className="mt-2">
              <StarRating 
                rating={rating} 
                onRatingChange={setRating}
                size="lg"
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment">Comentário</Label>
            <Textarea
              id="comment"
              placeholder="Compartilhe sua experiência..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
              className="mt-1"
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/500 caracteres
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!comment.trim() || rating === 0 || submitting}
            >
              {submitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

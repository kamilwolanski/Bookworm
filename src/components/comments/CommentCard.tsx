import { ActionResult } from '@/types/actions';
import { startTransition, useActionState, useEffect } from 'react';
import { AddRatingAction } from '@/app/(main)/books/actions/commentActions';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  MoreVertical,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { pl } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommentDto } from '@/lib/userbooks';
import CommentInput from './CommentInput';

function CommentCard({
  comment,
  isReply = false,
  onReplyClick,
  showReplyInput = false,
}: {
  comment: CommentDto;
  isReply?: boolean;
  onReplyClick?: () => void;
  showReplyInput?: boolean;
}) {
  const [state, addRating] = useActionState<
    ActionResult,
    { commentId: string; bookId: string; value: number }
  >(AddRatingAction, { isError: false });

  const handleRating = (value: 1 | -1) => {
    const newValue = comment.userRating === value ? null : value;

    startTransition(() => {
      addRating({
        commentId: comment.id,
        bookId: comment.bookId,
        value: newValue ?? 0,
      });
    });
  };

  useEffect(() => {
    if (state?.isError) {
      console.warn(state.message);
    }
  }, [state]);

  return (
    <div className="mb-0">
      <CardContent className="p-4 flex gap-4">
        <Avatar>
          {comment.author.avatarUrl ? (
            <AvatarImage src={comment.author.avatarUrl} />
          ) : (
            <AvatarFallback>
              {comment.author.name?.[0] ?? comment.author.email[0]}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div className="text-sm">
              <p className="font-medium text-white">
                {comment.author.name || comment.author.email}
              </p>
              <span className="text-muted-foreground text-xs">
                {formatDistanceToNow(new Date(comment.addedAt), {
                  addSuffix: true,
                  locale: pl,
                })}
              </span>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6 p-0">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Report</DropdownMenuItem>
                <DropdownMenuItem>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <p className="mt-2 text-sm">{comment.content}</p>

          <div className="mt-3 flex gap-2 text-muted-foreground text-sm items-center">
            <button
              className="flex items-center gap-1 cursor-pointer hover:bg-[#30313E] rounded px-2 py-1 transition hover:text-white hover:fiil-white"
              onClick={() => handleRating(1)}
            >
              <ThumbsUp
                className={`w-4 h-4 ${
                  comment.userRating === 1 ? 'text-white fill-white' : ''
                }`}
              />
            </button>
            <span>{comment.totalScore ?? 0}</span>
            <button
              className="flex items-center gap-1 cursor-pointer hover:bg-[#30313E] rounded px-2 py-1 transition hover:text-white hover:fiil-white"
              onClick={() => handleRating(-1)}
            >
              <ThumbsDown
                className={`w-4 h-4 ${
                  comment.userRating === -1 ? 'text-white fill-white' : ''
                }`}
              />
            </button>

            {!isReply && (
              <button
                className="flex items-center gap-1 cursor-pointer hover:text-white hover:bg-[#30313E] rounded px-2 py-1 transition ms-5"
                onClick={onReplyClick}
              >
                <MessageSquare className="w-4 h-4" />
                Odpowiedz
              </button>
            )}
          </div>
          {showReplyInput && (
            <div className="mt-3">
              <CommentInput
                bookId={comment.bookId}
                parentId={comment.id}
                onSuccess={() => onReplyClick?.()}
              />
            </div>
          )}
        </div>
      </CardContent>
    </div>
  );
}

export default CommentCard;

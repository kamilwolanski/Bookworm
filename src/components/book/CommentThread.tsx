'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
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
import { User } from '@prisma/client';
import { ActionResult } from '@/types/actions';
import { startTransition, useActionState, useEffect } from 'react';
import { AddRatingAction } from '@/app/(dashboard)/books/actions';
import { CommentDto } from '@/lib/books';

type Props = {
  comments: (CommentDto & { author: User })[];
};

export default function CommentThread({ comments }: Props) {
  console.log('cooment', comments);
  return (
    <div>
      <div className="flex items-center">
        <h3 className="text-lg font-semibold">Komentarze</h3>
        <span className="bg-[#30313E] w-8 h-6 inline-flex items-center justify-center rounded-md ms-3 text-xs font-semibold">
          {comments.length}
        </span>
      </div>

      {comments.map((comment) => (
        <div key={comment.id} className="space-y-4">
          <CommentCard comment={comment} />

          {comment.replies && comment.replies.length > 0 && (
            <div className="ml-8 space-y-4 border-l border-muted pl-4">
              {comment.replies.map((reply) => (
                <CommentCard key={reply.id} comment={reply} isReply />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CommentCard({
  comment,
  isReply = false,
}: {
  comment: CommentDto & { author: User };
  isReply?: boolean;
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
    <div>
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
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 p-0"
                  // onClick={toggleAddRating}
                >
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

            <button className="flex items-center gap-1 cursor-pointer hover:text-white hover:bg-[#30313E] rounded px-2 py-1 transition ms-5 ">
              <MessageSquare className="w-4 h-4" />
              Odpowiedz
            </button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}

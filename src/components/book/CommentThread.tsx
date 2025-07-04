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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Comment = {
  id: string;
  content: string;
  addedAt: string;
  author: {
    name: string | null;
    email: string;
    imageUrl?: string;
  };
  replies?: Comment[];
  likes?: number;
  dislikes?: number;
};

type Props = {
  comments: Comment[];
};

export default function CommentThread({ comments }: Props) {
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
  comment: Comment;
  isReply?: boolean;
}) {
  return (
    <div>
      <CardContent className="p-4 flex gap-4">
        <Avatar>
          {comment.author.imageUrl ? (
            <AvatarImage src={comment.author.imageUrl} />
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

          <div className="mt-3 flex gap-4 text-muted-foreground text-sm">
            <button className="flex items-center gap-1 hover:text-foreground transition">
              <ThumbsUp className="w-4 h-4" />
              {comment.likes ?? 0}
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition">
              <ThumbsDown className="w-4 h-4" />
              {comment.dislikes ?? 0}
            </button>
            <button className="flex items-center gap-1 hover:text-foreground transition">
              <MessageSquare className="w-4 h-4" />
              Reply
            </button>
          </div>
        </div>
      </CardContent>
    </div>
  );
}

'use client';

import { User } from '@prisma/client';

import { CommentDto } from '@/lib/books';
import CommentCard from './CommentCard';
import { useState } from 'react';

type Props = {
  comments: (CommentDto & { author: User })[];
};

export default function CommentThread({ comments }: Props) {
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);
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
          {!comment.parentId && (
            <CommentCard
              comment={comment}
              onReplyClick={() =>
                setActiveReplyId((prev) =>
                  prev === comment.id ? null : comment.id
                )
              }
              showReplyInput={activeReplyId === comment.id}
            />
          )}

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

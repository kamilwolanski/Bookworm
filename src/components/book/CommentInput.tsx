/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { AddCommentAction } from '@/app/(dashboard)/books/actions';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { commentSchema } from '@/lib/commentValidation';
import { ActionResult } from '@/types/actions';
import { startTransition, useActionState, useEffect, useState } from 'react';

type Props = {
  bookId: string;
  parentId?: string;
  onSuccess?: () => void;
};

export default function CommentInput({ bookId, parentId, onSuccess }: Props) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [serverFieldError, setServerFieldError] = useState<string | null>(null);
  const [state, addComment, isPending] = useActionState<
    ActionResult,
    { content: string; bookId: string; parentId?: string }
  >(AddCommentAction, { isError: false });

  const validate = (value: string) => {
    const result = commentSchema.safeParse({ content: value });
    if (!result.success) {
      setError(result.error.errors[0]?.message ?? 'Nieprawidłowy komentarz');
    } else {
      setError(null);
    }
  };

  useEffect(() => {
    if (state?.isError) {
      console.log('result.fieldErrors', state.fieldErrors);
      if (state.fieldErrors) {
        const contentErrorMessage = state.fieldErrors.find(
          (error) => error.field === 'content'
        )?.message;

        setServerFieldError(contentErrorMessage ?? null);
      }

      console.warn(state.message);
    } else {
      // Jeśli wszystko OK – np. czyścimy input
      setContent('');
      setServerFieldError(null);

      if (onSuccess) onSuccess();
    }
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);
    if (!content.trim()) {
      validate(value);
    }
  };

  const handleSubmit = async () => {
    startTransition(() => {
      addComment({ bookId: bookId, content, parentId });
    });
  };

  return (
    <div className="space-y-3">
      <Textarea
        placeholder="Dodaj komentarz..."
        className="resize-none min-h-[80px]"
        value={content}
        onChange={handleChange}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      {serverFieldError && (
        <p className="text-sm text-red-500">{serverFieldError}</p>
      )}

      <div className="flex items-center justify-end">
        <Button
          disabled={isPending || !content.trim() || Boolean(error)}
          onClick={handleSubmit}
          className="bg-orange-500 hover:bg-orange-600 text-white rounded-full cursor-pointer"
        >
          {isPending ? 'Zapisuje...' : 'Odpowiedz'}
        </Button>
      </div>
    </div>
  );
}

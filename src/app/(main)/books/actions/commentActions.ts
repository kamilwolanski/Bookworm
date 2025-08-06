'use server';

import { serverErrorResponse, unauthorizedResponse } from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { Action } from '@/types/actions';

import { addComment, addOrUpdateRating } from '@/lib/userbooks';

import { commentSchema } from '@/lib/commentValidation';

export const AddCommentAction: Action<
  [
    unknown,
    {
      bookId: string;
      content: string;
      parentId?: string;
    },
  ]
> = async (_, { bookId, content, parentId }) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    return unauthorizedResponse();
  }

  const result = commentSchema.safeParse({
    content,
  });

  if (!result.success) {
    return {
      isError: true,
      status: 'validation_error',
      httpStatus: 422,
      fieldErrors: result.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  try {
    await addComment({
      bookId,
      content,
      authorId: session.user.id,
      parentId,
    });
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }

  revalidatePath(`/books/${bookId}`);

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Komentarz został dodany',
  };
};

export const AddRatingAction: Action<
  [
    unknown,
    {
      bookId: string;
      commentId: string;
      value: number;
    },
  ]
> = async (_, { bookId, commentId, value }) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    return unauthorizedResponse();
  }

  try {
    await addOrUpdateRating({
      commentId,
      userId: session.user.id,
      value,
    });
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }

  revalidatePath(`/books/${bookId}`);

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Ocena została zapisana',
  };
};

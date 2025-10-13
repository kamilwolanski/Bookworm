'use server';

import { serverErrorResponse, unauthorizedResponse } from '@/lib/responses';
import { deleteReview } from '@/lib/reviews';
import { getUserSession } from '@/lib/session';
import { ActionResult } from '@/types/actions';
import { revalidateTag } from 'next/cache';

type Payload = {
  reviewId: string;
  bookSlug: string;
  bookId: string;
};

export const deleteReviewAction = async (
  _state: ActionResult,
  { reviewId, bookSlug, bookId }: Payload
): Promise<ActionResult<void>> => {
  const session = await getUserSession();
  if (!session?.user?.id) return unauthorizedResponse();

  try {
    const result = await deleteReview(session.user.id, {
      reviewId,
      bookId,
    });

    revalidateTag(`reviews:${bookSlug}`);

    return {
      isError: false,
      status: 'success',
      httpStatus: 200,
      data: result,
    };
  } catch (err) {
    console.error(err);
    return serverErrorResponse();
  }
};

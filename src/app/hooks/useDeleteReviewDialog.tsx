import { UserEditionData } from '@/lib/user';
import { ActionResult } from '@/types/actions';
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useActionState,
  useEffect,
  useState,
} from 'react';
import {
  deleteReviewAction,
  DeleteReviewActionPayload,
} from '@/app/(main)/books/actions/reviewActions';
import { useSWRConfig } from 'swr';
import { getReviewsKey } from './books/reviews/useReviews';
import { useSearchParams } from 'next/navigation';

function allDefined<T>(obj: Partial<T>): obj is T {
  return Object.values(obj).every((v) => v !== undefined);
}

export function useDeleteReviewDialog(
  actionParameters: Omit<DeleteReviewActionPayload, 'reviewId'>,
  editionId: string,
  bookSlug: string
): [
  isPending: boolean,
  handleDelete: () => void,
  deleteReviewId: string | null,
  setDeleteReviewId: Dispatch<SetStateAction<string | null>>,
] {
  const { mutate: globalMutate } = useSWRConfig();

  const [deleteReviewId, setDeleteReviewId] = useState<string | null>(null);
  const swrKey = `/api/user/editions/${editionId}`;
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const [state, doAction, isPending] = useActionState<
    ActionResult<void>,
    DeleteReviewActionPayload
  >(deleteReviewAction, {
    isError: false,
  });

  function handleDelete() {
    const params = actionParameters;
    if (!allDefined(params)) {
      console.error('Missing parameters', params);
      return;
    }

    if (deleteReviewId) {
      startTransition(() => {
        doAction({ ...params, reviewId: deleteReviewId });
      });
    }
  }

  useEffect(() => {
    if (!swrKey) return;
    if (!isPending && state && state.status === 'success') {
      setDeleteReviewId(null);
      globalMutate(getReviewsKey(bookSlug, page));
      globalMutate<UserEditionData | null>(swrKey);
    }
  }, [state.status, state, isPending, swrKey, bookSlug, globalMutate, page]);

  return [isPending, handleDelete, deleteReviewId, setDeleteReviewId];
}

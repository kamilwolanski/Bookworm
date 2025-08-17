import { ReactNode, useActionState, useEffect } from 'react';
import { ActionResult } from '@/types/actions';
import { rateBookAction } from '@/app/(main)/books/actions/bookActions';
import { RateData, RatePayload } from '@/lib/books';
import { useRouter, usePathname } from 'next/navigation';
import RatingDialogContent from './RatingDialogContent';

const RateBookBtn = ({
  bookId,
  rating,
  revalidatePath,
  onSuccess,
}: {
  bookId: string;
  rating: number;
  dialogTitle: string | ReactNode;
  revalidatePath: string;
  onSuccess?: () => void;
}) => {
  const [state, doAction, isPending] = useActionState<
    ActionResult<RateData>,
    RatePayload
  >(rateBookAction, { isError: false });

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (state.status === 'success' && !state.isError) {
      onSuccess?.();
      setTimeout(() => {
        router.refresh();
        if (pathname !== revalidatePath) router.push(revalidatePath);
      }, 100);
    }
  }, [state, router, pathname, revalidatePath, onSuccess]);

  return (
    <RatingDialogContent
      bookId={bookId}
      initialRating={rating}
      isPending={isPending}
      onSave={(id, value) => doAction({ bookId: id, rating: value })}
    />
  );
};

export default RateBookBtn;

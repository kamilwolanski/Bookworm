import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useActionForm } from '@/app/hooks/useActionForm';
import ReviewEditionComponent from '@/components/book/ratebook/ReviewEditionComponent';
import { FormProvider } from 'react-hook-form';
import {
  AddEditionReviewInput,
  addEditionReviewSchema,
} from '@/lib/validations/addBookToShelfValidation';
import { usePathname, useSearchParams } from 'next/navigation';
import { useSWRConfig } from 'swr';
import { rateBookAction } from '@/app/(main)/books/actions/reviewActions';
import { getReviewsKey } from '@/app/hooks/books/reviews/useReviews';
import { useAsyncActionForm } from '@/app/hooks/useActionFormSimple';

const RateBookForm = ({
  bookId,
  bookSlug,
  editionId,
  userReview,
  afterSuccess,
}: {
  bookId: string;
  bookSlug: string;
  editionId: string;
  userReview?: {
    editionId: string;
    rating: number | null;
    body: string | null;
  };
  afterSuccess: () => void;
}) => {
  const pathname = usePathname();
  const { mutate: globalMutate } = useSWRConfig();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const boundAction = rateBookAction.bind(null, bookId, pathname);
  // const { form, isPending, handleSubmit } =
  //   useActionForm<AddEditionReviewInput>({
  //     action: boundAction,
  //     schema: addEditionReviewSchema,
  //     defaultValues: {
  //       editionId: editionId,
  //       rating: userReview?.rating ?? undefined,
  //       body: userReview?.body ?? undefined,
  //     },
  //     onSuccess: () => {
  //       afterSuccess();
  //       globalMutate(getReviewsKey(bookSlug, page));
  //       globalMutate(`/api/user/editions/${editionId}`);
  //     },
  //   });

  const { form, submit, isPending } = useAsyncActionForm({
    action: (formData) => rateBookAction(bookId, pathname, undefined, formData),
    schema: addEditionReviewSchema,
    defaultValues: {
      editionId: editionId,
      rating: userReview?.rating ?? undefined,
      body: userReview?.body ?? undefined,
    },
  });

  const onSubmit = async (data: {
    editionId: string;
    rating: number | undefined;
    body: string | undefined;
  }) => {
    const result = await submit(data);
    if (result.status === 'success') {
      afterSuccess();
      globalMutate(getReviewsKey(bookSlug, page));
      globalMutate(`/api/user/editions/${editionId}`);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 sm:p-6 rounded-lg"
      >
        <nav aria-label="Add book Steps" className="group my-4"></nav>
        <div className={`space-y-10`}>
          <FormProvider {...form}>
            <ReviewEditionComponent />
          </FormProvider>
          <div className="flex justify-end gap-4">
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? 'Zapisywanie' : 'Zapisz'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RateBookForm;

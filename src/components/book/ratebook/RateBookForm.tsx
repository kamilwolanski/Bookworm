import React from 'react';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useActionForm } from '@/app/hooks/useActionForm';
import ReviewEditionComponent from '@/components/book/ratebook/ReviewEditionComponent';
import { rateBookAction } from '@/app/(main)/books/actions/bookActions';
import { FormProvider } from 'react-hook-form';
import {
  AddEditionReviewInput,
  addEditionReviewSchema,
} from '@/lib/validations/addBookToShelfValidation';

const RateBookForm = ({
  bookId,
  editionId,
  userReview,
  afterSuccess,
}: {
  bookId: string;
  editionId: string;
  userReview?: {
    editionId: string;
    rating: number | null;
    body: string | null;
  };
  afterSuccess: () => void;
}) => {
  const boundAction = rateBookAction.bind(null, bookId);
  const { form, isPending, handleSubmit } =
    useActionForm<AddEditionReviewInput>({
      action: boundAction,
      schema: addEditionReviewSchema,
      defaultValues: {
        editionId: editionId,
        rating: userReview?.rating ?? undefined,
        body: userReview?.body ?? undefined,
      },
      onSuccess: afterSuccess,
    });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6 sm:p-6 rounded-lg">
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
              Zapisz
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default RateBookForm;

import React, { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { defineStepper } from '@/components/ui/Stepper';
import { Form } from '@/components/ui/form';
import { useActionForm } from '@/app/hooks/useActionForm';
import { Separator } from '@/components/ui/separator';
import ChooseEditonRadioComponent from '@/components/book/addBookStepper/ChooseEditonRadioComponent';
import ChooseEditonComponent from '@/components/book/addBookStepper/ChooseEditionComponent';
import ReviewEditionComponent from '@/components/book/ratebook/ReviewEditionComponent';
import { EditionDto, UserBookReview, UserEditionDto } from '@/lib/userbooks';
import { addBookToShelfAction } from '@/app/(main)/books/actions/bookActions';
import {
  AddBookToShelfInput,
  chooseEditionSchema,
  addBookToShelfSchema,
} from '@/lib/validations/addBookToShelfValidation';
import ReadingStatusComponent from './ReadingStatusComponent';
import { FormProvider } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import useSWR from 'swr';
import { fetcher } from '@/app/services/fetcher';

const { useStepper, steps, utils } = defineStepper(
  { id: 'edition', label: 'Wydanie', schema: chooseEditionSchema },
  {
    id: 'statusReview',
    label: 'Opinia',
    schema: addBookToShelfSchema,
  }
);

const AddBookForm = ({
  bookId,
  bookSlug,
  editions,
  userEditions,
  otherEditionsMode,
  afterSuccess,
}: {
  bookId: string;
  bookSlug: string;
  editions: EditionDto[];
  userEditions?: UserEditionDto[];
  otherEditionsMode: boolean;
  afterSuccess: () => void;
}) => {
  const { data: userReviews } = useSWR<UserBookReview[]>(
    `/api/reviews/${bookId}`,
    fetcher,
    {
      revalidateIfStale: false,
    }
  );

  const boundAction = addBookToShelfAction.bind(null, bookId);
  const router = useRouter();
  const stepper = useStepper();
  const { status } = useSession();
  const { form, isPending, handleSubmit } = useActionForm<AddBookToShelfInput>({
    action: boundAction,
    schema: stepper.current.schema,
    defaultValues: {
      editionId: otherEditionsMode ? '' : editions[0].id,
      readingStatus: 'WANT_TO_READ',
      rating: undefined,
    },
    onSuccess: () => {
      router.refresh();
      afterSuccess();
    },
  });
  const isDisabled = !form.watch('editionId');
  const currentIndex = utils.getIndex(stepper.current.id);
  const isLast = stepper.isLast;
  const onlyOption = editions.length === 1;

  useEffect(() => {
    if (onlyOption && !otherEditionsMode) {
      stepper.goTo('statusReview');
    }
  }, [onlyOption, otherEditionsMode, stepper]);

  const editionIdWatch = form.watch('editionId');
  const choosenReview = userReviews?.find(
    (ur) => ur.editionId === editionIdWatch
  );

  useEffect(() => {
    form.setValue('rating', choosenReview?.rating ?? undefined);
    form.setValue('body', choosenReview?.body ?? undefined);
  }, [choosenReview, editionIdWatch, form]);

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6 sm:p-6 rounded-lg">
        <nav aria-label="Add book Steps" className="group my-4">
          <ol
            role="tablist"
            className="flex items-center justify-between gap-1 sm:gap-2"
            aria-orientation="horizontal"
          >
            {!otherEditionsMode &&
              stepper.all.map((step, index, array) => (
                <React.Fragment key={step.id}>
                  <li className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
                    <Button
                      type="button"
                      role="tab"
                      variant={index <= currentIndex ? 'default' : 'secondary'}
                      aria-current={
                        stepper.current.id === step.id ? 'step' : undefined
                      }
                      aria-posinset={index + 1}
                      aria-setsize={steps.length}
                      aria-selected={stepper.current.id === step.id}
                      className="flex size-10 items-center justify-center rounded-full cursor-pointer"
                      onClick={async () => {
                        const valid = await form.trigger();
                        if (!valid) return;
                        //can't skip steps forwards but can go back anywhere if validated
                        if (index - currentIndex > 1) return;
                        stepper.goTo(step.id);
                      }}
                    >
                      {index + 1}
                    </Button>
                    <span className="text-sm font-medium">{step.label}</span>
                  </li>
                  {index < array.length - 1 && (
                    <Separator
                      className={`flex-1 ${
                        index < currentIndex ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
          </ol>
        </nav>
        <div className={`space-y-10 ${!otherEditionsMode ? 'pt-5' : ''}`}>
          {stepper.switch({
            edition: () => (
              <FormProvider {...form}>
                {!otherEditionsMode ? (
                  <ChooseEditonRadioComponent
                    editions={editions}
                    userEditions={userEditions}
                  />
                ) : (
                  <ChooseEditonComponent
                    editions={editions}
                    bookSlug={bookSlug}
                    userEditions={userEditions}
                    goNext={stepper.next}
                  />
                )}
              </FormProvider>
            ),
            statusReview: () => (
              <FormProvider {...form}>
                <ReadingStatusComponent />
                <div className="mt-10" />
                <ReviewEditionComponent />
              </FormProvider>
            ),
          })}
          {status === 'authenticated' && (
            <div className="flex justify-end gap-4">
              {!onlyOption && (
                <Button
                  variant="secondary"
                  onClick={stepper.prev}
                  disabled={stepper.isFirst}
                  className="cursor-pointer"
                >
                  Wstecz
                </Button>
              )}

              {isLast ? (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  className="cursor-pointer"
                  disabled={isPending}
                >
                  {isPending ? 'Dodawanie...' : 'Dodaj'}
                </Button>
              ) : (
                <Button
                  type="button"
                  disabled={isDisabled}
                  className="cursor-pointer"
                  onClick={async () => {
                    if (isLast) return;
                    const valid = await form.trigger();
                    if (!valid) return;
                    stepper.next();
                  }}
                >
                  Dalej
                </Button>
              )}
            </div>
          )}
        </div>
      </form>
    </Form>
  );
};

export default AddBookForm;

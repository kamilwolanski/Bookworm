import React from 'react';
import { Button } from '@/components/ui/button';
import { defineStepper } from '@/components/ui/Stepper';
import { Form } from '@/components/ui/form';
import { useActionForm } from '@/app/hooks/useActionForm';
import { Separator } from '@/components/ui/separator';
import ChooseEditonRadioComponent from '@/components/book/addBookStepper/ChooseEditonRadioComponent';
import ChooseEditonComponent from '@/components/book/addBookStepper/ChooseEditionComponent';
import ReviewEditionComponent from '@/components/book/addBookStepper/ReviewEditionComponent';
import { EditionDto, UserEditionDto } from '@/lib/userbooks';
import { addBookToShelfAction } from '@/app/(main)/books/actions/bookActions';
import {
  AddBookToShelfInput,
  chooseEditionSchema,
  addBookToShelfSchema,
} from '@/lib/validations/addBookToShelfValidation';

const { useStepper, steps, utils } = defineStepper(
  { id: 'edition', label: 'Wybór wydania', schema: chooseEditionSchema },
  {
    id: 'statusReview',
    label: 'Status i recenzja',
    schema: addBookToShelfSchema,
  }
);

const AddBookForm = ({
  bookId,
  editions,
  userEditions = [],
  otherEditionsMode,
  afterSuccess,
}: {
  bookId: string;
  editions: EditionDto[];
  userEditions?: UserEditionDto[];
  otherEditionsMode: boolean;
  afterSuccess: () => void;
}) => {
  const boundAction = addBookToShelfAction.bind(null, bookId);
  const stepper = useStepper();
  const { form, isPending, handleSubmit } = useActionForm<AddBookToShelfInput>({
    action: boundAction,
    schema: stepper.current.schema,
    defaultValues: {
      editionId: '',
      readingStatus: 'WANT_TO_READ',
      rating: undefined,
    },
    onSuccess: afterSuccess,
  });
  const isDisabled = !form.watch('editionId');
  const currentIndex = utils.getIndex(stepper.current.id);
  const isLast = stepper.isLast;

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-6 p-6 rounded-lg">
        <nav aria-label="Add book Steps" className="group my-4">
          <ol
            role="tablist"
            className="flex items-center justify-between gap-2"
            aria-orientation="horizontal"
          >
            {!otherEditionsMode &&
              stepper.all.map((step, index, array) => (
                <React.Fragment key={step.id}>
                  <li className="flex items-center gap-4 flex-shrink-0">
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
            edition: () =>
              !otherEditionsMode ? (
                <ChooseEditonRadioComponent
                  form={form}
                  editions={editions}
                  userEditions={userEditions}
                />
              ) : (
                <ChooseEditonComponent
                  form={form}
                  editions={editions}
                  userEditions={userEditions}
                  goNext={stepper.next}
                />
              ),
            statusReview: () => <ReviewEditionComponent form={form} />,
          })}
          <div className="flex justify-end gap-4">
            <Button
              variant="secondary"
              onClick={stepper.prev}
              disabled={stepper.isFirst}
              className="cursor-pointer"
            >
              Wstecz
            </Button>

            {isLast ? (
              <Button
                type="button"
                onClick={handleSubmit}
                className="cursor-pointer"
                disabled={isPending}
              >
                Zapisz
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
        </div>
      </form>
    </Form>
  );
};

export default AddBookForm;

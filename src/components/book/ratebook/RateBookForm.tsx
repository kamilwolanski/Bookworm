import { rateBookAction } from '@/app/(main)/books/actions/bookActions';
import { useActionForm } from '@/app/hooks/useActionForm';
import { AddReviewInput, addReviewSchema } from '@/lib/rateBookValidation';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const RateBookForm = ({
  bookId,
  editionId,
  initialRating,
  initialBody,
  onSuccess,
}: {
  bookId: string;
  editionId: string;
  initialRating: number;
  initialBody?: string;
  onSuccess?: () => void;
}) => {
  const [hover, setHover] = useState<number>(0);

  const boundAction = rateBookAction.bind(null, bookId, editionId);

  const { form, isPending, handleSubmit } = useActionForm<AddReviewInput>({
    action: boundAction,
    schema: addReviewSchema,
    defaultValues: {
      rating: initialRating,
      body: initialBody,
    },
    onSuccess: onSuccess,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        // className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto"
      >
        <div className="flex flex-col items-center gap-3 py-4">
          <div
            className="flex gap-2"
            role="radiogroup"
            aria-label="Ocena w gwiazdkach"
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={form.getValues('rating') === value}
                aria-label={`${value} ${value === 1 ? 'gwiazdka' : 'gwiazdki'}`}
                onClick={() => form.setValue('rating', value)}
                onMouseEnter={() => setHover(value)}
                onMouseLeave={() => setHover(0)}
                className="
            rounded-full outline-none

            transition-transform duration-150 hover:scale-110 active:scale-95 cursor-pointer
          "
              >
                <Star
                  className={cn(
                    'h-9 w-9 transition-colors drop-shadow-sm',
                    (hover || form.getValues('rating')) >= value
                      ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]'
                      : 'text-muted-foreground'
                  )}
                />
              </button>
            ))}
          </div>

          <div className="text-xs h-5 flex items-center gap-2 text-dialog-foreground">
            <span>
              {(hover || form.getValues('rating')) === 0
                ? 'Wybierz ocenę'
                : {
                    1: 'Słaba',
                    2: 'Może być',
                    3: 'Średnia',
                    4: 'Bardzo dobra',
                    5: 'Wybitna',
                  }[hover || form.getValues('rating')]}
            </span>
            <span className="opacity-60">•</span>
            <span className="tabular-nums">
              {hover || form.getValues('rating') || 0}/5
            </span>
          </div>
        </div>
        <div className="col-span-2">
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel>Twoja opinia</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Wpisz treść opinii o ksiażce"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="h-px bg-border mt-5" /> {/* Separator */}
        <div className="col-span-1 col-start-2 mt-5">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Anuluj
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? 'Dodaję...' : 'Dodaj'}
            </Button>
          </DialogFooter>

          {form.formState.errors.root && (
            <p className="text-red-600 text-sm">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default RateBookForm;

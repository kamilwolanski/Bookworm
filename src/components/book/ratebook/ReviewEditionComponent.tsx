import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';

import { AddReviewInput } from '@/lib/validations/addBookToShelfValidation';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const ReviewEditionComponent = () => {
  const form = useFormContext<AddReviewInput>();
  const [hover, setHover] = useState<number>(0);

  const rating = form.watch('rating') ?? 0;

  return (
    <>
      <h2 className="text-dialog-foreground font-semibold">Twoja ocena</h2>
      <div className="flex flex-col items-center gap-3">
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
              aria-checked={rating === value}
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
                  (hover || rating) >= value
                    ? 'fill-amber-400 text-amber-400'
                    : 'text-muted-foreground'
                )}
              />
            </button>
          ))}
        </div>

        <div className="text-xs h-5 flex items-center gap-2 text-dialog-foreground">
          <span>
            {(hover || rating) === 0
              ? 'Wybierz ocenę'
              : {
                  1: 'Słaba',
                  2: 'Może być',
                  3: 'Średnia',
                  4: 'Bardzo dobra',
                  5: 'Wybitna',
                }[hover || rating]}
          </span>
          <span className="opacity-60">•</span>
          <span className="tabular-nums">{hover || rating || 0}/5</span>
        </div>
      </div>
      <div className="col-span-2">
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-dialog-foreground text-md font-semibold">
                Opinia
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Wpisz treść opinii o ksiażce"
                  className="resize-none text-dialog-foreground bg-white/50 min-h-30"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
};

export default ReviewEditionComponent;

import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

import { AddBookToShelfInput } from '@/lib/validations/addBookToShelfValidation';
import {
  BookmarkPlus,
  BookOpen,
  CheckCircle,
  LucideIcon,
  Star,
  XCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const ReviewEditionComponent = ({
  form,
}: {
  form: UseFormReturn<AddBookToShelfInput>;
}) => {
  const [hover, setHover] = useState<number>(0);
  const readingStatuses: {
    value: 'WANT_TO_READ' | 'READING' | 'READ' | 'ABANDONED';
    label: string;
    color: string;
    icon: LucideIcon;
  }[] = [
    {
      value: 'WANT_TO_READ',
      label: 'Chcę przeczytać',
      color: 'text-blue-500',
      icon: BookmarkPlus,
    },
    {
      value: 'READING',
      label: 'Czytam',
      color: 'text-yellow-500',
      icon: BookOpen,
    },
    {
      value: 'READ',
      label: 'Przeczytane',
      color: 'text-green-500',
      icon: CheckCircle,
    },
    {
      value: 'ABANDONED',
      label: 'Porzucona',
      color: 'text-red-500',
      icon: XCircle,
    },
  ] as const;
  const rating = form.getValues('rating') ?? 0;

  return (
    <>
      <FormField
        control={form.control}
        name="readingStatus"
        render={({ field }) => (
          <FormItem>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex"
            >
              {readingStatuses.map((rStatus) => {
                const { value, icon: Icon, label, color } = rStatus;
                console.log('field', field.value);
                const radioId = `readingStatus-${value}`;
                const isSelected = field.value === value;
                return (
                  <Label
                    key={radioId}
                    htmlFor={radioId}
                    className={`flex flex-col flex-1 border rounded-md p-3 cursor-pointer ${isSelected ? 'border-primary bg-primary/20' : 'border-muted bg-white/50'}`}
                  >
                    <RadioGroupItem
                      id={radioId}
                      value={value}
                      className="hidden"
                      type="button"
                    />
                    <Icon size={25} className={color} />
                    <span className="text-center mt-5 text-dialog-foreground">
                      {label}
                    </span>
                  </Label>
                );
              })}
            </RadioGroup>
          </FormItem>
        )}
      />
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
                  'h-9 w-9 transition-colors drop-shadow-sm ',
                  (hover || rating) >= value
                    ? 'fill-amber-400 text-amber-400 '
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

import { useState, startTransition } from 'react';
import { Star } from 'lucide-react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function RatingDialogContent({
  bookId,
  initialRating = 0,
  isPending = false,
  onSave,
}: {
  dialogTitle?: string;
  bookId: string;
  initialRating?: number;
  isPending?: boolean;
  onSave?: (bookId: string, rating: number) => void | Promise<void>;
}) {
  const [rating, setRating] = useState<number>(initialRating);
  const [hover, setHover] = useState<number>(0);

  async function handleSave() {
    if (!rating) return;
    const action = () => {
      if (onSave) {
        onSave(bookId, rating);
      }
    };

    startTransition(action);
  }

  return (
    <DialogContent
      className="
    sm:max-w-md p-6 rounded-2xl
    border border-border
    shadow-2xl
    bg-background/95 backdrop-blur
    supports-[backdrop-filter]:bg-background/80 
  "
    >
      <DialogHeader className="space-y-1">
        <DialogTitle className="text-xl font-semibold tracking-tight">
          Oceń książkę
        </DialogTitle>
        <DialogDescription className="text-sm text-muted-foreground">
          Jak bardzo spodobała Ci się ta książka?
        </DialogDescription>
      </DialogHeader>
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
              aria-checked={rating === value}
              aria-label={`${value} ${value === 1 ? 'gwiazdka' : 'gwiazdki'}`}
              onClick={() => setRating(value)}
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
                    ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_4px_rgba(251,191,36,0.5)]'
                    : 'text-muted-foreground'
                )}
              />
            </button>
          ))}
        </div>

        <div className="text-xs text-muted-foreground h-5 flex items-center gap-2">
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
      <div className="h-px bg-border" /> {/* Separator */}
      <DialogFooter className="pt-4 gap-2 sm:gap-3">
        <DialogClose asChild>
          <Button variant="ghost" className="w-full sm:w-auto cursor-pointer">
            Anuluj
          </Button>
        </DialogClose>

        <Button
          type="button"
          disabled={isPending || !rating}
          onClick={handleSave}
          className="w-full sm:w-auto cursor-pointer"
        >
          {isPending ? 'Zapisywanie…' : 'Zapisz ocenę'}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
}

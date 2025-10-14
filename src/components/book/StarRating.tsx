import { Star } from 'lucide-react';
import { useOptimisticRating } from '@/lib/optimistics/useOptimisticRating';
import { addRatingAction } from '@/app/(main)/books/actions/reviewActions';

interface StarRatingProps {
  rating: number;
  bookId?: string;
  editionId?: string;
  bookSlug?: string;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export function StarRating({
  rating,
  bookId,
  editionId,
  bookSlug,
  maxRating = 5,
  size = 'md',
  interactive = false,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  } as const;

  const {
    ratingOpt,
    isPending: isRatingOpt,
    rate,
  } = useOptimisticRating(rating);

  // (opcjonalnie) obsługa klawiatury: strzałki lewo/prawo zmieniają wybór
  const onKeyDown: React.KeyboardEventHandler<HTMLDivElement> = (e) => {
    if (!interactive || isRatingOpt) return;
    if (!bookId || !editionId || !bookSlug) return;

    if (e.key === 'ArrowRight') {
      const next = Math.min(maxRating, (ratingOpt || 0) + 1);
      rate?.(next, () =>
        addRatingAction({ bookId, editionId, bookSlug, rating: next })
      );
      e.preventDefault();
    } else if (e.key === 'ArrowLeft') {
      const next = Math.max(1, (ratingOpt || 1) - 1);
      rate?.(next, () =>
        addRatingAction({ bookId, editionId, bookSlug, rating: next })
      );
      e.preventDefault();
    }
  };

  return (
    <div className="flex-col items-start gap-1 flex">
      <div
        className="flex gap-1"
        role={interactive ? 'radiogroup' : undefined}
        aria-label={
          interactive
            ? 'Oceń książkę'
            : `Ocena: ${rating.toFixed(1)} na ${maxRating}`
        }
        onKeyDown={onKeyDown}
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starNumber = index + 1;

          // wizualne wypełnienie — wspiera ułamki (np. 3.7)
          const filled = ratingOpt >= starNumber;
          const fraction =
            !filled && ratingOpt > index && ratingOpt < starNumber
              ? ratingOpt - index
              : 0;

          const widthPct = fraction > 0 ? fraction * 100 : filled ? 100 : 0;

          const isChecked = Math.round(ratingOpt || 0) === starNumber;

          return (
            <button
              key={index}
              type="button"
              role={interactive ? 'radio' : undefined}
              aria-checked={interactive ? isChecked : undefined}
              aria-label={`Oceń na ${starNumber} z ${maxRating}`}
              title={interactive ? `Oceń na ${starNumber}` : undefined}
              disabled={!interactive || isRatingOpt}
              className={[
                'relative',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded',
                interactive ? 'cursor-pointer' : '',
                !interactive || isRatingOpt
                  ? 'pointer-events-none cursor-not-allowed'
                  : '',
                isRatingOpt ? 'opacity-50' : '',
              ].join(' ')}
              onClick={() => {
                if (!interactive || !rate) return;
                if (!bookId || !editionId || !bookSlug) return;
                rate(starNumber, () =>
                  addRatingAction({
                    bookId,
                    editionId,
                    bookSlug,
                    rating: starNumber,
                  })
                );
              }}
            >
              {/* pusta gwiazdka */}
              <Star className={`${sizeClasses[size]} text-gray-300`} />

              {/* pełna gwiazdka / część gwiazdki */}
              <div
                className="absolute top-0 left-0 overflow-hidden"
                style={{ width: `${widthPct}%` }}
                aria-hidden="true"
              >
                <Star
                  className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Live region do komunikatów dla czytników ekranu */}
      <span className="sr-only" aria-live="polite">
        {isRatingOpt
          ? 'Zapisywanie oceny…'
          : `Obecna ocena: ${ratingOpt} na ${maxRating}`}
      </span>
    </div>
  );
}

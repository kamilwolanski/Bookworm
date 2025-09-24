import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // teraz może być float np. 3.7
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onRatingChange?: (rating: number) => void;
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxRating }, (_, index) => {
        const starNumber = index + 1;
        const filled = rating >= starNumber;
        const fraction =
          !filled && rating > index && rating < starNumber
            ? rating - index // np. 0.7 gdy rating=3.7
            : 0;

        return (
          <div
            key={index}
            className={`relative ${interactive ? 'cursor-pointer' : ''}`}
            onClick={() => interactive && onRatingChange?.(starNumber)}
          >
            {/* pusta gwiazdka */}
            <Star className={`${sizeClasses[size]} text-gray-300`} />

            {/* pełna gwiazdka / część gwiazdki */}
            <div
              className="absolute top-0 left-0 overflow-hidden"
              style={{
                width: `${fraction > 0 ? fraction * 100 : filled ? 100 : 0}%`,
              }}
            >
              <Star
                className={`${sizeClasses[size]} fill-yellow-400 text-yellow-400`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { Star } from "lucide-react";

interface StarRatingProps {
  rating: number;
  isPending?: boolean;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onClick?: (starNumber: number) => void;
}

export function StarRating({
  rating,
  isPending,
  maxRating = 5,
  size = "md",
  interactive = false,
  onClick,
}: StarRatingProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  } as const;

  return (
    <div className="flex-col items-start gap-1 flex">
      <div
        className="flex gap-1"
        role={interactive ? "radiogroup" : undefined}
        aria-label={
          interactive
            ? "Oceń książkę"
            : `Ocena: ${rating.toFixed(1)} na ${maxRating}`
        }
      >
        {Array.from({ length: maxRating }, (_, index) => {
          const starNumber = index + 1;

          // wizualne wypełnienie — wspiera ułamki (np. 3.7)
          const filled = rating >= starNumber;
          const fraction =
            !filled && rating > index && rating < starNumber
              ? rating - index
              : 0;

          const widthPct = fraction > 0 ? fraction * 100 : filled ? 100 : 0;

          const isChecked = Math.round(rating || 0) === starNumber;

          return (
            <button
              key={index}
              type="button"
              role={interactive ? "radio" : undefined}
              aria-checked={interactive ? isChecked : undefined}
              aria-label={`Oceń na ${starNumber} z ${maxRating}`}
              title={interactive ? `Oceń na ${starNumber}` : undefined}
              disabled={!interactive || isPending}
              className={[
                "relative",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-yellow-400 rounded",
                interactive ? "cursor-pointer" : "",
                !interactive || isPending
                  ? "pointer-events-none cursor-not-allowed"
                  : "",
                isPending ? "opacity-50" : "",
              ].join(" ")}
              onClick={() => onClick?.(starNumber)}
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
        {isPending
          ? "Zapisywanie oceny…"
          : `Obecna ocena: ${rating} na ${maxRating}`}
      </span>
    </div>
  );
}

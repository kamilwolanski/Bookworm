"use client";

import RatingFilter from "./filters/RatingFilter";
import GenreFilter from "./filters/GenreFilter";
import { GenreDTO } from "@/lib/books";
import UserRatingFilter from "./filters/UserRatingFilter";
import StatusFilter from "./filters/StatusFilter";
import { useFilters } from "./filtersProvider/FiltersProvider";
export default function FiltersPanel({
  bookGenres,
  isLogIn,
}: {
  bookGenres: GenreDTO[];
  isLogIn: boolean;
}) {
  const { filters, setFilters } = useFilters();

  return (
    <>
      <div className="hidden lg:block">
        <div className="lg:w-100">
          <div className="space-y-6">
            <GenreFilter
              bookGenres={bookGenres}
              value={filters.genres}
              onChange={(genres) => setFilters((f) => ({ ...f, genres }))}
            />

            <RatingFilter
              value={filters.rating}
              onChange={(v) =>
                setFilters((f) => ({ ...f, rating: v || undefined }))
              }
            />
            {isLogIn && (
              <>
                <UserRatingFilter
                  value={filters.userrating}
                  onChange={(userrating) =>
                    setFilters((f) => ({ ...f, userrating }))
                  }
                />

                <StatusFilter
                  value={filters.statuses}
                  onChange={(statuses) =>
                    setFilters((f) => ({ ...f, statuses }))
                  }
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

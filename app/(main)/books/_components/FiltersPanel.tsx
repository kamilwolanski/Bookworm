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
  const { uiFilters, setUiFilters } = useFilters();

  return (
    <>
      <div className="hidden lg:block">
        <div className="lg:w-100">
          <div className="space-y-6">
            <GenreFilter
              bookGenres={bookGenres}
              value={uiFilters.genres}
              onChange={(genres) => setUiFilters((f) => ({ ...f, genres }))}
            />

            <RatingFilter
              value={uiFilters.rating}
              onChange={(v) =>
                setUiFilters((f) => ({ ...f, rating: v || undefined }))
              }
            />
            {isLogIn && (
              <>
                <UserRatingFilter
                  value={uiFilters.userrating}
                  onChange={(userrating) =>
                    setUiFilters((f) => ({ ...f, userrating }))
                  }
                />

                <StatusFilter
                  value={uiFilters.statuses}
                  onChange={(statuses) =>
                    setUiFilters((f) => ({ ...f, statuses }))
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

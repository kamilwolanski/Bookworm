"use client";

import RatingFilter from "./filters/RatingFilter";
import GenreFilter from "./filters/GenreFilter";
import { GenreDTO } from "@/lib/books";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SearchBar } from "./filters/SearchBar";
import UserRatingFilter from "./filters/UserRatingFilter";
import StatusFilter from "./filters/StatusFilter";
import CountResultsClient from "./CountResultsClient";
import ShelfSwitch from "./filters/ShelfSwitch";
import { useFilters } from "./filtersProvider/FiltersProvider";
import ActiveFilters from "./filters/ActiveFilters";
export default function SearchPanel({
  isLogIn,
  bookGenres,
}: {
  isLogIn: boolean;
  bookGenres: GenreDTO[];
}) {
  const { filters, setFilters } = useFilters();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-6 sm:mb-10 gap-3">
        <div className="w-full lg:max-w-lg">
          <Sheet>
            <SearchBar
              placeholder="Szukaj książek"
              value={filters.search ?? ""}
              onChange={(search) =>
                setFilters((f) => ({
                  ...f,
                  search: search || "",
                }))
              }
            />

            <div className="lg:hidden">
              <ActiveFilters
                filters={filters}
                onChange={(next) => setFilters(next)}
                onClearAll={() =>
                  setFilters({
                    search: undefined,
                    rating: undefined,
                    genres: [],
                    userrating: [],
                    statuses: [],
                  })
                }
              />
            </div>
            <SheetContent
              side="right"
              className="max-h-screen w-full overflow-y-scroll"
            >
              <SheetHeader className="pb-0">
                <SheetTitle className="text-center">Dopasuj wyniki</SheetTitle>
              </SheetHeader>
              <Separator />
              <div className="px-4 mt-5">
                <div className="mb-8">
                  <SearchBar
                    placeholder="Szukaj książek"
                    value={filters.search ?? ""}
                    onChange={(search) =>
                      setFilters((f) => ({
                        ...f,
                        search: search || undefined,
                      }))
                    }
                  />
                </div>
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

              <SheetFooter className="bg-card sticky bottom-0">
                <SheetClose asChild>
                  <Button className="cursor-pointer">
                    Pokaż wyniki (<CountResultsClient />)
                  </Button>
                </SheetClose>
              </SheetFooter>
            </SheetContent>
          </Sheet>
        </div>
        <div className="hidden lg:block">
          {isLogIn && (
            <ShelfSwitch
              value={filters.myShelf}
              onChange={(myShelf) => setFilters((f) => ({ ...f, myShelf }))}
            />
          )}
        </div>
      </div>
      {isLogIn && (
        <div className="lg:hidden bg-card shadow-lg flex justify-between items-center rounded-lg py-2 px-3 mb-6">
          <span className="text-sm">
            <b>Tylko książki z mojej półki</b>
          </span>
          <ShelfSwitch
            value={filters.myShelf}
            onChange={(myShelf) => setFilters((f) => ({ ...f, myShelf }))}
            showLabel={false}
          />
        </div>
      )}
    </div>
  );
}

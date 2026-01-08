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
  const { uiFilters, setUiFilters } = useFilters();

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center mb-6 sm:mb-10 gap-3">
        <div className="w-full lg:max-w-lg">
          <Sheet>
            <SearchBar
              placeholder="Szukaj książek"
              value={uiFilters.search ?? ""}
              onChange={(search) => setUiFilters((f) => ({ ...f, search }))}
            />

            <div className="lg:hidden">
              <ActiveFilters
                filters={uiFilters}
                onChange={(next) => setUiFilters(next)}
                onClearAll={() =>
                  setUiFilters({
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
                    value={uiFilters.search ?? ""}
                    onChange={(search) =>
                      setUiFilters((f) => ({ ...f, search }))
                    }
                  />
                </div>
                <GenreFilter
                  bookGenres={bookGenres}
                  value={uiFilters.genres}
                  onChange={(genres) => setUiFilters((f) => ({ ...f, genres }))}
                />

                <RatingFilter
                  value={uiFilters.rating}
                  onChange={(rating) => setUiFilters((f) => ({ ...f, rating }))}
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
              value={uiFilters.myShelf}
              onChange={(myShelf) => setUiFilters((f) => ({ ...f, myShelf }))}
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
            value={uiFilters.myShelf}
            onChange={(myShelf) => setUiFilters((f) => ({ ...f, myShelf }))}
            showLabel={false}
          />
        </div>
      )}
    </div>
  );
}

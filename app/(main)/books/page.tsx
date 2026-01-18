import { Suspense } from "react";
import type { Metadata } from "next";
import BooksFiltersClientShell from "./_components/filtersProvider/BooksFiltersClientShell";
import BookFilters from "./_components/filters/BookFilters";
import SearchHeader from "./_components/SearchHeader";
import BooksTableServer from "./_components/BooksTableServer";
import BooksTableSuspense from "./_components/BooksTableSuspense";
import { Skeleton } from "@/components/ui/skeleton";

type BooksProps = {
  searchParams?: Promise<{
    page?: string;
    search?: string;
    genre?: string;
    userrating?: string;
    rating?: string;
    status?: string;
    myshelf?: string;
  }>;
};

export const metadata: Metadata = {
  title: "BookWorm | Książki",
  description:
    "Wyszukiwarka książek online – sprawdź opisy, oceny i recenzje. BookWorm to baza tysięcy tytułów, które możesz przeglądać, filtrować i dodać do swojej kolekcji.",
};

export default async function Books({ searchParams }: BooksProps) {
  return (
    <div
      className="
    mt-5
    grid
    grid-cols-[auto_1fr]
    grid-rows-[auto_1fr]
    sm:gap-x-16
    [grid-template-areas:'filters_header''filters_content']
    h-full
  "
    >
      <Suspense
        fallback={
          <div className="hidden lg:block">
            <div className="lg:w-100">
              <div className="space-y-6">
                <Skeleton className="w-full h-28 shadow-xl rounded-xl px-5" />
              </div>
              <div className="space-y-6">
                <Skeleton className="w-full h-57 shadow-xl rounded-xl px-5 mt-8" />
              </div>
              <div className="space-y-6">
                <Skeleton className="w-full h-72 shadow-xl rounded-xl px-5 mt-8" />
              </div>
              <div className="space-y-6">
                <Skeleton className="w-full h-52 shadow-xl rounded-xl px-5 mt-8" />
              </div>
            </div>
          </div>
        }
      >
        <BooksFiltersClientShell>
          <div className="[grid-area:filters]">
            <BookFilters />
          </div>
          <div className="[grid-area:header] flex flex-col w-full">
            <SearchHeader />
          </div>
        </BooksFiltersClientShell>
      </Suspense>

      <div className="[grid-area:content] flex flex-col justify-between">
        <Suspense
          fallback={
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 3xl:grid-cols-6 gap-2 3xl:gap-10">
              {Array.from({ length: 18 }).map((_, i) => (
                <Skeleton
                  className="relative border-none h-full shadow-md p-1 rounded-xl"
                  key={i}
                >
                  <div className="relative aspect-230/320 w-full" />
                </Skeleton>
              ))}
            </div>
          }
        >
          <BooksTableSuspense>
            <BooksTableServer searchParams={searchParams} />
          </BooksTableSuspense>
        </Suspense>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import Link from "next/link";
import { BookCardDTO } from "@/lib/books/listings";
import { Suspense } from "react";
import { UserBookOverlay } from "../UserBookOverlay";
import UserEditionRating from "@/app/(main)/_components/UserEditionRating";
import AverageRating from "@/app/(main)/_components/averageRating/AverageRating";
import BookCoverImage from "@/app/(main)/books/[slug]/[editionId]/_components/BookCover.client";


export function BookCard({ bookItem }: { bookItem: BookCardDTO }) {
  const { book, representativeEdition } = bookItem;

  return (
    <Card className="relative cursor-pointer border-none h-full shadow-md hover:shadow-xl p-1 rounded-xl">
      <div className="relative aspect-230/320 w-full">
        {bookItem.representativeEdition.coverUrl ? (
          <BookCoverImage
            fill
            coverUrl={bookItem.representativeEdition.coverUrl}
            sizes="
    (max-width: 640px) 50vw,
    (max-width: 768px) 50vw,
    (max-width: 1024px) 33vw,
    (max-width: 1280px) 25vw,
    20vw
  "
          />
        ) : (
          <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-lg">
            Brak okładki
          </div>
        )}

        <div className="bg-linear-to-t from-black/90 via-black/50 to-black/40 backdrop-blur-sm absolute bottom-0 left-0 px-3 pt-2 pb-3 w-full flex justify-between lg:min-h-32 rounded-b-lg z-10">
          <div className="flex justify-between w-full">
            <div className="w-full flex flex-col justify-between">
              <div className="pb-1">
                <h3 className="font-semibold text-md md:text-lg">
                  {bookItem.representativeEdition.title}
                </h3>
                <p className="text-xs lg:text-base">
                  {bookItem.book.authors.map((a) => a.name).join(", ")}
                </p>
              </div>
              <div className="flex gap-2 pt-1 border-gray-300/30 border-t">
                <Suspense
                  fallback={
                    <div className="flex gap-1 items-center">
                      <div className="h-5 w-16 bg-gray-300 opacity-30 rounded animate-pulse" />
                    </div>
                  }
                >
                  <AverageRating bookId={book.id} bookSlug={book.slug} />
                </Suspense>

                <Suspense
                  fallback={
                    <div className="flex gap-1 items-center">
                      <div className="h-5 w-16 bg-gray-300 opacity-30 rounded animate-pulse" />
                    </div>
                  }
                >
                  <UserEditionRating editionId={representativeEdition.id} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="absolute top-0 left-0 z-20 p-3 w-full flex justify-between items-center">
        <Suspense
          fallback={
            <>
              <div className="flex items-center gap-2">
                <div className="h-8 w-24 rounded-2xl bg-gray-300 opacity-30 animate-pulse" />
              </div>
              <div className="rounded-full w-7! h-7! bg-gray-300 opacity-30 animate-pulse" />
            </>
          }
        >
          <UserBookOverlay
            editionId={representativeEdition.id}
            book={book}
            representativeEditionId={representativeEdition.id}
            representativeEditionTitle={representativeEdition.title ?? ""}
          />
        </Suspense>
      </div>

      <Link
        href={`/books/${book.slug}/${representativeEdition.id}`}
        className="absolute inset-0 z-10"
      />
    </Card>
  );
}

import { getAllBookStaticParams } from "@/lib/books";
import { Suspense } from "react";
import StarRatingPlaceholder from "@/components/book/starRating/StarRatingPlaceholder";
import { Separator } from "@/components/ui/separator";
import { BookCover, BookSpecs, BookTitleSection } from "./_components";
import { Skeleton } from "@/components/ui/skeleton";
import BookActions from "./_components/BookActions";
import Reviews from "./_components/reviews/Reviews";
import BookReviewsSkeleton from "./_components/reviews/placeholders/BookReviewsSkeleton";
import BookTabsServer from "./_components/BookTabsServer";

interface BookPageProps {
  params: Promise<{ editionId: string; slug: string }>;
  searchParams?: Promise<{
    page?: string;
  }>;
}

export async function generateStaticParams() {
  return getAllBookStaticParams();
}

export default async function Page({ params, searchParams }: BookPageProps) {
  const { editionId, slug } = await params;

  return (
    <div className="mt-10 max-w-7xl mx-auto">
      <div className="space-y-10">
        <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
                <BookCover editionId={editionId} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="relative gap-2 sm:gap-3">
                <div>
                  <BookTitleSection editionId={editionId} />
                  <Suspense
                    fallback={
                      <>
                        <div className="mt-3 flex items-center gap-3">
                          <p>
                            <b>Twoja ocena: </b>
                          </p>
                          <StarRatingPlaceholder />
                        </div>
                        <div className="flex items-center gap-2 mt-4">
                          <StarRatingPlaceholder />
                          <span className="invisible">0.0</span>
                          <span className="invisible">(0 ocen)</span>
                        </div>
                        <div className="mt-5 flex gap-3">
                          <Skeleton className="h-9 w-37 bg-badge-new" />
                          <Skeleton className="h-9 w-21 border bg-white shadow-xs hover:bg-gray-100 text-accent-2 dark:bg-input/30 dark:border-input dark:hover:bg-input/50" />
                        </div>
                        <div className="flex gap-2 absolute top-0 right-0">
                          <Skeleton className="border w-16.75 h-5.5" />
                          <Skeleton className="border w-30 h-5.5" />
                        </div>
                      </>
                    }
                  >
                    <BookActions bookSlug={slug} editionId={editionId} />
                  </Suspense>
                </div>
              </div>
              <Separator className="mt-5" />
              <BookSpecs editionId={editionId} />
            </div>
          </div>
        </div>
        <BookTabsServer editionId={editionId} slug={slug} />
        <Suspense fallback={<BookReviewsSkeleton />}>
          <Reviews
            bookSlug={slug}
            editionId={editionId}
            searchParams={searchParams}
          />
        </Suspense>
      </div>
    </div>
  );
}

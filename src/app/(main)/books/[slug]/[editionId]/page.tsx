import BookDetails from '@/components/book/bookDetails/BookDetails';
import { getBook } from '@/lib/userbooks';
import { getOtherEditions } from '@/lib/books';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OtherBooks from '@/components/book/bookDetails/OtherBooks';
import { Suspense } from 'react';
import ReviewsServer from './Reviews';

interface BookPageProps {
  params: Promise<{ editionId: string; slug: string }>;
  searchParams?: Promise<{
    page: string;
  }>;
}

export const revalidate = 21600; // 6h

export default async function BookEdition({
  params,
  searchParams,
}: BookPageProps) {
  const { editionId, slug } = await params;
  const { page } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);

  const [book, otherEditions] = await Promise.all([
    getBook(editionId),
    getOtherEditions(slug, editionId),
    ,
  ]);

  return (
    <>
      <div className="mt-10 max-w-7xl mx-auto">
        <div className="space-y-10">
          <BookDetails bookData={book} />
          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger
                value="description"
                className="cursor-pointer data-[state=active]:bg-sidebar"
              >
                Opis
              </TabsTrigger>
              <TabsTrigger
                value="otherEditions"
                className="cursor-pointer data-[state=active]:bg-sidebar"
              >
                Inne wydania
              </TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              {book.edition.description && (
                <div className="bg-sidebar shadow-lg rounded-xl p-6">
                  <div>
                    <p className="text-sm  leading-relaxed">
                      {book.edition.description}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="otherEditions">
              <OtherBooks bookSlug={slug} otherEditions={otherEditions} />
            </TabsContent>
          </Tabs>

          <Suspense
            fallback={
              <div className="bg-sidebar rounded-xl p-6">
                Ładowanie recenzji…
              </div>
            }
          >
            <ReviewsServer
              slug={slug}
              page={currentPage}
              bookId={book.book.id}
              editionId={editionId}
              userReview={book.userBook?.userReview}
              editionTitle={book.edition.title}
              currentPage={currentPage}
            />
          </Suspense>
        </div>
      </div>
    </>
  );
}

import BookDetails from '@/components/book/bookDetails/BookDetails';
import { getBook } from '@/lib/userbooks';
import { getBookEditionMetaData, getOtherEditions } from '@/lib/books';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OtherBooks from '@/components/book/bookDetails/OtherBooks';
import { Suspense } from 'react';
import ReviewsServer from './Reviews';
import { Metadata, ResolvingMetadata } from 'next';

interface BookPageProps {
  params: Promise<{ editionId: string; slug: string }>;
  searchParams?: Promise<{
    page: string;
  }>;
}

export async function generateMetadata(
  { params }: BookPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const editionId = (await params).editionId;

  const editionResponse = await getBookEditionMetaData(editionId);
  const parentMetadata = await parent;
  return {
    title: `${parentMetadata.title?.absolute} | ${editionResponse.title}`,
    description: editionResponse.description,
  };
}

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
            key={`reviews-${slug}-${currentPage}`}
            fallback={
              <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-foreground" />
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

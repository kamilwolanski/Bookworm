import BookDetails from '@/components/book/bookDetails/BookDetails';
import { getBook, getBookReviews, getOtherEditions } from '@/lib/userbooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OtherBooks from '@/components/book/bookDetails/OtherBooks';
import BookReviews from '@/components/book/bookDetails/BookReviews';

interface BookPageProps {
  params: Promise<{ editionId: string; slug: string }>;
  searchParams?: {
    page?: string;
  };
}

export default async function BookEdition({
  params,
  searchParams,
}: BookPageProps) {
  const { editionId, slug } = await params;
  const { page } = searchParams ? await searchParams : {};
  const currentPage = parseInt(page || '1', 10);
  const book = await getBook(editionId);
  const otherEditions = await getOtherEditions(slug, editionId);
  const reviewsResponse = await getBookReviews(slug, {
    page: currentPage,
    pageSize: 2,
    onlyWithContent: true,
  });

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

          <BookReviews
            bookId={book.book.id}
            bookSlug={slug}
            editionId={editionId}
            editionTitle={book.edition.title}
            userReview={book.userBook?.userReview}
            reviews={reviewsResponse.items}
            paginationData={{
              page: currentPage,
              pageSize: reviewsResponse.pageSize,
              total: reviewsResponse.total,
            }}
          />
        </div>
      </div>
    </>
  );
}

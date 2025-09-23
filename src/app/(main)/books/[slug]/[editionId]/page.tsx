import BackTopBar from '@/components/layout/BackTopBar';
import BookDetails from '@/components/book/bookDetails/BookDetails';
import CommentThread from '@/components/comments/CommentThread';
import CommentInput from '@/components/comments/CommentInput';
import SidebarRecentBooks from '@/components/book/SidebarRecentBooks';
import { getBook, getBookReviews, getOtherEditions } from '@/lib/userbooks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OtherBooks from '@/components/book/bookDetails/OtherBooks';
import BookReviews from '@/components/book/bookDetails/BookReviews';

interface BookPageProps {
  params: Promise<{ editionId: string; slug: string }>;
}

export default async function BookEdition({ params }: BookPageProps) {
  const { editionId, slug } = await params;
  const book = await getBook(editionId);
  const otherEditions = await getOtherEditions(slug, editionId);
  const reviewsResponse = await getBookReviews(slug, {
    onlyWithContent: true,
  });

  console.log('reviewsResponse', reviewsResponse);
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
              {otherEditions.length > 0 && (
                <OtherBooks bookSlug={slug} otherEditions={otherEditions} />
              )}
            </TabsContent>
          </Tabs>

          <BookReviews
            reviews={reviewsResponse.items}
            totalReviews={reviewsResponse.total}
          />
        </div>
      </div>
    </>
  );
}

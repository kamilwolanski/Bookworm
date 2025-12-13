import BookDetails from '@/components/book/bookDetails/BookDetails';
import {
  getAllBookStaticParams,
  getBook,
  getBookEditionMetaData,
  getOtherEditions,
} from '@/lib/books';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OtherBooks from '@/components/book/bookDetails/OtherBooks';
import { Metadata, ResolvingMetadata } from 'next';
import BookReviewsServer from './BookReviewsServer';

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

export async function generateStaticParams() {
  return getAllBookStaticParams();
}

export default async function BookEdition({ params }: BookPageProps) {
  const { editionId, slug } = await params;

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

          <BookReviewsServer
            slug={slug}
            editionId={editionId}
            bookId={book.book.id}
            editionTitle={book.edition.title}
          />
        </div>
      </div>
    </>
  );
}

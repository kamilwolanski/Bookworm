import BackTopBar from '@/components/layout/BackTopBar';
import BookDetails from '@/components/book/bookDetails/BookDetails';
import CommentThread from '@/components/comments/CommentThread';
import CommentInput from '@/components/comments/CommentInput';
import SidebarRecentBooks from '@/components/book/SidebarRecentBooks';
import { getBook, getOtherEditions } from '@/lib/userbooks';
import OtherBooks from '@/components/book/bookDetails/OtherBooks';

interface BookPageProps {
  params: Promise<{ editionId: string; slug: string }>;
}

export default async function BookEdition({ params }: BookPageProps) {
  const { editionId, slug } = await params;
  const book = await getBook(editionId);
  const otherEditions = await getOtherEditions(slug, editionId);
  console.log('book', book);
  console.log('otherEditions', otherEditions);
  return (
    <>
      <div className="mt-10 max-w-7xl mx-auto">
        <div className="space-y-10">
          <BookDetails bookData={book} />
          <OtherBooks bookSlug={slug} otherEditions={otherEditions} />
          {/* <div className="bg-[#1A1D24] shadow rounded-xl space-y-6 p-6">
            <CommentInput bookId={id} />
            <hr />
            <CommentThread comments={book.data.comments} />
          </div> */}
        </div>
        {/* <div className="md:block">
          <SidebarRecentBooks currentBookId={id} />
        </div> */}
      </div>
    </>
  );
}

import BackTopBar from '@/components/layout/BackTopBar';
import BookDetails from '@/components/book/bookDetails/BookDetails';
import CommentThread from '@/components/comments/CommentThread';
import CommentInput from '@/components/comments/CommentInput';
import SidebarRecentBooks from '@/components/book/SidebarRecentBooks';
interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function Book({ params }: BookPageProps) {
  const { slug } = await params;

  const book = await getBookAction(id);

  return (
    <>
      <BackTopBar />
      {book.data ? (
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-10 mt-20 max-w-[1480px] mx-auto items-start">
          <div className="space-y-10">
            <BookDetails bookData={book.data} />

            <div className="bg-[#1A1D24] shadow rounded-xl space-y-6 p-6">
              <CommentInput bookId={id} />
              <hr />
              <CommentThread comments={book.data.comments} />
            </div>
          </div>
          <div className="md:block">
            <SidebarRecentBooks currentBookId={id} />
          </div>
        </div>
      ) : (
        <p>dupa</p>
      )}
    </>
  );
}

import BackTopBar from '@/components/layout/BackTopBar';
import { getBookAction } from '@/app/(dashboard)/books/actions/bookActions';
import BookDetails from '@/components/book/BookDetails';
import CommentThread from '@/components/comments/CommentThread';
import CommentInput from '@/components/comments/CommentInput';
interface BookPageProps {
  params: Promise<{ id: string }>;
}

// const comments = [
//   {
//     id: '1',
//     content: 'This was super helpful, thanks!',
//     addedAt: new Date().toISOString(),
//     author: { name: 'Anna Kowalska', email: 'anna@example.com' },
//     likes: 4,
//     dislikes: 0,
//     replies: [
//       {
//         id: '2',
//         content: 'I agree! Clear explanation.',
//         addedAt: new Date().toISOString(),
//         author: { name: 'John Doe', email: 'john@example.com' },
//         likes: 2,
//         dislikes: 0,
//       },
//     ],
//   },
// ];

export default async function Book({ params }: BookPageProps) {
  const { id } = await params;

  const book = await getBookAction(id);
  console.log('book', book);
  if (book.isError) {
    return <p>Błąd</p>;
  }

  return (
    <>
      {book.data ? (
        <div>
          <BackTopBar />
          <div className="grid grid-cols-3 gap-10 mt-20 max-w-[1480px] mx-auto">
            <BookDetails bookData={book.data} />
            <div className="col-span-1 bg-[#1A1D24] shadow rounded-xl"></div>
          </div>
          <div className="grid grid-cols-3 gap-10 mt-20 max-w-[1480px] mx-auto">
            <div className="col-span-2 bg-[#1A1D24] shadow rounded-xl space-y-6 p-6">
              <CommentInput bookId={id} />
              <hr />
              <CommentThread comments={book.data.comments} />
            </div>
          </div>
        </div>
      ) : (
        <p>dupa</p>
      )}
    </>
  );
}

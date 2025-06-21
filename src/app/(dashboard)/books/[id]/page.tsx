// import { BookList } from '@/components/book/BookList';
// import BookForm from '@/components/book/BookForm';

import BackTopBar from '@/components/BackTopBar';
import { getBookAction } from '@/app/(dashboard)/actions';
import BookDetails from '@/components/book/BookDetails';

interface BookPageProps {
  params: Promise<{ id: string }>;
}

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
            <BookDetails {...book.data} />
            <div className="col-span-1 bg-white shadow rounded-xl"></div>
          </div>
        </div>
      ) : (
        <p>dupa</p>
      )}
    </>
  );
}

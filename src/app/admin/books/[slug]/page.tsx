import AddEditionDialog from '@/components/admin/edition/AddEditionDialog';
import AdminEditionsTable from '@/components/admin/edition/AdminEditionsTable';
import { getBookBySlug } from '@/lib/adminBooks';
import { getAllEditionsBasic } from '@/lib/editions';

interface BookPageProps {
  params: Promise<{ slug: string }>;
}

export default async function BookEdition({ params }: BookPageProps) {
  const { slug } = await params;

  const book = await getBookBySlug(slug);
  const response = await getAllEditionsBasic(book.id);

  return (
    <div className="min-h-full flex flex-col">
      <div className="flex">
        <AddEditionDialog
          bookId={book.id}
          bookSlug={slug}
          bookTitle={book.title}
        />
      </div>
      <h1 className="mt-5 text-2xl">
        <b>{book.title}</b>
      </h1>
      <div className="flex flex-1">
        <AdminEditionsTable
          editions={response}
          bookId={book.id}
          bookSlug={slug}
        />
      </div>
    </div>
  );
}

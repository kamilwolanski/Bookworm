'use server';
import { getRecentBooksAction } from '@/app/(main)/books/actions/bookActions';

import Link from 'next/link';
import Image from 'next/image';

const SidebarRecentBooks = async ({
  currentBookId,
}: {
  currentBookId: string;
}) => {
  const result = await getRecentBooksAction(currentBookId);

  if (result.isError) {
    return <p>error</p>;
  }

  const recentBooks = result.data;

  return (
    <div className="bg-[#1A1D24] rounded-xl p-4 shadow-lg space-y-3">
      <h3 className="text-xl font-semibold text-white border-b border-white/10 pb-2">
        Ostatnio dodane
      </h3>

      {recentBooks?.length === 0 ? (
        <p className="text-sm text-gray-400">Brak innych książek</p>
      ) : (
        recentBooks?.map((book) => (
          <Link
            key={book.id}
            href={`/books/${book.id}`}
            className="flex items-center gap-3 hover:bg-white/5 p-2 rounded-md transition"
          >
            {book.imageUrl ? (
              <Image
                src={book.imageUrl}
                alt={book.title}
                width={40}
                height={56}
                className="rounded-md object-cover"
              />
            ) : (
              <div className="w-10 h-14 bg-gray-700 rounded-md" />
            )}

            <span className="text-white text-sm">{book.title}</span>
          </Link>
        ))
      )}
    </div>
  );
};

export default SidebarRecentBooks;

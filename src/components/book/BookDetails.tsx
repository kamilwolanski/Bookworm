import Image from 'next/image';
import { format } from 'date-fns';
import { BookDTO, getBookGenres } from '@/lib/books';
import { Badge } from '../ui/badge';
import { Star, Trash2 } from 'lucide-react';
import { genreColorMap } from '@/lib/genreColorMap';
import { BookStatus } from './BookStatus';
import DeleteBtn from './DeleteBtn';
import { Button } from '../ui/button';
import EditBtn from './EditBtn';
import { Pencil } from 'lucide-react';

const BookDetails = async ({ bookData }: { bookData: BookDTO }) => {
  const bookGenres = await getBookGenres('pl');

  const {
    id,
    title,
    author,
    imageUrl,
    publicationYear,
    readingStatus,
    rating,
    genres,
    description,
    pageCount,
    addedAt,
  } = bookData;

  return (
    <div className="p-6 bg-white shadow rounded-xl col-span-2">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-700">{title}</h1>
        </div>
        <div className="flex items-center gap-1">
          {rating ? (
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  type="button"
                  className={
                    num <= rating
                      ? 'text-yellow-400 cursor-pointer'
                      : 'text-gray-300 cursor-pointer'
                  }
                >
                  <Star className="w-6 h-6 fill-current" />
                </button>
              ))}
            </div>
          ) : (
            <span>—</span>
          )}
        </div>
      </div>
      <hr className="mb-5" />
      <div className="flex flex-col md:flex-row gap-8">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={title}
            width={200}
            height={300}
            className="rounded-md object-cover shadow-md"
          />
        ) : (
          <div className="w-[200px] h-[300px] bg-gray-200 rounded-md flex items-center justify-center text-sm text-gray-500">
            No Cover
          </div>
        )}

        <div className="flex-1 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 text-sm text-gray-700 h-full">
            <div>
              <p className="text-lg text-gray-700">
                <b>Autor: </b>
                {author}
              </p>
              <div className="mt-2">
                <p className="text-lg">
                  <b>Rok wydania:</b> <span>{publicationYear ?? '—'}</span>
                </p>
              </div>
              {pageCount && (
                <div className="mt-2">
                  <p className="text-lg">
                    <b>Liczba stron:</b> <span>{pageCount}</span>
                  </p>
                </div>
              )}
              <div className="mt-2">
                <p className="text-lg">
                  <b>Data dodania:</b>{' '}
                  <span>{format(addedAt, 'dd.MM.yyyy')}</span>
                </p>
              </div>
              {genres && (
                <div className="mt-4">
                  {genres?.map((genre, index) => {
                    return (
                      <Badge
                        key={genre.id}
                        className={`${index > 0 ? 'ms-2' : ''} ${genreColorMap[genre.slug]}`}
                      >
                        {genre.name}
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
            <div className="flex justify-between flex-col">
              <div className="ml-auto">
                <BookStatus status={readingStatus} />
              </div>
              <div className="ml-auto">
                <DeleteBtn bookId={id} bookTitle={title}>
                  <Button
                    variant="destructive"
                    className="cursor-pointer text-white px-5"
                  >
                    <span className="flex items-center gap-2">
                      <Trash2 size={16} />
                      Usuń
                    </span>
                  </Button>
                </DeleteBtn>
                <EditBtn bookGenres={bookGenres} bookData={bookData}>
                  <Button
                    variant="default"
                    className="cursor-pointer text-white px-5 ms-5"
                  >
                    <span className="flex items-center gap-2">
                      <Pencil size={16} />
                      Edytuj
                    </span>
                  </Button>
                </EditBtn>
              </div>
            </div>
          </div>
        </div>
      </div>
      {description && (
        <div className="mt-20 pl-10">
          <p className="text-sm text-gray-800 leading-relaxed">{description}</p>
        </div>
      )}
    </div>
  );
};

export default BookDetails;

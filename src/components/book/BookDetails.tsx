// import { Book } from '@prisma/client';
import Image from 'next/image';
// import DeleteBtn from './DeleteBtn';
import { format } from 'date-fns';
import { BookDTO } from '@/lib/books';
import { Badge } from '../ui/badge';
import { Star } from 'lucide-react';

const BookDetails = ({
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
}: BookDTO) => {
  function readingStatusLabel(status: string) {
    switch (status) {
      case 'WANT_TO_READ':
        return 'Chcę przeczytać';
      case 'READING':
        return 'Czytam';
      case 'READ':
        return 'Przeczytana';
      case 'ABANDONED':
        return 'Porzucona';
      default:
        return status;
    }
  }
  return (
    <div className="p-6 bg-white shadow rounded-xl col-span-2">
      <h1 className="text-3xl font-bold text-gray-700 mb-5">{title}</h1>
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
          <p className="text-lg text-gray-700">
            <b>Autor: </b>
            {author}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm text-gray-700">
            <div>
              <span className="font-medium">Year</span>
              <div>{publicationYear ?? '—'}</div>
            </div>
            <div>
              <span className="font-medium">Genre</span>
              {/* <div>{genres.length ? genres.join(", ") : "—"}</div> */}
            </div>
            <div>
              <span className="font-medium">Status</span>
              <div>{readingStatus}</div>
            </div>
            <div>
              <span className="font-medium">Rating</span>
              <div className="flex items-center gap-1">
                {rating ? (
                  Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} size={16} fill="black" stroke="black" />
                  ))
                ) : (
                  <span>—</span>
                )}
              </div>
            </div>
          </div>

          {description && (
            <div>
              <div className="font-medium text-sm mb-1">Description</div>
              <p className="text-sm text-gray-800 leading-relaxed">
                {description}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

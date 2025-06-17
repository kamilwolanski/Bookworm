import { Book } from '@prisma/client';
import Image from 'next/image';
import DeleteBtn from './DeleteBtn';

const BookDetails = ({ id, title, author, imageUrl }: Book) => {
  return (
    <div className="grid grid-cols-1 mx-auto mt-20 max-w-[1280px]">
      <div className="flex flex-col md:flex-row gap-8">
        {imageUrl && (
          <div className="relative basis-1/3">
            <div className="aspect-[3/4]">
              <Image
                className="rounded-2xl shadow-md border-2 border-amber-50"
                priority
                src={imageUrl}
                fill
                alt={''}
              />
            </div>
          </div>
        )}

        <div className="flex-1 md:ml-20">
          <h1 className="text-4xl font-bold mb-2">{title}</h1>
          <p className="text-lg text-gray-400 mb-4">{author}</p>

          <p className="mb-4">
            Opis książki... Możesz dodać krótki opis tutaj.
          </p>

          <div className="flex gap-4">
            <DeleteBtn bookTitle={title} bookId={id}>
              <button className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">
                Usuń
              </button>
            </DeleteBtn>
            <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
              Edytuj
            </button>
            <button className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">
              Przeczytana
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

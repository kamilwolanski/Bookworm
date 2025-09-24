import { OtherEditionDto } from '@/lib/userbooks';
import Image from 'next/image';
import Link from 'next/link';

const OtherBooks = ({
  bookSlug,
  otherEditions,
}: {
  bookSlug: string;
  otherEditions: OtherEditionDto[];
}) => {
  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 ">
        {otherEditions.length > 0 ? (
          otherEditions.map((edition) => (
            <Link
              key={edition.id}
              href={`/books/${bookSlug}/${edition.id}`}
              className="hover:shadow-xl"
            >
              <div className="text-center aspect-[2/3] relative">
                {edition.coverUrl ? (
                  <Image
                    src={edition.coverUrl}
                    alt={edition.title ?? ''}
                    fill
                    sizes="100vw"
                    className="rounded-md object-cover "
                  />
                ) : (
                  <div className="w-[66px] h-[100px] rounded-md flex items-center justify-center text-sm text-muted-foreground">
                    No Cover
                  </div>
                )}
                <p className="text-sm text-muted-foreground">{edition.title}</p>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">Brak innych wydań</p>
        )}
      </div>
    </div>
  );
};

export default OtherBooks;

import { AuthorDto } from '@/lib/author';
import { BookOpen, Calendar } from 'lucide-react';
import { COUNTRIES } from '@/app/admin/data';
import Emoji from '@/components/shared/Emoji';
import { Separator } from '@/components/ui/separator';
import Image from 'next/image';

const AuthorDetails = ({ authorData }: { authorData: AuthorDto }) => {
  const birthYear = authorData.birthDate
    ? new Date(authorData.birthDate).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : null;
  const deathYear = authorData.deathDate
    ? new Date(authorData.deathDate).toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      })
    : null;

  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {authorData.imageUrl ? (
            <Image
              src={authorData.imageUrl}
              alt={authorData.name}
              width={320}
              height={620}
              className="rounded-md object-cover mx-auto"
            />
          ) : (
            <div className="w-[280px] h-[420px] rounded-md flex items-center justify-center text-sm text-muted-foreground">
              Brak avatara
            </div>
          )}
        </div>
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h1 className="mb-4 text-lg font-semibold">{authorData.name}</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
              {(birthYear || deathYear) && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>
                    {birthYear}
                    {deathYear ? ` - ${deathYear}` : ' - obecnie'}
                  </span>
                </div>
              )}
              {authorData.nationality && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Emoji>
                    {COUNTRIES.find((l) => l.value === authorData.nationality)
                      ?.icon ?? ''}
                  </Emoji>
                  <span>
                    {
                      COUNTRIES.find((c) => c.value === authorData.nationality)
                        ?.label
                    }
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="w-4 h-4" />
                <span>
                  {authorData.authoredBooksCount}{' '}
                  {authorData.authoredBooksCount === 1
                    ? 'książka'
                    : authorData.authoredBooksCount < 5
                      ? 'książki'
                      : 'książek'}
                </span>
              </div>
            </div>
            {authorData.bio && (
              <>
                <Separator className="mb-4" />
                <div>
                  <h3 className="mb-3 font-semibold">Biografia</h3>
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {authorData.bio}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorDetails;

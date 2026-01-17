'use client';

import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Emoji from '@/components/shared/Emoji';
import { RadioGroup } from '@/components/ui/radio-group';
import { FormField, FormItem } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { EditionDto } from '@/lib/books';
import { UserEditionDto } from '@/lib/user';
import { LANGUAGES } from '@/lib/constants/languages';

const ChooseEditonComponent = ({
  editions,
  bookSlug,
  userEditions = [],
  goNext,
}: {
  editions: EditionDto[];
  bookSlug: string;
  userEditions?: UserEditionDto[];
  goNext: () => void;
}) => {
  const { status } = useSession();

  const form = useFormContext<{ editionId: string }>();

  const userEditionIds = new Set(userEditions.map((e) => e.editionId));

  const renderEditionRow = (edition: EditionDto) => {
    const isOnShelf = userEditionIds.has(edition.id);

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      form.setValue('editionId', edition.id);
      setTimeout(() => {
        goNext();
      });
    };

    return (
      <Link
        key={edition.id}
        href={`/books/${bookSlug}/${edition.id}`}
        className={`relative flex items-start gap-4 rounded-md p-3 border transition cursor-pointer hover:border-primary/50 bg-card hover:bg-card/50 
   
    `}
      >
        {status === 'authenticated' &&
          (isOnShelf ? (
            <div className="absolute right-4 top-4 z-10 px-3 py-1 rounded-2xl bg-badge-owned text-primary border border-badge-owned-border">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium">Na półce</span>
              </div>
            </div>
          ) : (
            <button
              className="absolute right-4 top-4 bg-badge-new text-secondary-foreground px-3 py-1 rounded-2xl cursor-pointer hover:bg-badge-new-hover"
              onClick={handleClick}
            >
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-medium">Dodaj</span>{' '}
                <Plus size={14} />
              </div>
            </button>
          ))}

        {/* WRAPPER – tylko jego dotyczy opacity dla disabled */}
        <div>
          {edition.coverUrl ? (
            <div className="flex">
              <div className="relative aspect-[2/3] w-24 rounded-md overflow-hidden">
                <Image
                  src={edition.coverUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 5rem"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div className="text-dialog-foreground ms-4 h-full flex flex-col justify-between py-3 mt-8 sm:mt-0">
                <div>
                  <h2 className="leading-tight">
                    <b>{edition.title}</b>
                  </h2>
                </div>

                <div>
                  {edition.publishers?.length > 0 && (
                    <h3 className="text-xs sm:text-sm">
                      Wydawnictwo:{' '}
                      <b>
                        {edition.publishers
                          .map((p) => p.publisher.name)
                          .join(', ')}
                      </b>
                    </h3>
                  )}

                  <h4 className="flex items-center gap-2 text-xs sm:text-sm">
                    Język:{' '}
                    <Emoji>
                      {LANGUAGES.find((l) => l.value === edition.language)
                        ?.icon ?? ''}
                    </Emoji>{' '}
                    (
                    {LANGUAGES.find((l) => l.value === edition.language)
                      ?.label ?? edition.language}
                    )
                  </h4>

                  {edition.publicationDate && (
                    <h4 className="text-xs sm:text-sm">
                      Data wydania:{' '}
                      <b>
                        {new Date(edition.publicationDate).toLocaleDateString(
                          'pl-PL',
                          {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          }
                        )}
                      </b>
                    </h4>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-lg">
              Brak okładki
            </div>
          )}
        </div>
      </Link>
    );
  };

  return (
    <FormField
      control={form.control}
      name="editionId"
      render={({ field }) => (
        <FormItem>
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
            {editions.map((edition) => renderEditionRow(edition))}
          </RadioGroup>
        </FormItem>
      )}
    />
  );
};

export default ChooseEditonComponent;

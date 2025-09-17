'use client';

import { EditionDto, UserEditionDto } from '@/lib/userbooks';
import Image from 'next/image';
import { LANGUAGES } from '@/app/admin/data';
import Emoji from '@/components/shared/Emoji';
import { RadioGroup } from '@/components/ui/radio-group';
import { FormField, FormItem } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { LibraryBig, Plus } from 'lucide-react';

const ChooseEditonComponent = ({
  editions,
  userEditions = [],
  goNext,
}: {
  editions: EditionDto[];
  userEditions?: UserEditionDto[];
  goNext: () => void;
}) => {
  const form = useFormContext<{ editionId: string }>();

  const userEditionIds = new Set(userEditions.map((e) => e.editionId));

  const renderEditionRow = (edition: EditionDto) => {
    const isOnShelf = userEditionIds.has(edition.id);

    const handleClick = () => {
      form.setValue('editionId', edition.id);
      setTimeout(() => {
        goNext();
      });
    };
    return (
      <div
        key={edition.id}
        className={`relative flex items-start gap-4 rounded-md p-3 border transition cursor-pointer hover:border-primary/50 bg-white/50 hover:bg-white/50 
   
    `}
      >
        {isOnShelf ? (
          <div className="absolute right-4 top-4 z-10 bg-badge-owned text-primary-foreground px-3 py-1 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-sm">Na półce</span>
              <LibraryBig size={16} />
            </div>
          </div>
        ) : (
          <button
            className="absolute right-4 top-4 bg-badge-new text-secondary-foreground px-3 py-1 rounded-2xl cursor-pointer hover:bg-badge-new-hover"
            onClick={handleClick}
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">Dodaj</span> <Plus size={16} />
            </div>
          </button>
        )}

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

              <div className="text-dialog-foreground ms-4 h-full flex flex-col justify-between py-3">
                <div>
                  <h2 className="leading-tight">
                    <b>{edition.title}</b>
                  </h2>
                  {edition.subtitle && (
                    <h3 className="text-sm text-foreground">
                      {edition.subtitle}
                    </h3>
                  )}
                </div>

                <div>
                  {edition.publishers?.length > 0 && (
                    <h3 className="text-sm">
                      Wydawnictwo:{' '}
                      <b>
                        {edition.publishers
                          .map((p) => p.publisher.name)
                          .join(', ')}
                      </b>
                    </h3>
                  )}

                  <h4 className="flex items-center gap-2 text-sm">
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
                    <h4 className="text-sm">
                      Data wydania:{' '}
                      <b>
                        {new Date(edition.publicationDate).toLocaleDateString(
                          'pl-PL',
                          {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          }
                        )}
                      </b>
                    </h4>
                  )}

                  {edition.isbn13 && (
                    <h4 className="text-sm">ISBN13: {edition.isbn13}</h4>
                  )}
                  {edition.isbn10 && (
                    <h4 className="text-sm">ISBN10: {edition.isbn10}</h4>
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
      </div>
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

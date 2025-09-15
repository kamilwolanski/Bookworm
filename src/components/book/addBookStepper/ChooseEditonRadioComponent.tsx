'use client';

import { EditionDto, UserEditionDto } from '@/lib/userbooks';
import { AddBookToShelfInput } from '@/lib/validations/addBookToShelfValidation';
import Image from 'next/image';
import { LANGUAGES } from '@/app/admin/data';
import Emoji from '@/components/shared/Emoji';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { FormField, FormItem } from '@/components/ui/form';
import { ControllerRenderProps, UseFormReturn } from 'react-hook-form';
import { Check, LibraryBig } from 'lucide-react';

const ChooseEditonRadioComponent = ({
  form,
  editions,
  userEditions = [],
}: {
  form: UseFormReturn<AddBookToShelfInput>;
  editions: EditionDto[];
  userEditions?: UserEditionDto[];
}) => {
  const userEditionIds = new Set(userEditions.map((e) => e.editionId));

  const renderEditionRow = (
    edition: EditionDto,
    field: ControllerRenderProps<AddBookToShelfInput, 'editionId'>
  ) => {
    const isOnShelf = userEditionIds.has(edition.id);
    const isDisabled = isOnShelf;
    const isSelected = field.value === edition.id;

    const radioId = `edition-${edition.id}`;
    return (
      <Label
        key={edition.id}
        htmlFor={radioId}
        className={`relative flex items-start gap-4 rounded-md p-3 border transition
    ${isSelected ? 'border-primary bg-primary/20' : 'border-muted bg-white/50'}
    ${isDisabled ? 'pointer-events-none' : 'cursor-pointer hover:border-primary/50'}`}
      >
        {/* BADGES – poza wrapperem z opacity, więc zawsze w 100% widoczne */}
        {isSelected && (
          <div className="absolute top-4 right-4 bg-primary text-white rounded-full p-1 z-10">
            <Check size={14} strokeWidth={3} />
          </div>
        )}

        {isOnShelf && (
          <div className="absolute right-4 top-4 z-10 bg-badge-owned text-primary-foreground px-3 py-1 rounded-2xl">
            <div className="flex items-center gap-2">
              <span className="text-sm">Na półce</span>
              <LibraryBig size={16} />
            </div>
          </div>
        )}

        {/* WRAPPER – tylko jego dotyczy opacity dla disabled */}
        <div className={isDisabled ? 'opacity-50' : ''}>
          <RadioGroupItem
            id={radioId}
            value={edition.id}
            className="hidden"
            disabled={isDisabled}
            type="button"
          />

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
      </Label>
    );
  };

  return (
    <FormField
      control={form.control}
      name="editionId"
      render={({ field }) => (
        <FormItem>
          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
            {editions.map((edition) => renderEditionRow(edition, field))}
          </RadioGroup>
        </FormItem>
      )}
    />
  );
};

export default ChooseEditonRadioComponent;

'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { EditionDto, UserEditionDto } from '@/lib/userbooks';
import Image from 'next/image';
import { LANGUAGES } from '@/app/admin/data';
import Emoji from '@/components/shared/Emoji';

const OpenBookDialog = ({
  editions,
  dialogTitle,
  handleAdd,
  onlyContent = false,
  userEditions = [],
}: {
  editions: EditionDto[];
  dialogTitle: string;
  handleAdd: (editionId: string) => void;
  onlyContent?: boolean;
  userEditions?: UserEditionDto[];
}) => {
  // Zbuduj szybki lookup, czy wydanie jest już na półce
  const userEditionIds = new Set(userEditions.map((e) => e.editionId));

  const renderEditionRow = (edition: EditionDto) => {
    const isOnShelf = userEditionIds.has(edition.id);

    return (
      <div key={edition.id} className="flex justify-between items-center py-2">
        <div className="flex">
          {edition.coverUrl ? (
            <>
              <div className="relative aspect-[2/3] w-24 rounded-md overflow-hidden">
                <Image
                  src={edition.coverUrl}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 5rem"
                  style={{ objectFit: 'contain' }}
                />
              </div>

              <div className="text-dialog-foreground ms-4 mt-2 flex flex-col justify-between py-1">
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
            </>
          ) : (
            <div className="h-full w-full bg-gray-200 flex items-center justify-center rounded-lg">
              Brak okładki
            </div>
          )}
        </div>

        <Button
          className={`mb-15 ${isOnShelf ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
          // variant={isOnShelf ? 'primary' : 'default'}
          disabled={isOnShelf}
          aria-disabled={isOnShelf}
          title={
            isOnShelf
              ? 'To wydanie jest już na Twojej półce'
              : 'Dodaj to wydanie do półki'
          }
          onClick={() => {
            if (!isOnShelf) handleAdd(edition.id);
          }}
        >
          {isOnShelf ? 'Na półce' : 'Dodaj'}
        </Button>
      </div>
    );
  };

  const Content = (
    <DialogContent
      className="sm:max-w-[625px] p-6 rounded-2xl
      border border-border
      shadow-2xl
      bg-background/95 backdrop-blur
      supports-[backdrop-filter]:bg-background/80 "
    >
      <DialogHeader>
        <DialogTitle className="text-xl font-semibold tracking-tight text-dialog-foreground">
          {dialogTitle}
        </DialogTitle>
        <Separator />
      </DialogHeader>

      {editions.map(renderEditionRow)}

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" className="cursor-pointer">
            Zamknij
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  );

  if (onlyContent) {
    return Content;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="bg-badge-new text-secondary-foreground px-3 py-1 rounded-2xl cursor-pointer">
          <div className="flex items-center gap-2">
            <span className="text-sm">Dodaj</span> <Plus size={16} />
          </div>
        </button>
      </DialogTrigger>
      {Content}
    </Dialog>
  );
};

export default OpenBookDialog;

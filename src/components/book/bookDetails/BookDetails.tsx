'use client';

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { Badge } from '@/components/ui/badge';
import {
  Star,
  BookOpen,
  Clock,
  CheckCircle,
  XCircle,
  Plus,
  Minus,
} from 'lucide-react';
import { genreColorMap } from '@/lib/genreColorMap';
import { Button } from '@/components/ui/button';
import { StarRating } from '@/components/book/StarRating';
import { Separator } from '@/components/ui/separator';
import Emoji from '@/components/shared/Emoji';
import { LANGUAGES } from '@/app/admin/data';
import { MediaFormat, ReadingStatus } from '@prisma/client';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import React from 'react';
import {
  addBookToShelfBasicAction,
  changeBookStatusAction,
  removeBookFromShelfAction,
} from '@/app/(main)/books/actions/bookActions';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from '@/components/ui/select';
import { useOptimisticShelf } from '@/lib/optimistics/useOptimisticShelf';
import { useOptimisticReadingStatus } from '@/lib/optimistics/useOptimisticReadingStatus';
import RateBookDialog from '@/components/book/ratebook/RateBookDialog';
import LoginDialog from '@/components/auth/LoginDialog';
import useSWR from 'swr';
import { BookDetailsDto } from '@/lib/books';
import { UserEditionData } from '@/lib/user';

const MediaFormatLabels: Record<MediaFormat, string> = {
  [MediaFormat.HARDCOVER]: 'Twarda oprawa',
  [MediaFormat.PAPERBACK]: 'Miękka oprawa',
  [MediaFormat.EBOOK]: 'E-book',
  [MediaFormat.AUDIOBOOK]: 'Audiobook',
};

const statusConfig: Record<
  ReadingStatus,
  {
    label: string;
    color: string;
    icon: LucideIcon;
  }
> = {
  WANT_TO_READ: {
    label: 'Chcę przeczytać',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
    icon: Clock,
  },
  READING: {
    label: 'Obecnie czytam',
    color: 'bg-orange-100 text-orange-700 border-orange-200',
    icon: BookOpen,
  },
  READ: {
    label: 'Przeczytane',
    color: 'bg-green-100 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  ABANDONED: {
    label: 'Porzucone',
    color: 'bg-gray-100 text-gray-700 border-gray-200',
    icon: XCircle,
  },
};

const BookDetails = ({ bookData }: { bookData: BookDetailsDto }) => {
  const { book, edition, publishers } = bookData;
  const { status } = useSession();
  const shouldFetch = status === 'authenticated';
  const swrKey = shouldFetch ? `/api/user/editions/${edition.id}` : null;

  const { data: userData, isLoading: userStateIsLoading } =
    useSWR<UserEditionData>(swrKey);
  const onShelf = Boolean(userData);
  const readingStatus = userData?.readingStatus;
  const userRating = userData?.userRating;
  const {
    statusOpt,
    isPending: isChangingOpt,
    change,
  } = useOptimisticReadingStatus(readingStatus);
  const { onShelfOptimistic, isPending, toggle } = useOptimisticShelf(onShelf);

  const handleToggle = () => {
    if (onShelfOptimistic) {
      toggle('remove', () =>
        removeBookFromShelfAction({
          bookId: book.id,
          editionId: edition.id,
        })
      );
    } else {
      toggle('add', () =>
        addBookToShelfBasicAction({
          bookId: book.id,
          editionId: edition.id,
        })
      );
    }
  };

  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-4 sm:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {edition.coverUrl ? (
            <Image
              src={edition.coverUrl}
              alt={edition.title}
              width={320}
              height={420}
              className="rounded-md object-cover mx-auto"
            />
          ) : (
            <div className="w-[266px] h-[400px] rounded-md flex items-center justify-center text-sm text-muted-foreground">
              Brak okładki
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-2 sm:gap-3 mb-2">
              <h2 className="text-lg font-semibold flex-1">{edition.title}</h2>
              <Badge
                variant={onShelfOptimistic ? 'default' : 'secondary'}
                className={`${
                  onShelfOptimistic
                    ? 'border border-badge-owned-border bg-badge-owned text-primary'
                    : 'bg-badge-not-on-shelf text-badge-not-on-shelf-foreground border-badge-not-on-shelf-border'
                } font-medium`}
              >
                {onShelfOptimistic ? 'Na półce' : 'Poza półką'}
              </Badge>
              {onShelfOptimistic && statusOpt && (
                <Badge
                  variant="secondary"
                  className={`${statusConfig[statusOpt].color} font-medium flex items-center gap-1`}
                >
                  {React.createElement(statusConfig[statusOpt].icon, {
                    className: 'w-3 h-3',
                  })}
                  {statusConfig[statusOpt].label}
                </Badge>
              )}
            </div>
            {edition.subtitle && <h3>{edition.subtitle}</h3>}
            <div className="mt-3">
              {book.authors.map((a, i) => (
                <div key={i}>
                  <Link
                    key={a.slug}
                    href={`/author/${a.slug}`}
                    className="underline underline-offset-2 text-link hover:text-link-hover"
                  >
                    {a.name}
                  </Link>
                  {i < book.authors.length - 1 && ', '}
                </div>
              ))}
            </div>

            {book.genres && (
              <div className="mt-4">
                {book.genres?.map((genre, index) => {
                  return (
                    <Badge
                      key={genre.slug}
                      className={`${index > 0 ? 'ms-2' : ''} ${genreColorMap[genre.slug]}`}
                    >
                      {genre.name}
                    </Badge>
                  );
                })}
              </div>
            )}
            <div className="mt-3 flex items-center gap-3">
              <p>
                <b>Twoja ocena: </b>
              </p>
              {status === 'authenticated' ? (
                <StarRating
                  rating={userRating ?? 0}
                  interactive
                  bookId={book.id}
                  editionId={edition.id}
                  bookSlug={book.slug}
                />
              ) : (
                <LoginDialog
                  dialogTriggerBtn={
                    <button type="button" className="relative flex">
                      {Array.from({ length: 5 }, (_, index) => (
                        <Star
                          key={index}
                          className="w-6 h-6 text-gray-300 cursor-pointer"
                        />
                      ))}
                    </button>
                  }
                />
              )}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <StarRating rating={book.averageRating ?? 0} />
              <span className="font-medium">{book.averageRating}</span>
              <span className="text-muted-foreground">
                ({book.ratingCount ?? 0} ocen)
              </span>
            </div>
            {onShelfOptimistic && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Status Czytania
                </label>
                <Select
                  value={statusOpt ?? undefined}
                  disabled={isChangingOpt || isPending}
                  onValueChange={(value) =>
                    change(value as ReadingStatus, () =>
                      changeBookStatusAction({
                        bookId: book.id,
                        editionId: edition.id,
                        readingStatus: value as ReadingStatus,
                      })
                    )
                  }
                >
                  <SelectTrigger className="w-52">
                    <SelectValue placeholder="Wybierz status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WANT_TO_READ">
                      Chcę przeczytać
                    </SelectItem>
                    <SelectItem value="READING">Obecnie czytam</SelectItem>
                    <SelectItem value="READ">Przeczytane</SelectItem>
                    <SelectItem value="ABANDONED">Porzucone</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className="flex gap-3 mt-5">
              {status === 'authenticated' ? (
                <Button
                  className="cursor-pointer bg-badge-new text-secondary-foreground hover:bg-badge-new-hover"
                  onClick={handleToggle}
                  disabled={isPending || isChangingOpt}
                >
                  {onShelfOptimistic ? (
                    <>
                      <Minus className="w-4 h-4 mr-1" />
                      Usuń z półki
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-1" />
                      Dodaj na półkę
                    </>
                  )}
                </Button>
              ) : (
                <LoginDialog
                  dialogTriggerBtn={
                    <Button className="cursor-pointer bg-badge-new text-secondary-foreground hover:bg-badge-new-hover">
                      <Plus className="w-4 h-4 mr-1" />
                      Dodaj na półkę
                    </Button>
                  }
                />
              )}
              {status === 'authenticated' ? (
                <RateBookDialog
                  bookId={book.id}
                  editionId={edition.id}
                  dialogTitle={`Napisz opinie o : ${edition.title}`}
                  userReview={undefined}
                >
                  <Button
                    variant="outline"
                    className="bg-sidebar cursor-pointer"
                  >
                    <Star className="w-4 h-4 mr-1" />
                    {/* {userBook?.userReview ? 'Edytuj ocenę' : 'Oceń'} */}
                  </Button>
                </RateBookDialog>
              ) : (
                <LoginDialog
                  dialogTriggerBtn={
                    <Button
                      variant="outline"
                      className="bg-sidebar cursor-pointer"
                    >
                      <Star className="w-4 h-4 mr-1" />
                      oceń
                    </Button>
                  }
                />
              )}
            </div>
          </div>
          <Separator className="mt-5" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4">
            <div className="space-y-2">
              {edition.format && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Format:</span>
                  <span>{MediaFormatLabels[edition.format]}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Język:</span>
                <span className="flex gap-2">
                  <Emoji>
                    {LANGUAGES.find((l) => l.value === edition.language)
                      ?.icon ?? ''}
                  </Emoji>{' '}
                  (
                  {LANGUAGES.find((l) => l.value === edition.language)?.label ??
                    edition.language}
                  )
                </span>
              </div>
              {edition.publicationDate && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Data wydania:</span>
                  <span>
                    {new Date(edition.publicationDate).toLocaleDateString(
                      'pl-PL',
                      {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                      }
                    )}
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Liczba stron:</span>
                <span>{edition.pageCount}</span>
              </div>
              {edition.isbn13 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ISBN 13:</span>
                  <span className="text-sm">{edition.isbn13}</span>
                </div>
              )}
              {edition.isbn10 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ISBN 10:</span>
                  <span className="text-sm">{edition.isbn10}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wydawca:</span>
                {publishers.map((p) => (
                  // <Link
                  //   key={p.slug}
                  //   href={`/publisher/${p.slug}`}
                  //   className="underline underline-offset-2 text-link hover:text-link-hover"
                  // >
                  <span key={p.slug}>{p.name}</span>
                  // </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;

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
import { StarRating } from '@/components/book/starRating/StarRating';
import { Separator } from '@/components/ui/separator';
import Emoji from '@/components/shared/Emoji';
import { LANGUAGES } from '@/app/admin/data';
import { MediaFormat, ReadingStatus } from '@prisma/client';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import React, { Suspense, useTransition } from 'react';
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
import RateBookDialog from '@/components/book/ratebook/RateBookDialog';
import LoginDialog from '@/components/auth/LoginDialog';
import useSWR from 'swr';
import { BookDetailsDto } from '@/lib/books';
import { UserEditionData } from '@/lib/user';
import { Skeleton } from '@/components/ui/skeleton';
import StarRatingPlaceholder from '../starRating/StarRatingPlaceholder';
import { useUserReview } from '@/app/hooks/user/reviews/useUserReview';
import { BookRatingResponse } from '@/lib/books/rating';

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
  const sessionIsLoading = status === 'loading';
  const swrKey = shouldFetch ? `/api/user/editions/${edition.id}` : null;
  const {
    data: userData,
    isLoading: userStateIsLoading,
    mutate,
  } = useSWR<UserEditionData>(swrKey);
  const {
    userEditionReview,
    loading: userReviewLoading,
    userReviewMutate,
  } = useUserReview(book.id, edition.id);

  const { data: bookRating, isLoading: bookRatingLoading } =
    useSWR<BookRatingResponse>(`/api/books/${book.slug}/rating`);
  console.log('Book rating data:', bookRating);
  const onShelf = userData?.isOnShelf;
  const readingStatus = userData?.readingStatus;
  const userRating = userEditionReview?.rating;
  const [isPending, startTransition] = useTransition();

  const handleToggle = async () => {
    if (onShelf) {
      const prev = structuredClone(userData);

      mutate((current) => {
        if (current) {
          return { ...current, isOnShelf: false, readingStatus: null };
        }

        return current;
      }, false);

      startTransition(async () => {
        try {
          const res = await removeBookFromShelfAction({
            bookId: book.id,
            editionId: edition.id,
          });

          if (res.isError) {
            mutate(() => prev, false);
          }
        } catch {
          mutate(() => prev, false);
        }
      });
    } else {
      const prev = structuredClone(userData);

      mutate((current) => {
        if (current) {
          return { ...current, isOnShelf: true, readingStatus: 'WANT_TO_READ' };
        }

        return current;
      }, false);

      startTransition(async () => {
        try {
          const res = await addBookToShelfBasicAction({
            bookId: book.id,
            editionId: edition.id,
          });
          if (res.isError) {
            mutate(() => prev, false);
          }
        } catch {
          mutate(() => prev, false);
        }
      });
    }
  };

  const changeStatus = async (status: ReadingStatus) => {
    const prev = structuredClone(userData);
    mutate((current) => {
      if (current) {
        return { ...current, readingStatus: status };
      }

      return current;
    }, false);

    try {
      const res = await changeBookStatusAction({
        bookId: book.id,
        editionId: edition.id,
        readingStatus: status,
      });

      if (res.isError) {
        mutate(() => prev, false);
      }
    } catch {
      mutate(() => prev, false);
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
            <div className="w-[320px] h-[420px] rounded-md flex items-center justify-center text-sm text-muted-foreground">
              Brak okładki
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-2 sm:gap-3 mb-2">
              <h2 className="text-lg font-semibold flex-1">{edition.title}</h2>
              {(sessionIsLoading || userStateIsLoading) && (
                <div className="flex gap-2">
                  <Skeleton className="border w-[67px] h-[22px]" />
                  <Skeleton className="border w-[120px] h-[22px]" />
                </div>
              )}

              {!sessionIsLoading && !userStateIsLoading && (
                <>
                  <Badge
                    variant={onShelf ? 'default' : 'secondary'}
                    className={`${
                      onShelf
                        ? 'border border-badge-owned-border bg-badge-owned text-primary'
                        : 'bg-badge-not-on-shelf text-badge-not-on-shelf-foreground border-badge-not-on-shelf-border'
                    } font-medium`}
                  >
                    {onShelf ? 'Na półce' : 'Poza półką'}
                  </Badge>
                  {onShelf && readingStatus && (
                    <Badge
                      variant="secondary"
                      className={`${statusConfig[readingStatus].color} font-medium flex items-center gap-1`}
                    >
                      {React.createElement(statusConfig[readingStatus].icon, {
                        className: 'w-3 h-3',
                      })}
                      {statusConfig[readingStatus].label}
                    </Badge>
                  )}
                </>
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
              {(sessionIsLoading || userReviewLoading) && (
                <StarRatingPlaceholder />
              )}
              {!sessionIsLoading && !userReviewLoading && (
                <>
                  {status === 'authenticated' ? (
                    <Suspense fallback={<StarRatingPlaceholder />}>
                      <StarRating
                        rating={userRating ?? 0}
                        interactive
                        bookId={book.id}
                        editionId={edition.id}
                        bookSlug={book.slug}
                        userReviewMutate={userReviewMutate}
                      />
                    </Suspense>
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
                </>
              )}
            </div>
            <div className="flex items-center gap-2 mt-4">
              {bookRatingLoading && <StarRatingPlaceholder />}
              {!bookRatingLoading && bookRating && (
                <>
                  <Suspense>
                    <StarRating rating={bookRating.averageRating ?? 0} />
                  </Suspense>
                  <span className="font-medium">
                    {bookRating.averageRating}
                  </span>
                  <span className="text-muted-foreground">
                    ({bookRating.ratingCount ?? 0} ocen)
                  </span>
                </>
              )}
            </div>
            {(sessionIsLoading || userStateIsLoading) && (
              <div className="mt-3">
                <Skeleton className="h-5 mb-2 w-[100px]" />
                <Skeleton className="h-9 w-52" />
              </div>
            )}
            {onShelf && (
              <div className="mt-3">
                <label className="block text-sm font-medium text-muted-foreground mb-2">
                  Status Czytania
                </label>
                <Select
                  value={readingStatus ?? undefined}
                  disabled={isPending}
                  onValueChange={(value) =>
                    changeStatus(value as ReadingStatus)
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
            {(sessionIsLoading || userStateIsLoading) && (
              <div className="mt-5 flex gap-3">
                <Skeleton className="h-9 w-[130px] bg-badge-new" />
                <Skeleton className="h-9 w-[135px] border bg-white shadow-xs hover:bg-gray-100 text-accent-2 dark:bg-input/30 dark:border-input dark:hover:bg-input/50" />
              </div>
            )}
            {!sessionIsLoading && !userStateIsLoading && (
              <div className="">
                {status === 'authenticated' ? (
                  <div className="flex mt-5 gap-3">
                    <Button
                      className="cursor-pointer bg-badge-new text-secondary-foreground hover:bg-badge-new-hover"
                      onClick={handleToggle}
                      disabled={isPending}
                    >
                      {onShelf ? (
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
                    <RateBookDialog
                      bookId={book.id}
                      bookSlug={book.slug}
                      editionId={edition.id}
                      dialogTitle={`Napisz opinie o : ${edition.title}`}
                      userReview={userEditionReview}
                    >
                      <Button variant="outline" className="cursor-pointer">
                        <Star className="w-4 h-4 mr-1" />
                        {userRating ? 'Edytuj ocenę' : 'Oceń'}
                      </Button>
                    </RateBookDialog>
                  </div>
                ) : (
                  <div className="flex mt-5 gap-3">
                    <LoginDialog
                      dialogTriggerBtn={
                        <Button className="cursor-pointer bg-badge-new text-secondary-foreground hover:bg-badge-new-hover">
                          <Plus className="w-4 h-4 mr-1" />
                          Dodaj na półkę
                        </Button>
                      }
                    />
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
                  </div>
                )}
              </div>
            )}
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

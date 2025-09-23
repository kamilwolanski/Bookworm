'use client';

import Image from 'next/image';
import { Badge } from '../../ui/badge';
import { Minus, Plus, Star } from 'lucide-react';
import { genreColorMap } from '@/lib/genreColorMap';
import { Button } from '../../ui/button';
import { BookDetailsDto } from '@/lib/userbooks';
import { useState } from 'react';
import { StarRating } from '../StarRating';
import { Separator } from '../../ui/separator';
import Emoji from '../../shared/Emoji';
import { LANGUAGES } from '@/app/admin/data';
import { MediaFormat } from '@prisma/client';
import Link from 'next/link';

const MediaFormatLabels: Record<MediaFormat, string> = {
  [MediaFormat.HARDCOVER]: 'Twarda oprawa',
  [MediaFormat.PAPERBACK]: 'Miękka oprawa',
  [MediaFormat.EBOOK]: 'E-book',
  [MediaFormat.AUDIOBOOK]: 'Audiobook',
};

const BookDetails = ({ bookData }: { bookData: BookDetailsDto }) => {
  const [userRating, setUserRating] = useState(4);

  const { book, edition, publishers } = bookData;
  const onShelf = true;

  return (
    <div className="bg-sidebar shadow-lg rounded-xl p-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          {edition.coverUrl ? (
            <Image
              src={edition.coverUrl}
              alt={edition.title}
              width={280}
              height={420}
              className="rounded-md object-cover mx-auto"
            />
          ) : (
            <div className="w-[266px] h-[400px] rounded-md flex items-center justify-center text-sm text-muted-foreground">
              No Cover
            </div>
          )}
        </div>

        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex items-start gap-3 mb-2">
              <h2 className="text-lg font-semibold flex-1">{edition.title}</h2>
              <Badge
                variant={onShelf ? 'default' : 'secondary'}
                className={`${
                  onShelf
                    ? 'bg-green-100 text-green-700 border-green-200'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                } font-medium`}
              >
                {onShelf ? 'Na półce' : 'Nie na półce'}
              </Badge>
            </div>
            {edition.subtitle && <h3>{edition.subtitle}</h3>}
            <div className="mt-3">
              {book.authors.map((a) => (
                <Link
                  key={a.slug}
                  href={`/author/${a.slug}`}
                  className="underline underline-offset-2 text-link hover:text-link-hover"
                >
                  {a.name}
                </Link>
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
            <div className="mt-5 flex items-center gap-3">
              <p>
                <b>Twoja ocena: </b>
              </p>
              <StarRating
                rating={userRating}
                interactive
                onRatingChange={setUserRating}
              />
            </div>
            <div className="flex items-center gap-2 mt-4">
              <StarRating rating={4} />
              <span className="font-medium">4,3</span>
              <span className="text-muted-foreground">(2013 reviews)</span>
            </div>
            <div className="flex gap-3 mt-5">
              <Button className="bg-green-600 hover:bg-green-700 cursor-pointer">
                {onShelf ? (
                  <>
                    <Minus className="w-4 h-4 mr-2" />
                    Remove from Shelf
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Dodaj do półki
                  </>
                )}
              </Button>
              <Button variant="outline" className="cursor-pointer">
                <Star className="w-4 h-4 mr-2" />
                Oceń
              </Button>
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
                        month: 'long',
                        day: 'numeric',
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
              <div className="flex justify-between">
                <span className="text-muted-foreground">ISBN 13:</span>
                <span className="text-sm">{edition.isbn13}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Wydawca:</span>
                {publishers.map((p) => (
                  <Link
                    key={p.slug}
                    href={`/publisher/${p.slug}`}
                    className="underline underline-offset-2 text-link hover:text-link-hover"
                  >
                    {p.name}
                  </Link>
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

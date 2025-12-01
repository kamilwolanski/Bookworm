'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MultiSelect } from '@/components/ui/multi-select';
import { GenreDTO } from '@/lib/books';

const GenreFilter = ({
  bookGenres,
  genresParams,
}: {
  bookGenres: GenreDTO[];
  genresParams: string[];
}) => {
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());

  const genreIds = genresParams
    .map((slug) => {
      const match = bookGenres.find((g) => g.slug === slug);
      return match?.id;
    })
    .filter(Boolean) as string[];
  const [selectedGenres, setSelectedGenres] = useState<string[]>(genreIds);
  const router = useRouter();
  const genresList = bookGenres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  const removeSelected = (id: string) => {
    const filtered = selectedGenres.filter((g) => g !== id);
    updateSelectedGenres(filtered);
  };

  const updateSelectedGenres = (newGenres: string[]) => {
    if (newGenres.length > 0) {
      const selectedNames = newGenres
        .map((id) =>
          bookGenres.find((genre) => genre.id === id)?.slug.toLowerCase()
        )
        .filter(Boolean);

      params.set('genre', selectedNames.join(','));
      params.set('page', '1');
    } else {
      params.delete('genre');
      params.set('page', '1');
    }

    setSelectedGenres(newGenres);
    router.push(`?${params.toString()}`);
  };

  const removeAllSelected = () => {
    updateSelectedGenres([]);
  };

  return (
    <div className="bg-sidebar shadow-xl rounded-xl px-5">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Gatunki
          </AccordionTrigger>

          <AccordionContent className="">
            <div className="mb-2">
              {selectedGenres.map((value) => {
                const option = bookGenres.find((o) => o.id === value);
                if (option)
                  return (
                    <Badge key={value} className="mb-3 mx-1">
                      {option?.name}

                      <XCircle
                        style={{ pointerEvents: 'auto' }}
                        className="ml-2 h-6 w-6 cursor-pointer"
                        onClick={() => {
                          removeSelected(option.id);
                        }}
                      />
                    </Badge>
                  );
              })}

              {selectedGenres.length > 0 && (
                <Badge className="mb-3 mx-1">
                  Usuń wszystkie
                  <XCircle
                    style={{ pointerEvents: 'auto' }}
                    className="ml-2 h-6 w-6 cursor-pointer"
                    onClick={() => {
                      removeAllSelected();
                    }}
                  />
                </Badge>
              )}
            </div>
            <MultiSelect
              options={genresList}
              onValueChange={updateSelectedGenres}
              value={selectedGenres}
              placeholder="Wybierz gatunek"
              variant="inverted"
              animation={0}
              modalPopover
              showSelectedValues={false}
              className="cursor-pointer dark:bg-input/30 bg-input"
              contentClassName="w-90"
            />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default GenreFilter;

"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { MultiSelect } from "@/components/ui/multi-select";
import { XCircle } from "lucide-react";
import { GenreDTO } from "@/lib/books";

type Props = {
  bookGenres: GenreDTO[];
  value?: string[];
  onChange: (value: string[]) => void;
};

export default function GenreFilter({
  bookGenres,
  value = [],
  onChange,
}: Props) {
  const genresList = bookGenres.map((genre) => ({
    value: genre.slug,
    label: genre.name,
  }));

  const removeSelected = (id: string) => {
    onChange(value.filter((g) => g !== id));
  };

  const removeAllSelected = () => {
    onChange([]);
  };

  return (
    <div className="bg-sidebar shadow-xl rounded-xl px-5">
      <Accordion type="single" collapsible defaultValue="genres">
        <AccordionItem value="genres">
          <AccordionTrigger className="cursor-pointer hover:no-underline">
            Gatunki
          </AccordionTrigger>

          <AccordionContent>
            <div className="mb-2">
              {value.map((slug) => {
                console.log('value', value)
                const option = bookGenres.find((g) => g.slug === slug);
                console.log('option', option)
                if (!option) return null;

                return (
                  <Badge key={slug} className="mb-3 mx-1 cursor-pointer" onClick={() => removeSelected(slug)}>
                    {option.name}

                    <XCircle
                      style={{ pointerEvents: "auto" }}
                      className="ml-2 h-6 w-6 cursor-pointer"
                      
                    />
                  </Badge>
                );
              })}

              {value.length > 0 && (
                <Badge
                  className="mb-3 mx-1 cursor-pointer"
                  onClick={removeAllSelected}
                >
                  Usuń wszystkie
                  <XCircle className="ml-2 h-5 w-5" />
                </Badge>
              )}
            </div>

            <MultiSelect
              options={genresList}
              value={value}
              onValueChange={onChange}
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
}

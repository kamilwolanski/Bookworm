'use client';

import { bookSchema, BookInput } from '@/lib/validations/createBookValidation';
import { useActionForm } from '@/app/hooks/useActionForm';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { UseFormReturn } from 'react-hook-form';
import { updateBookAction } from '@/app/admin/books/actions/bookActions';
import { PersonOption } from '@/lib/persons';
import { searchPersonsAction } from '@/app/admin/persons/actions/personActions';
import { dedupeByValue } from '@/lib/utils';
import { useDebounced } from '@/app/hooks/useDebounce';
import { format } from 'date-fns';
import { BookBasicDTO } from '@/lib/adminBooks';
import { GenreDTO } from '@/lib/books';

const EditBookForm = ({
  bookGenres,
  onSuccess,
  book,
}: {
  bookGenres: GenreDTO[];
  onSuccess?: () => void;
  book: BookBasicDTO;
}) => {
  const boundAction = updateBookAction.bind(null, book.id);
  const initialAuthorOptions = useMemo<PersonOption[]>(
    () =>
      book.authors.map((a) => ({
        value: a.person.id,
        label: a.person.name,
      })),
    [book.authors]
  );
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query, 250);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    book.genres.map((b) => b.id) ?? []
  );
  const [authorOptions, setAuthorOptions] =
    useState<PersonOption[]>(initialAuthorOptions);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>(
    book.authors.map((a) => a.person.id)
  );
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  const afterSuccess = (form: UseFormReturn<BookInput>) => {
    if (onSuccess) {
      onSuccess();
    }
    setSelectedGenres([]);
    setSelectedAuthors([]);
    setTimeout(() => {
      form.reset();
    }, 500);
  };
  const { form, isPending, handleSubmit } = useActionForm<BookInput>({
    action: boundAction,
    schema: bookSchema,
    defaultValues: {
      title: book.title,
      genres: book.genres.map((b) => b.id),
      authors: book.authors.map((a) => a.person.id),
      firstPublicationDate: book.firstPublicationDate ?? undefined,
    },
    onSuccess: afterSuccess,
  });

  const genresList = bookGenres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  useEffect(() => {
    const q = debounced.trim();

    let cancelled = false;
    setLoadingAuthors(true);

    (async () => {
      try {
        const data = await searchPersonsAction(q, 12);
        if (cancelled) return;
        setAuthorOptions(dedupeByValue([...initialAuthorOptions, ...data]));
      } catch {
        if (!cancelled) setAuthorOptions(initialAuthorOptions);
      } finally {
        if (!cancelled) setLoadingAuthors(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced, initialAuthorOptions]);

  const handleValueAuthorChange = (ids: string[]) => {
    setSelectedAuthors(ids);
    form.setValue('authors', ids);
  };

  const handleGenres = (ids: string[]) => {
    setSelectedGenres(ids);
    form.setValue('genres', ids);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto"
      >
        <div>
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Tytuł książki<span className="text-red-500 ">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Tytuł książki" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid gap-2 mt-3">
              <FormLabel>Autorzy</FormLabel>

              <MultiSelect
                options={authorOptions}
                value={selectedAuthors}
                onValueChange={handleValueAuthorChange}
                searchValue={query}
                onSearchChange={setQuery}
                placeholder="Wybierz autorów"
                searchPlaceholder={
                  loadingAuthors ? 'Szukam…' : 'Wpisz imię i nazwisko'
                }
                maxCount={3}
                showSelectedValues
              />
              {form.formState.errors.authors && (
                <FormMessage>
                  {form.formState.errors.authors.message}
                </FormMessage>
              )}
            </div>
          </div>
        </div>
        <div>
          <div>
            <div className="grid gap-2">
              <FormLabel>Gatunek</FormLabel>

              <MultiSelect
                options={genresList}
                onValueChange={handleGenres}
                value={selectedGenres}
                placeholder="Wybierz gatunek"
                variant="inverted"
                animation={0}
                modalPopover
              />
              {form.formState.errors.genres && (
                <FormMessage>
                  {form.formState.errors.genres.message}
                </FormMessage>
              )}
            </div>

            <FormField
              control={form.control}
              name="firstPublicationDate"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Data pierwszego wydania</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value ? format(field.value, 'yyyy-MM-dd') : ''
                      }
                      onChange={(e) => field.onChange(e.target.value)}
                      placeholder="RRRR-MM-DD"
                      min="100-01-01"
                      max="100-12-31"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="col-span-1 col-start-2">
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" className="cursor-pointer">
                Anuluj
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="cursor-pointer"
            >
              {isPending ? 'Aktualizuje...' : 'Aktualizuj'}
            </Button>
          </DialogFooter>

          {form.formState.errors.root && (
            <p className="text-red-600 text-sm">
              {form.formState.errors.root.message}
            </p>
          )}
        </div>
      </form>
    </Form>
  );
};

export default EditBookForm;

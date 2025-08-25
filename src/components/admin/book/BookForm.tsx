'use client';

import { bookSchema, BookInput } from '@/lib/validation';
import { useActionForm } from '@/app/hooks/useActionForm';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { Textarea } from '../../ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { GenreDTO } from '@/lib/userbooks';
import { UseFormReturn } from 'react-hook-form';
import { createBookAction } from '@/app/admin/books/actions/bookActions';
import { PersonOption } from '@/lib/persons';
import { searchPersonsAction } from '@/app/admin/persons/actions/personActions';
import { useDebounced } from '@/lib/utils';
import { format } from 'date-fns';

export default function BookForm({ bookGenres }: { bookGenres: GenreDTO[] }) {
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query, 250);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [authorOptions, setAuthorOptions] = useState<PersonOption[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [loadingAuthors, setLoadingAuthors] = useState(false);

  const afterSuccess = (form: UseFormReturn<BookInput>) => {
    setOpen(false);
    setSelectedGenres([]);
    setSelectedAuthors([]);
    setTimeout(() => {
      form.reset();
    }, 500);
  };
  const { form, isPending, handleSubmit } = useActionForm<BookInput>({
    action: createBookAction,
    schema: bookSchema,
    defaultValues: {
      title: '',
      genres: [],
    },
    onSuccess: afterSuccess,
  });

  const [open, setOpen] = useState(false);
  const genresList = bookGenres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  useEffect(() => {
    const run = async () => {
      setLoadingAuthors(true);

      try {
        const data = await searchPersonsAction(debounced, 12);
        setAuthorOptions(data);
      } catch {
        setAuthorOptions([]);
      } finally {
        setLoadingAuthors(false);
      }
    };

    run();
  }, [debounced]);

  const handleValueAuthorChange = (ids: string[]) => {
    setSelectedAuthors(ids);
    form.setValue('authors', ids);
  };

  const handleGenres = (ids: string[]) => {
    setSelectedGenres(ids);
    form.setValue('genres', ids);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-black cursor-pointer self-start"
        >
          Dodaj książkę +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową książkę</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać książkę.
          </DialogDescription>
        </DialogHeader>
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
                          min="1800-01-01"
                          max="2100-12-31"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="col-span-2">
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-3">
                    <FormLabel>Opis</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Dodaj opis książki"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                  {isPending ? 'Dodaję...' : 'Dodaj'}
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
      </DialogContent>
    </Dialog>
  );
}

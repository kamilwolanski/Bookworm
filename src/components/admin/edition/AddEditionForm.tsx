'use client';

import { EditionInput, editionSchema } from '@/lib/validation';
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
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { format } from 'date-fns';
import { GenericCombobox } from '@/components/ui/GenericCombobox';
import {
  BOOK_FORMATS,
  BookFormat,
  LanguageCode,
  LANGUAGES,
} from '@/app/admin/data';
import { createEditionAction } from '@/app/admin/books/[slug]/actions/editionActions';
import { MultiSelect } from '@/components/ui/multi-select';
import { PublisherOption } from '@/lib/publishers';
import { useDebounced } from '@/app/hooks/useDebounce';
import { searchPublishersAction } from '@/app/admin/publishers/actions/publisherActions';

export default function BookForm({
  bookId,
  bookSlug,
  setOpen,
}: {
  bookId: string;
  bookSlug: string;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const [query, setQuery] = useState('');
  const debounced = useDebounced(query, 250);
  const [publisherOptions, setPublisherOptions] = useState<PublisherOption[]>(
    []
  );
  const [selectedPublishers, setSelectedPublishers] = useState<string[]>([]);

  const [loadingPublishers, setLoadingPublishers] = useState(false);

  const boundAction = createEditionAction.bind(null, bookId, bookSlug);
  const afterSuccess = (form: UseFormReturn<EditionInput>) => {
    setOpen(false);
    setSelectedPublishers([]);
    setTimeout(() => {
      form.reset();
    }, 500);
  };
  const { form, isPending, handleSubmit } = useActionForm<EditionInput>({
    action: boundAction,
    schema: editionSchema,
    defaultValues: {},
    onSuccess: afterSuccess,
  });

  useEffect(() => {
    const q = debounced.trim();

    let cancelled = false;
    setLoadingPublishers(true);

    (async () => {
      try {
        const data = await searchPublishersAction(q, 12);
        if (cancelled) return;
        setPublisherOptions(data);
      } catch {
        if (!cancelled) setPublisherOptions([]);
      } finally {
        if (!cancelled) setLoadingPublishers(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [debounced]);

  const handleValuePublisherChange = (ids: string[]) => {
    setSelectedPublishers(ids);
    form.setValue('publishers', ids);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-auto"
      >
        <div>
          <div>
            <div className="grid gap-2">
              <FormLabel>Wydawca</FormLabel>

              <MultiSelect
                options={publisherOptions}
                value={selectedPublishers}
                onValueChange={handleValuePublisherChange}
                searchValue={query}
                onSearchChange={setQuery}
                placeholder="Wybierz wydawców"
                searchPlaceholder={
                  loadingPublishers ? 'Szukam…' : 'Wpisz nazwę wydawcy'
                }
                maxCount={3}
                showSelectedValues
              />
              {form.formState.errors.publishers && (
                <FormMessage>
                  {form.formState.errors.publishers.message}
                </FormMessage>
              )}
            </div>
            <FormField
              control={form.control}
              name="file"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Dodaj okładkę</FormLabel>
                  <FormControl>
                    <Input
                      required={false}
                      type="file"
                      accept="image/*"
                      multiple={false}
                      onChange={(e) => field.onChange(e.target.files?.[0])}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="publicationDate"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Data wydania</FormLabel>
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

            <FormField
              control={form.control}
              name="format"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Format</FormLabel>
                  <FormControl>
                    <GenericCombobox<BookFormat>
                      items={BOOK_FORMATS}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Wybierz format..."
                      emptyText="Brak formatów."
                      searchable={false}
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn13"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>isbn13</FormLabel>
                  <FormControl>
                    <Input placeholder="isbn13" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tytuł</FormLabel>
                  <FormControl>
                    <Input placeholder="Tytuł" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Podtytuł</FormLabel>
                  <FormControl>
                    <Input placeholder="Podtytuł" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="pageCount"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Liczba stron</FormLabel>
                  <FormControl>
                    <Input placeholder="Podtytuł" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Język</FormLabel>
                  <FormControl>
                    <GenericCombobox<LanguageCode>
                      items={LANGUAGES}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Wybierz format..."
                      searchPlaceholder="Szukaj język..."
                      emptyText="Brak formatów."
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn10"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>isbn10</FormLabel>
                  <FormControl>
                    <Input placeholder="isbn10" {...field} />
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
  );
}

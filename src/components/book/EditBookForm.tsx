/* eslint-disable react-hooks/exhaustive-deps */
import { editBookAction } from '@/app/(dashboard)/books/actions';
import { useActionForm } from '@/app/hooks/useActionForm';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { DialogClose, DialogFooter } from '@/components/ui/dialog';

import { BookInput, bookSchema } from '@/lib/validation';
import { BookDTO, GenreDTO } from '@/lib/books';
import { MultiSelect } from '../ui/multi-select';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';

const EditBookForm = ({
  closeDialog,
  bookGenres,
  bookData,
}: {
  closeDialog: () => void;
  bookGenres: GenreDTO[];
  bookData: BookDTO;
}) => {
  console.log('bookdata', bookData);
  const [selectedGenres, setSelectedGenres] = useState<string[]>(
    bookData.genres?.map((genre) => genre.id) ?? []
  );
  const { form, isPending, handleSubmit } = useActionForm<BookInput>({
    action: editBookAction,
    schema: bookSchema,
    defaultValues: {
      id: bookData.id,
      title: bookData.title,
      author: bookData.author,
      pageCount: bookData.pageCount ?? undefined,
      publicationYear: bookData.publicationYear ?? undefined,
      readingStatus: bookData.readingStatus,
      rating: bookData.rating ?? undefined,
      description: bookData.description ?? undefined,
      imagePublicId: bookData.imagePublicId ?? undefined,
    },
    onSuccess: closeDialog,
  });
  const readingStatus = form.watch('readingStatus');

  const genresList = bookGenres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  useEffect(() => {
    form.setValue('genres', selectedGenres);
    // console.log('form', form.getValues());
  }, [selectedGenres]);

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
              name="file"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dodaj obrazek</FormLabel>
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
              name="title"
              render={({ field }) => (
                <FormItem className="mt-3">
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

            <FormField
              control={form.control}
              name="author"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>
                    Autor<span className="text-red-500 ">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Autor" {...field} />
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
                    <Input
                      placeholder="Liczba stron"
                      {...field}
                      type="number"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <div>
            <div className="grid gap-2">
              <FormLabel>Gatunek</FormLabel>

              <MultiSelect
                options={genresList}
                onValueChange={setSelectedGenres}
                defaultValue={selectedGenres}
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
              name="publicationYear"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Rok wydania</FormLabel>
                  <FormControl>
                    <Input placeholder="Rok wydania" {...field} type="number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="readingStatus"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Status czytania</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    name="readingStatus"
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Wybierz status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="WANT_TO_READ">
                        Chcę przeczytać
                      </SelectItem>
                      <SelectItem value="READING">Czytam</SelectItem>
                      <SelectItem value="READ">Przeczytana</SelectItem>
                      <SelectItem value="ABANDONED">Porzucona</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {readingStatus === 'READ' && (
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem className="mt-5">
                    <FormLabel>Ocena</FormLabel>
                    <FormControl>
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => field.onChange(num)}
                            className={
                              field.value
                                ? num <= field.value
                                  ? 'text-yellow-400 cursor-pointer'
                                  : 'text-gray-300 cursor-pointer'
                                : 'text-gray-300 cursor-pointer'
                            }
                          >
                            <Star className="w-6 h-6 fill-current" />
                          </button>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
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
                    placeholder="Dodaj własny opis lub notatkę o książce"
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
              {isPending ? 'Zapisuje...' : 'Zapisz'}
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

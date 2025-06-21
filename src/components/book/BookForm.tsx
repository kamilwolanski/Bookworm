/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { bookSchema, BookInput } from '@/lib/validation';
import { addBookAction } from '@/app/(dashboard)/actions';
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
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Star } from 'lucide-react';
import { MultiSelect } from '@/components/ui/multi-select';
import { GenreDTO } from '@/lib/books';

export default function BookForm({ bookGenres }: { bookGenres: GenreDTO[] }) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const closeDialog = () => setOpen(false);
  const { form, isPending, handleSubmit, state } = useActionForm<BookInput>({
    action: addBookAction,
    schema: bookSchema,
    defaultValues: {
      title: '',
      author: '',
      readingStatus: 'WANT_TO_READ',
      genres: [],
    },
    onSuccess: closeDialog,
  });
  const readingStatus = form.watch('readingStatus');
  const [open, setOpen] = useState(false);
  const genresList = bookGenres.map((genre) => ({
    value: genre.id,
    label: genre.name,
  }));

  useEffect(() => {
    if (readingStatus !== 'READ') {
      form.setValue('rating', undefined);
    }
  }, [readingStatus]);

  useEffect(() => {
    form.setValue('genres', selectedGenres);
    // console.log('form', form.getValues());
  }, [selectedGenres]);

  console.log('form', form.formState.errors);
  console.log('state', state);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black cursor-pointer">
          Dodaj książkę
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[825px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową książkę</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać książkę do swojej kolekcji.
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
                        <Input
                          placeholder="Rok wydania"
                          {...field}
                          type="number"
                        />
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

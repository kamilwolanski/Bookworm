/* eslint-disable react-hooks/exhaustive-deps */
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
import { Textarea } from '../ui/textarea';
import { MultiSelect } from '@/components/ui/multi-select';
import { GenreDTO } from '@/lib/userbooks';
import { UseFormReturn } from 'react-hook-form';
import { createBookAction } from '@/app/(public)/books/actions/bookActions';

export default function BookForm({ bookGenres }: { bookGenres: GenreDTO[] }) {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);

  const afterSuccess = (form: UseFormReturn<BookInput>) => {
    setOpen(false);
    setSelectedGenres([]);
    setTimeout(() => {
      form.reset();
    }, 500);
  };
  const { form, isPending, handleSubmit } = useActionForm<BookInput>({
    action: createBookAction,
    schema: bookSchema,
    defaultValues: {
      title: '',
      author: '',
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
    form.setValue('genres', selectedGenres);
  }, [selectedGenres]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-black cursor-pointer self-start"
        >
          Dodaj książkę
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

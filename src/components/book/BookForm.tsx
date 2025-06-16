'use client';

import { bookSchema, BookInput } from '@/lib/validation';
import { addBook } from '@/app/(dashboard)/actions';
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
import { useState } from 'react';

export default function BookForm() {
  const closeDialog = () => setOpen(false);
  const { form, isPending, handleSubmit, state } = useActionForm<BookInput>({
    action: addBook,
    schema: bookSchema,
    defaultValues: { title: '', author: '' },
    onSuccess: closeDialog,
  });
  console.log('state', state);
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="text-black cursor-pointer">
          Dodaj książkę
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nową książkę</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać książkę do swojej kolekcji.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit} className="space-y-4">
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
                <FormItem>
                  <FormLabel>Tytuł książki</FormLabel>
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
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input placeholder="Autor" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

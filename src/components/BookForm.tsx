'use client';

import { bookSchema, BookInput } from '@/lib/validation';
import { addBook } from '@/app/dashboard/actions';
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
import { Button } from '@/components/ui/button';

export default function BookForm() {
  const { form, isPending, handleSubmit } = useActionForm<BookInput>({
    action: addBook,
    schema: bookSchema,
    defaultValues: { title: '', author: '' },
  });

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Dodaję...' : 'Dodaj'}
        </Button>

        {form.formState.errors.root && (
          <p className="text-red-600 text-sm">
            {form.formState.errors.root.message}
          </p>
        )}
      </form>
    </Form>
  );
}

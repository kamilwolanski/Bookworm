'use client';

import { publisherSchema, PublisherInput } from '@/lib/validation';
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
import { UseFormReturn } from 'react-hook-form';
import { createPublisherAction } from '@/app/admin/publishers/actions/publisherActions';

export default function AddPublisherForm() {
  const afterSuccess = (form: UseFormReturn<PublisherInput>) => {
    setOpen(false);
    setTimeout(() => {
      form.reset();
    }, 500);
  };
  const { form, isPending, handleSubmit } = useActionForm<PublisherInput>({
    action: createPublisherAction,
    schema: publisherSchema,
    defaultValues: {
      name: '',
    },
    onSuccess: afterSuccess,
  });

  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="text-black cursor-pointer self-start"
        >
          Dodaj wydawcę +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Dodaj nowego wydawcę</DialogTitle>
          <DialogDescription>
            Wypełnij poniższy formularz, aby dodać nowego wydawcę
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-1 gap-4 auto-rows-auto"
          >
            <div>
              <div>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="mt-3">
                      <FormLabel>
                        Nazwa wydawcę<span className="text-red-500 ">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nazwa wydawcę" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-1 col-start-2 mt-5">
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
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

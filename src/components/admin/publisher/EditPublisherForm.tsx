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
import { UseFormReturn } from 'react-hook-form';
import { updatePublisherAction } from '@/app/admin/publishers/actions/publisherActions';
import { publisherSchema, PublisherInput } from '@/lib/validation';
import { useActionForm } from '@/app/hooks/useActionForm';
import { Button } from '@/components/ui/button';
import { Publisher } from '@prisma/client';

const EditPublisherForm = ({
  onSuccess,
  publisher,
}: {
  onSuccess?: () => void;
  publisher: Publisher;
}) => {
  const boundAction = updatePublisherAction.bind(null, publisher.id);
  const afterSuccess = (form: UseFormReturn<PublisherInput>) => {
    if (onSuccess) {
      onSuccess();
    }
    setTimeout(() => {
      form.reset();
    }, 500);
  };
  const { form, isPending, handleSubmit } = useActionForm<PublisherInput>({
    action: boundAction,
    schema: publisherSchema,
    defaultValues: {
      name: publisher.name,
    },
    onSuccess: afterSuccess,
  });

  return (
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
                {isPending ? 'Aktualizuje...' : 'Aktualizuj'}
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
  );
};

export default EditPublisherForm;

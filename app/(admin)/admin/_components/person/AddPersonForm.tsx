"use client";

import {
  personSchema,
  PersonInput,
} from "@/lib/validations/createPersonValidation";
import { useActionForm } from "@/app/hooks/useActionForm";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dispatch, SetStateAction } from "react";
import { UseFormReturn } from "react-hook-form";
import { createPersonAction } from "@/app/(admin)/admin/persons/actions/personActions";
import { format } from "date-fns";
import { COUNTRIES, CountryCode } from "@/app/(admin)/admin/data";
import { Textarea } from "@/components/ui/textarea";
import { AliasesInput } from "@/components/ui/AliasesInput";
import { GenericCombobox } from "@/components/ui/GenericCombobox";
import { useRouter } from "next/navigation";

export default function AddPersonForm({
  setOpen,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  const afterSuccess = (form: UseFormReturn<PersonInput>) => {
    setOpen(false);
    router.refresh();
    setTimeout(() => {
      form.reset();
    }, 500);
  };
  const { form, isPending, handleSubmit } = useActionForm<PersonInput>({
    action: createPersonAction,
    schema: personSchema,
    defaultValues: {
      name: "",
      aliases: [],
    },
    onSuccess: afterSuccess,
  });

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
              name="name"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>
                    Imię i nazwisko<span className="text-red-500 ">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Imię i nazwisko" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sortName"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>
                    Nazwa sortowania<span className="text-red-500 ">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Nazwa sortowania" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="nationality"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Narodowość</FormLabel>
                  <FormControl>
                    <GenericCombobox<CountryCode>
                      items={COUNTRIES}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Wybierz kraj..."
                      searchPlaceholder="Szukaj kraju..."
                      emptyText="Brak krajów."
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
            <FormField
              control={form.control}
              name="birthDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Data urodzenia</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value ? format(field.value, "yyyy-MM-dd") : ""
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

            <FormField
              control={form.control}
              name="deathDate"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Data śmierci</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      value={
                        field.value ? format(field.value, "yyyy-MM-dd") : ""
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

            <FormField
              control={form.control}
              name="aliases"
              render={({ field }) => (
                <FormItem className="mt-3">
                  <FormLabel>Alias(y)</FormLabel>
                  <FormControl>
                    <AliasesInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="col-span-2">
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem className="mt-3">
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Dodaj bio"
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
              {isPending ? "Dodaję..." : "Dodaj"}
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

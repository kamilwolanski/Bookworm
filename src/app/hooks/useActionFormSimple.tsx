import { DefaultValues, FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { ActionResult } from '@/types/actions';
import { ZodTypeAny } from 'zod';
import { applyServerErrorsToForm } from '@/lib/formErrors';

export function useAsyncActionForm<TFormInput extends FieldValues>({
  action,
  schema,
  defaultValues,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  schema: ZodTypeAny;
  defaultValues: DefaultValues<TFormInput>;
}) {
  const form = useForm<TFormInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [isPending, setIsPending] = useState(false);

  const submit = async (data: TFormInput): Promise<ActionResult> => {
    setIsPending(true);

    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value != null) formData.append(key, String(value));
    });

    const result = await action(formData);

    if (result.isError) {
      applyServerErrorsToForm(form, result);
    }

    setIsPending(false);
    return result;
  };

  return {
    form,
    isPending,
    submit, // 👈 UWAGA
  };
}

/* eslint-disable react-hooks/exhaustive-deps */
import {
  DefaultValues,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useActionState, useEffect } from 'react';
import { startTransition } from 'react';
import { ActionResult } from '@/types/actions';
import { ZodTypeAny } from 'zod';
import { applyServerErrorsToForm } from '@/lib/formErrors';

type UseActionStateReturn<TFormInput extends FieldValues> = {
  form: UseFormReturn<TFormInput>;
  state: ActionResult | null;
  isPending: boolean;
  handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
};

export function useActionForm<TFormInput extends FieldValues>({
  action,
  schema,
  defaultValues,
  onSuccess,
}: {
  action: (currentState: unknown, formData: FormData) => Promise<ActionResult>;
  schema: ZodTypeAny;
  defaultValues: DefaultValues<TFormInput>;
  onSuccess?: (form: UseFormReturn<TFormInput>) => void;
}): UseActionStateReturn<TFormInput> {
  const form = useForm<TFormInput>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [state, doAction, isPending] = useActionState<ActionResult, FormData>(
    action,
    { isError: false }
  );

  useEffect(() => {
    if (!isPending && state?.isError) {
      applyServerErrorsToForm(form, state);
    } else if (!isPending && state && state.status === 'success') {
      if (onSuccess) onSuccess(form);
    }
  }, [state, isPending, form]);

  const handleSubmit = (data: TFormInput) => {
    const formData = new FormData();

    for (const [key, value] of Object.entries(data)) {
      if (value !== undefined && value !== null) {
        if (key === 'file' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    }

    startTransition(() => {
      doAction(formData);
    });
  };

  return {
    form,
    state,
    isPending,
    handleSubmit: form.handleSubmit(handleSubmit),
  };
}

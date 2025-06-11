import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { ActionError } from './actions';

export function applyServerErrorsToForm<T extends FieldValues>(
  form: UseFormReturn<T>,
  error: ActionError
) {
  if (error.fieldErrors) {
    for (const fieldError of error.fieldErrors) {
      form.setError(fieldError.field as Path<T>, {
        type: 'server',
        message: fieldError.message,
      });
    }
  }

  if (error.message) {
    form.setError('root', {
      type: error.status ?? 'server',
      message: error.message,
    });
  }
}

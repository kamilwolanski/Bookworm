import { ZodError } from 'zod';
import { ActionError } from '@/types/actions';

export function buildActionError(e: ZodError): ActionError {
  return {
    isError: true,
    status: 'validation_error',
    httpStatus: 422,
    fieldErrors: e.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    })),
  };
}

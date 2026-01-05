import {
  PublisherInput,
  publisherSchema,
} from '@/lib/validations/createPublisherSchema';
import { ActionError } from '@/types/actions';

export function parseFormPublisherData(formData: FormData):
  | {
      success: true;
      data: PublisherInput;
    }
  | {
      success: false;
      errorResponse: ActionError;
    } {
  const result = publisherSchema.safeParse({
    name: formData.get('name'),
  });

  if (!result.success) {
    return {
      success: false,
      errorResponse: {
        isError: true,
        status: 'validation_error',
        httpStatus: 422,
        fieldErrors: result.error.errors.map((e) => ({
          field: e.path.join('.'),
          message: e.message,
        })),
      },
    };
  }

  return { success: true, data: result.data };
}

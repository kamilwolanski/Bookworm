import { PersonInput, personSchema } from '@/lib/validation';
import { ActionError } from '@/types/actions';

export function parseFormData(formData: FormData):
  | {
      success: true;
      data: PersonInput;
    }
  | {
      success: false;
      errorResponse: ActionError;
    } {
  const file = formData.get('file') as File | null;
  console.log('formData.get( aliases', formData.get('aliases'));
  const result = personSchema.safeParse({
    name: formData.get('name'),
    file,
    slug: formData.get('slug') ?? undefined,
    sortName: formData.get('sortName') ?? undefined,
    birthDate: formData.get('birthDate') ?? undefined,
    deathDate: formData.get('deathDate') ?? undefined,
    bio: formData.get('bio') ?? undefined,
    nationality: formData.get('nationality') ?? undefined,
    aliases: formData.get('aliases')?.toString().split(',') ?? [],
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

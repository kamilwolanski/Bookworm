import { ActionError } from '@/types/actions';
import {
  PersonInput,
  personSchema,
} from '@/lib/validations/createPersonValidation';
import { buildActionError } from '@/lib/parsers/utils';

export function parseFormPersonData(formData: FormData):
  | {
      success: true;
      data: PersonInput;
    }
  | {
      success: false;
      errorResponse: ActionError;
    } {
  const file = formData.get('file') as File | null;

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
      errorResponse: buildActionError(result.error),
    };
  }

  return { success: true, data: result.data };
}

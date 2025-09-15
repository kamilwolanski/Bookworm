import {
  EditionInput,
  editionSchema,
} from '@/lib/validations/createEditionValidation';
import { ActionError } from '@/types/actions';
import { buildActionError } from '@/lib/parsers/utils';

export function parseFormEditionData(formData: FormData):
  | {
      success: true;
      data: EditionInput;
    }
  | {
      success: false;
      errorResponse: ActionError;
    } {
  const file = formData.get('file') as File | null;

  const result = editionSchema.safeParse({
    title: formData.get('title') ?? undefined,
    subtitle: formData.get('subtitle') ?? undefined,
    file,
    isbn13: formData.get('isbn13') ?? undefined,
    isbn10: formData.get('isbn10') ?? undefined,
    language: formData.get('language') ?? undefined,
    publicationDate: formData.get('publicationDate') ?? undefined,
    pageCount: formData.get('pageCount') ?? undefined,
    format: formData.get('format') ?? undefined,
    description: formData.get('description') ?? undefined,
    publishers: formData.get('publishers')?.toString().split(',') ?? [],
  });

  if (!result.success) {
    return {
      success: false,
      errorResponse: buildActionError(result.error),
    };
  }

  return { success: true, data: result.data };
}

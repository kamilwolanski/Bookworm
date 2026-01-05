import { ActionError } from '@/types/actions';
import {
  AddBookToShelfInput,
  addBookToShelfSchema,
  AddEditionReviewInput,
  addEditionReviewSchema,
  AddReviewInput,
  addReviewSchema,
} from '@/lib/validations/addBookToShelfValidation';
import { buildActionError } from '@/lib/parsers/utils';
import { BookInput, bookSchema } from '@/lib/validations/createBookValidation';

export function parseFormEditionBookRateData(formData: FormData):
  | {
      success: true;
      data: AddEditionReviewInput;
    }
  | {
      success: false;
      errorResponse: ActionError;
    } {
  const result = addEditionReviewSchema.safeParse({
    editionId: formData.get('editionId'),
    rating: formData.get('rating') ? Number(formData.get('rating')) : undefined,
    body: formData.get('body') ?? undefined,
  });

  if (!result.success) {
    return {
      success: false,
      errorResponse: buildActionError(result.error),
    };
  }

  return { success: true, data: result.data };
}

export function parseFormBookRateData(formData: FormData):
  | {
      success: true;
      data: AddReviewInput;
    }
  | {
      success: false;
      errorResponse: ActionError;
    } {
  const result = addReviewSchema.safeParse({
    editionId: formData.get('editionId'),
    rating: Number(formData.get('rating')),
    body: formData.get('body') ?? undefined,
  });

  if (!result.success) {
    return {
      success: false,
      errorResponse: buildActionError(result.error),
    };
  }

  return { success: true, data: result.data };
}

export function parseFormBookData(formData: FormData):
  | {
      success: true;
      data: BookInput;
    }
  | {
      success: false;
      errorResponse: ActionError;
    } {
  const rawGenres = formData.get('genres');
  const genres =
    typeof rawGenres === 'string' && rawGenres.trim()
      ? rawGenres.split(',').map((g) => g.trim())
      : [];

  const result = bookSchema.safeParse({
    id: formData.get('id') ?? undefined,
    title: formData.get('title'),
    authors: formData.get('authors')?.toString().split(',') ?? [],
    genres,
    firstPublicationDate: formData.get('firstPublicationDate') ?? undefined,
    description: formData.get('description') ?? undefined,
  });

  if (!result.success) {
    return {
      success: false,
      errorResponse: buildActionError(result.error),
    };
  }

  return { success: true, data: result.data };
}

export function parseFormAddBookToShelfData(formData: FormData):
  | {
      success: true;
      data: AddBookToShelfInput;
    }
  | {
      success: false;
      errorResponse: ActionError;
    } {
  const rawRating = formData.get('rating');
  const result = addBookToShelfSchema.safeParse({
    editionId: formData.get('editionId'),
    readingStatus: formData.get('readingStatus'),
    rating: rawRating ? Number(rawRating) : undefined,
    body: formData.get('body') ?? undefined,
  });

  if (!result.success) {
    return {
      success: false,
      errorResponse: buildActionError(result.error),
    };
  }

  return { success: true, data: result.data };
}

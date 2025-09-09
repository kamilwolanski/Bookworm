import {
  BookInput,
  bookSchema,
  EditionInput,
  editionSchema,
  PersonInput,
  personSchema,
  PublisherInput,
  publisherSchema,
} from '@/lib/validation';
import { AddReviewInput, addReviewSchema } from '@/lib/rateBookValidation';
import { ActionError } from '@/types/actions';
import { ZodError } from 'zod';
import { v2 as cloudinary } from 'cloudinary';

function buildActionError(e: ZodError): ActionError {
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
      errorResponse: buildActionError(result.error),
    };
  }

  return { success: true, data: result.data };
}

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
  console.log('result', result);
  if (!result.success) {
    return {
      success: false,
      errorResponse: buildActionError(result.error),
    };
  }

  return { success: true, data: result.data };
}

export async function handleImageUpload(
  folderName: string,
  file: File,
  existingPublicId?: string | null
): Promise<
  ActionError | { isError: false; imageUrl: string; imagePublicId: string }
> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64, {
      folder: folderName,
      resource_type: 'image',
    });

    if (existingPublicId) {
      try {
        await cloudinary.uploader.destroy(existingPublicId);
      } catch (cloudinaryError) {
        console.error('Błąd Cloudinary:', cloudinaryError);
        return {
          isError: true,
          status: 'cloudinary_error',
          httpStatus: 500,
          message: 'Nie udało się usunąć starego pliku z Cloudinary.',
        };
      }
    }

    return {
      isError: false,
      imageUrl: result.secure_url,
      imagePublicId: result.public_id,
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      isError: true,
      status: 'cloudinary_error',
      httpStatus: 500,
      message: 'Błąd przesyłania obrazu.',
    };
  }
}

import { ActionError } from '@/types/actions';
import { bookSchema } from '@/lib/validation';
import z from 'zod';
import { v2 as cloudinary } from 'cloudinary';

export function parseFormData(formData: FormData):
  | {
      success: true;
      data: z.infer<typeof bookSchema>;
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

  const file = formData.get('file') as File | null;
  const result = bookSchema.safeParse({
    id: formData.get('id') ?? undefined,
    title: formData.get('title'),
    author: formData.get('author'),
    file,
    pageCount: formData.get('pageCount') ?? undefined,
    genres,
    publicationYear: formData.get('publicationYear') ?? undefined,
    readingStatus: formData.get('readingStatus'),
    rating: formData.get('rating') ?? undefined,
    description: formData.get('description') ?? undefined,
    imagePublicId: formData.get('imagePublicId') ?? undefined,
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

export async function handleImageUpload(
  file: File,
  existingPublicId?: string
): Promise<
  ActionError | { isError: false; imageUrl: string; imagePublicId: string }
> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`;
    const result = await cloudinary.uploader.upload(base64, {
      folder: 'BookCovers',
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

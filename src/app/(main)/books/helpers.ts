import { ActionError } from '@/types/actions';
import { BookInput, bookSchema } from '@/lib/validation';
import { v2 as cloudinary } from 'cloudinary';

export function parseFormData(formData: FormData):
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

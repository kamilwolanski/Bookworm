'use server';

import { bookSchema } from '@/lib/validation';
import { createBook, CreateBookData } from '@/lib/books';
import { getUserSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { Action } from '@/types/actions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const addBook: Action = async (currentState, formData) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    return {
      isError: true,
      status: 'unauthorized',
      httpStatus: 401,
      message: 'Musisz być zalogowany',
    };
  }

  const title = formData.get('title');
  const author = formData.get('author');
  const file = formData.get('file') as File | null;

  let imageUrl: string | null = null;

  // validation
  const parseResult = bookSchema.safeParse({ title, author, file });
  if (!parseResult.success) {
    return {
      isError: true,
      status: 'validation_error',
      httpStatus: 422,
      fieldErrors: parseResult.error.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    };
  }

  if (file && file.size > 0) {
    const arrayBuffer = await file.arrayBuffer();
    const base64 = `data:${file.type};base64,${Buffer.from(arrayBuffer).toString('base64')}`;

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'BookCovers',
      resource_type: 'image',
    });

    imageUrl = result.secure_url;
  }

  const data: CreateBookData = {
    title: parseResult.data.title,
    author: parseResult.data.author,
    userId: session.user.id,
    imageUrl: imageUrl,
  };

  try {
    await createBook(data);
  } catch {
    return {
      isError: true,
      status: 'server_error',
      httpStatus: 500,
      message: 'Wystąpił błąd serwera przy zapisie danych.',
    };
  }

  revalidatePath('/dashboard');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została dodana',
  };
};

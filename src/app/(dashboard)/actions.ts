'use server';

import { bookSchema } from '@/lib/validation';
import { createBook, CreateBookData, deleteBook, getBook } from '@/lib/books';
import { getUserSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';
import type { Action } from '@/types/actions';
import { v2 as cloudinary } from 'cloudinary';
import { Book, Prisma } from '@prisma/client';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const addBookAction: Action<[unknown, FormData]> = async (
  currentState,
  formData
) => {
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
  let imagePublicId: string | null = null;

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
    imagePublicId = result.public_id;
  }

  const data: CreateBookData = {
    title: parseResult.data.title,
    author: parseResult.data.author,
    userId: session.user.id,
    imageUrl: imageUrl,
    imagePublicId: imagePublicId,
    
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

export const removeBookAction: Action<[unknown, string]> = async (
  currentState,
  bookId
) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    return {
      isError: true,
      status: 'unauthorized',
      httpStatus: 401,
      message: 'Musisz być zalogowany',
    };
  }

  const book = await getBook(bookId);

  if (!book) {
    return {
      isError: true,
      status: 'not_found',
      httpStatus: 404,
      message: `Nie znaleziono książki o id: ${bookId}`,
    };
  }

  if (book.userId !== session.user.id) {
    return {
      isError: true,
      status: 'forbidden',
      httpStatus: 403,
      message: `Brak uprawnień do usunięcia książki o id: ${bookId}`,
    };
  }

  try {
    if (book.imagePublicId) {
      try {
        await cloudinary.uploader.destroy(book.imagePublicId);
      } catch (cloudinaryError) {
        console.error('Błąd Cloudinary:', cloudinaryError);
        return {
          isError: true,
          status: 'cloudinary_error',
          httpStatus: 500,
          message: 'Nie udało się usunąć pliku z Cloudinary.',
        };
      }
    }

    await deleteBook(bookId);
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return {
          isError: true,
          status: 'not_found',
          httpStatus: 404,
          message: `Książka o id: ${bookId} już nie istnieje`,
        };
      }
      return {
        isError: true,
        status: 'validation_error',
        httpStatus: 422,
        message: 'Nieprawidłowe dane',
      };
    } else if (e instanceof Prisma.PrismaClientUnknownRequestError) {
      return {
        isError: true,
        status: 'server_error',
        httpStatus: 500,
        message: 'Nieznany błąd serwera',
      };
    } else {
      return {
        isError: true,
        status: 'unknown_error',
        httpStatus: 500,
        message: 'Wystąpił nieoczekiwany błąd',
      };
    }
  }

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została usunięta',
  };
};

export const getBookAction: Action<[string], Book> = async (bookId) => {
  const session = await getUserSession();

  if (!session?.user?.id) {
    return {
      isError: true,
      status: 'unauthorized',
      httpStatus: 401,
      message: 'Musisz być zalogowany',
    };
  }

  const book = await getBook(bookId);

  if (!book) {
    return {
      isError: true,
      status: 'not_found',
      httpStatus: 404,
      message: `Nie znaleziono książki o id: ${bookId}`,
    };
  }

  if (book.userId !== session.user.id) {
    return {
      isError: true,
      status: 'forbidden',
      httpStatus: 403,
      message: 'Brak dostępu do tej książki',
    };
  }

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    data: book,
  };
};

'use server';

import { bookSchema } from '@/lib/validation';
import { ActionResult } from '@/lib/actions';
import { createBook, CreateBookData } from '@/lib/books';
import { getUserSession } from '@/lib/session';
import { revalidatePath } from 'next/cache';

export async function addBook(
  currentState: unknown,
  formData: FormData
): Promise<ActionResult> {
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

  // validation
  const parseResult = bookSchema.safeParse({ title, author });
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

  const data: CreateBookData = {
    title: parseResult.data.title,
    author: parseResult.data.author,
    userId: session.user.id,
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
}

'use server';

import { handleImageUpload, parseFormEditionData } from '@/app/admin/helpers';
import { serverErrorResponse, unauthorizedResponse } from '@/lib/responses';
import { revalidatePath } from 'next/cache';
import { getUserSession } from '@/lib/session';
import { ActionResult } from '@/types/actions';
import { Role } from '@prisma/client';
import { createEdition, CreateEditionData } from '@/lib/editions';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function createEditionAction(
  bookId: string,
  bookSlug: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await getUserSession();

  if (session.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const parsed = parseFormEditionData(formData);
  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const {
    title,
    subtitle,
    language,
    publicationDate,
    format,
    file,
    isbn10,
    isbn13,
    pageCount,
    publishers,
  } = parsed.data;

  let coverUrl: string | null = null;
  let coverPublicId: string | null = null;

  if (file && file.size > 0) {
    const uploadResult = await handleImageUpload('BookCovers', file);
    if (uploadResult.isError) return uploadResult;

    coverUrl = uploadResult.imageUrl;
    coverPublicId = uploadResult.imagePublicId;
  }

  const data: CreateEditionData = {
    bookId,
    publisherIds: publishers,
    title: title ?? null,
    subtitle: subtitle ?? null,
    language: language ?? null,
    publicationDate: publicationDate ?? null,
    format: format ?? null,
    coverUrl,
    coverPublicId,
    isbn10: isbn10 ?? null,
    isbn13: isbn13 ?? null,
    pageCount: pageCount ?? null,
  };

  try {
    await createEdition(data);
  } catch (error) {
    console.error('Create book error:', error);
    return serverErrorResponse();
  }

  revalidatePath(`/admin/books/${bookSlug}`);

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Wydanie zostało dodane',
  };
}

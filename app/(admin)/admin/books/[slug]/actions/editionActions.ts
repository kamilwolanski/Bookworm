'use server';

import { handleImageUpload } from '@/app/(admin)/admin/helpers';
import {
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import { ActionResult } from '@/types/actions';
import { Prisma, Role } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { parseFormEditionData } from '@/lib/parsers/editions';
import { createEdition, CreateEditionData, deleteEdition, getEdition, updateEdition, UpdateEditionData } from '@/lib/admin/editions';

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

  if (session?.user.role !== Role.ADMIN) {
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
    description,
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
    description: description ?? null,
  };

  try {
    await createEdition(data);
  } catch (error) {
    console.error('Create edition error:', error);
    return serverErrorResponse();
  }

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Wydanie zostało dodane',
  };
}

export async function updateEditionAction(
  editionId: string,
  bookId: string,
  bookSlug: string,
  editionCoverUrl: string | null,
  editionCoverPublicId: string | null,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await getUserSession();

  if (session?.user.role !== Role.ADMIN) {
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
    description,
  } = parsed.data;

  let coverUrl: string | null = editionCoverUrl;
  let coverPublicId: string | null = editionCoverPublicId;

  if (file && file.size > 0) {
    const uploadResult = await handleImageUpload(
      'BookCovers',
      file,
      coverPublicId
    );
    if (uploadResult.isError) return uploadResult;

    coverUrl = uploadResult.imageUrl;
    coverPublicId = uploadResult.imagePublicId;
  }

  const data: UpdateEditionData = {
    id: editionId,
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
    description: description ?? null,
  };

  try {
    await updateEdition(data);
  } catch (error) {
    console.error('Update edition error:', error);
    return serverErrorResponse();
  }

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Wydanie zostało zaktualizowane',
  };
}

export async function deleteEditionAction(
  _currentState: unknown,
  editionId: string
): Promise<ActionResult> {
  const session = await getUserSession();

  if (session?.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const edition = await getEdition(editionId);

  if (!edition)
    return notFoundResponse(`Nie znaleziono wydania o id: ${editionId}`);

  try {
    if (edition.coverPublicId) {
      const result = await cloudinary.uploader.destroy(edition.coverPublicId);
      if (result.result !== 'ok' && result.result !== 'not found') {
        return {
          isError: true,
          status: 'cloudinary_error',
          httpStatus: 500,
          message: 'Nie udało się usunąć pliku z Cloudinary.',
        };
      }
    }

    await deleteEdition(edition.id);
  } catch (e) {
    console.error('Delete error:', e);

    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      return notFoundResponse(`Edycja o id: ${edition.id} już nie istnieje`);
    }

    return {
      isError: true,
      status: 'server_error',
      httpStatus: 500,
      message: 'Wystąpił błąd serwera',
    };
  }

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została usunięta',
  };
}

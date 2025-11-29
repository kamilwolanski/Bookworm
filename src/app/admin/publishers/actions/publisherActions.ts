'use server';

import { Action, ActionResult } from '@/types/actions';
import { revalidatePath } from 'next/cache';
import {
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import { Role, Prisma } from '@prisma/client';
import slugify from 'slugify';
import { parseFormPublisherData } from '@/lib/parsers/publishers';
import { createPublisher, CreatePublisherData, deletePublisher, searchPublishers, updatePublisher, UpdatePublisherData } from '@/lib/admin/publishers';

export const createPublisherAction: Action<[unknown, FormData]> = async (
  currentState,
  formData
) => {
  const session = await getUserSession();

  if (session?.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const parsed = parseFormPublisherData(formData);

  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const { name } = parsed.data;

  const slug = slugify(name, { lower: true });

  const data: CreatePublisherData = {
    name,
    slug,
  };

  try {
    await createPublisher(data);
  } catch (error) {
    console.error('Create publisher error:', error);
    return serverErrorResponse();
  }

  revalidatePath('/admin/publishers');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Wydawca został dodany',
  };
};

export async function updatePublisherAction(
  publisherId: string,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResult> {
  const session = await getUserSession();
  if (session?.user.role !== Role.ADMIN) return unauthorizedResponse();

  const parsed = parseFormPublisherData(formData); // bez id w schemacie
  if (!parsed.success) return parsed.errorResponse;

  const { name } = parsed.data;
  const slug = slugify(name, { lower: true });

  const data: UpdatePublisherData = {
    id: publisherId,
    name,
    slug,
  };

  try {
    await updatePublisher(data);
  } catch (e) {
    console.error('Update publisher error:', e);
    return serverErrorResponse();
  }

  revalidatePath('/admin/publishers');
  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Wydawca został zaktualizowany',
  };
}

export const deletePublisherAction: Action<[unknown, string]> = async (
  _,
  publisherId
) => {
  const session = await getUserSession();

  if (session?.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  try {
    await deletePublisher(publisherId);
  } catch (e) {
    console.error('Delete error:', e);

    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      return notFoundResponse(`Wydawca o id: ${publisherId} już nie istnieje`);
    }

    return {
      isError: true,
      status: 'server_error',
      httpStatus: 500,
      message: 'Wystąpił błąd serwera',
    };
  }

  revalidatePath('/admin/publishers');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Wydawca został usunięty',
  };
};

export async function searchPublishersAction(q: string, limit = 12) {
  return searchPublishers(q, limit);
}

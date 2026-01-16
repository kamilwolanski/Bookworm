'use server';

import { Action, ActionResult } from '@/types/actions';
import { revalidatePath } from 'next/cache';
import { handleImageUpload } from '@/app/(admin)/admin/helpers';
import {
  notFoundResponse,
  serverErrorResponse,
  unauthorizedResponse,
} from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import { Role, Prisma } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';
import { parseFormPersonData } from '@/lib/parsers/persons';
import { createPerson, CreatePersonData, deletePerson, getPerson, searchPersons, updatePerson, UpdatePersonData } from '@/lib/admin/persons';


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export const createPersonAction: Action<[unknown, FormData]> = async (
  currentState,
  formData
) => {
  const session = await getUserSession();

  if (session?.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const parsed = parseFormPersonData(formData);
  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const {
    name,
    file,
    sortName,
    aliases,
    bio,
    birthDate,
    deathDate,
    nationality,
  } = parsed.data;

  let imageUrl: string | null = null;
  let imagePublicId: string | null = null;
  const slug = slugify(name, { lower: true });

  if (file && file.size > 0) {
    const uploadResult = await handleImageUpload('PersonPictures', file);
    if (uploadResult.isError) return uploadResult;

    imageUrl = uploadResult.imageUrl;
    imagePublicId = uploadResult.imagePublicId;
  }

  const data: CreatePersonData = {
    name,
    slug,
    sortName: sortName ?? null,
    aliases: aliases,
    bio: bio ?? null,
    imageUrl,
    imagePublicId,
    birthDate: birthDate ?? null,
    deathDate: deathDate ?? null,
    nationality: nationality ?? null,
    imageCredit: null,
    imageSourceUrl: null,
  };

  try {
    await createPerson(data);
  } catch (error) {
    console.error('Create person error:', error);
    return serverErrorResponse();
  }

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Osoba została dodana',
  };
};

export const updatePersonAction = async (
  personId: string,
  personImageUrl: string | null,
  personImagePublicId: string | null,
  _currentState: unknown,
  formData: FormData
): Promise<ActionResult> => {
  const session = await getUserSession();

  if (session?.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const parsed = parseFormPersonData(formData);

  if (!parsed.success) {
    return parsed.errorResponse;
  }

  const {
    name,
    file,
    sortName,
    aliases,
    bio,
    birthDate,
    deathDate,
    nationality,
  } = parsed.data;

  let imageUrl: string | null = personImageUrl;
  let imagePublicId: string | null = personImagePublicId;
  const slug = slugify(name, { lower: true });

  if (file && file.size > 0) {
    const uploadResult = await handleImageUpload(
      'PersonPictures',
      file,
      personImagePublicId
    );
    if (uploadResult.isError) return uploadResult;

    imageUrl = uploadResult.imageUrl;
    imagePublicId = uploadResult.imagePublicId;
  }

  const data: UpdatePersonData = {
    id: personId,
    name,
    slug,
    sortName: sortName ?? null,
    aliases: aliases,
    bio: bio ?? null,
    imageUrl,
    imagePublicId,
    birthDate: birthDate ?? null,
    deathDate: deathDate ?? null,
    nationality: nationality ?? null,
    imageCredit: null,
    imageSourceUrl: null,
  };

  try {
    await updatePerson(data);
  } catch (error) {
    console.error('Update person error:', error);
    return serverErrorResponse();
  }

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Dane osoby zostały zaktualizowane',
  };
};

export const deletePersonAction: Action<[unknown, string]> = async (
  _,
  personId
) => {
  const session = await getUserSession();

  if (session?.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const person = await getPerson(personId);

  if (!person)
    return notFoundResponse(`Nie znaleziono osoby o id: ${personId}`);

  try {
    if (person.imagePublicId) {
      const result = await cloudinary.uploader.destroy(person.imagePublicId);
      if (result.result !== 'ok' && result.result !== 'not found') {
        return {
          isError: true,
          status: 'cloudinary_error',
          httpStatus: 500,
          message: 'Nie udało się usunąć pliku z Cloudinary.',
        };
      }
    }

    await deletePerson(personId);
  } catch (e) {
    console.error('Delete error:', e);

    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === 'P2025'
    ) {
      return notFoundResponse(`Książka o id: ${personId} już nie istnieje`);
    }

    return {
      isError: true,
      status: 'server_error',
      httpStatus: 500,
      message: 'Wystąpił błąd serwera',
    };
  }

  revalidatePath('/admin/persons');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Książka została usunięta',
  };
};

export async function searchPersonsAction(q: string, limit = 12) {
  return searchPersons(q, limit);
}

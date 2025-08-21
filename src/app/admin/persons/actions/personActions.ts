'use server';

import { Action } from '@/types/actions';
import { revalidatePath } from 'next/cache';
import { handleImageUpload } from '@/app/(main)/books/helpers';
import { serverErrorResponse, unauthorizedResponse } from '@/lib/responses';
import { getUserSession } from '@/lib/session';
import { Role } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import slugify from 'slugify';
import { parseFormData } from '@/app/admin/helpers';
import { createPerson, CreatePersonData } from '@/lib/persons';

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

  if (session.user.role !== Role.ADMIN) {
    return unauthorizedResponse();
  }

  const parsed = parseFormData(formData);
  console.log('parsed', parsed)
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

  console.log('slug', slug);

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

  revalidatePath('/admin/persons');

  return {
    isError: false,
    status: 'success',
    httpStatus: 200,
    message: 'Osoba została dodana',
  };
};

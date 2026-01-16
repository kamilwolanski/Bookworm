import prisma from '@/lib/prisma';
import { CreatePersonData, UpdatePersonData } from './types';


export async function createPerson(data: CreatePersonData) {
  return prisma.person.create({
    data,
    select: { id: true, name: true, sortName: true, slug: true },
  });
}

export async function updatePerson(data: UpdatePersonData) {
  return prisma.person.update({
    where: {
      id: data.id,
    },
    data,
    select: { id: true, name: true, sortName: true, slug: true },
  });
}

export async function deletePerson(personId: string) {
  const book = await prisma.person.delete({
    where: {
      id: personId,
    },
  });

  return book;
}

import { Person } from '@prisma/client';
import prisma from './prisma';

export type CreatePersonData = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;

export async function findPersonBySlug(slug: string) {
  return prisma.person.findUnique({
    where: { slug },
    select: { id: true, name: true, sortName: true, slug: true },
  });
}

export async function createPerson(data: CreatePersonData) {
  return prisma.person.create({
    data,
    select: { id: true, name: true, sortName: true, slug: true },
  });
}

export async function getAllPersons() {
  return prisma.person.findMany();
}

export async function getPerson(personId: string) {
  return prisma.person.findFirst({
    where: { id: personId },
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

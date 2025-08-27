import { Person } from '@prisma/client';
import prisma from '@/lib/prisma';

export type CreatePersonData = Omit<Person, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdatePersonData = Omit<Person, 'createdAt' | 'updatedAt'>;

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

export async function updatePerson(data: UpdatePersonData) {
  return prisma.person.update({
    where: {
      id: data.id,
    },
    data,
    select: { id: true, name: true, sortName: true, slug: true },
  });
}

export async function getAllPersons(search?: string) {
  const searchConditions = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
          { sortName: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};
  return prisma.person.findMany({
    where: searchConditions,
  });
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

export type PersonOption = { value: string; label: string };

export async function searchPersons(
  q: string,
  limit = 12
): Promise<PersonOption[]> {
  const query = q.trim();
  let people = [];
  if (!query) {
    people = await prisma.person.findMany({
      take: 10,
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  } else {
    people = await prisma.person.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: 'insensitive' } },
          { sortName: { contains: query, mode: 'insensitive' } },
          { aliases: { has: query } }, // exact match aliasu
        ],
      },
      take: limit,
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  }
  return people.map((p) => ({ value: p.id, label: p.name }));
}

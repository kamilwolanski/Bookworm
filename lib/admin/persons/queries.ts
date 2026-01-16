import prisma from '@/lib/prisma';
import { PersonOption } from './types';


export async function findPersonBySlug(slug: string) {
  return prisma.person.findUnique({
    where: { slug },
    select: { id: true, name: true, sortName: true, slug: true },
  });
}

export async function getPerson(personId: string) {
  return prisma.person.findFirst({
    where: { id: personId },
  });
}

export async function getAllPersons(
  currentPage: number,
  personsPerPage: number,
  search?: string
) {
  const skip = (currentPage - 1) * personsPerPage;

  const searchConditions = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
          { sortName: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};
  const [persons, totalCount] = await Promise.all([
    prisma.person.findMany({
      skip,
      take: personsPerPage,
      where: searchConditions,
    }),
    prisma.person.count({ where: searchConditions }),
  ]);

  return { persons, totalCount };
}

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
      orderBy: { name: "asc" },
    });
  } else {
    people = await prisma.person.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { sortName: { contains: query, mode: "insensitive" } },
          { aliases: { has: query } }, // exact match aliasu
        ],
      },
      take: limit,
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    });
  }
  return people.map((p) => ({ value: p.id, label: p.name }));
}
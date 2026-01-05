import prisma from '@/lib/prisma';
import { PublisherOption } from './types';

export async function getAllPublishers(
  currentPage: number,
  publishersPerPage: number,
  search?: string
) {
  const skip = (currentPage - 1) * publishersPerPage;
  const searchConditions = search
    ? {
        OR: [
          { name: { contains: search, mode: 'insensitive' as const } },
          { slug: { contains: search, mode: 'insensitive' as const } },
        ],
      }
    : {};

  const [publishers, totalCount] = await Promise.all([
    prisma.publisher.findMany({
      skip,
      take: publishersPerPage,
      where: searchConditions,
    }),
    prisma.publisher.count({ where: searchConditions }),
  ]);

  return { publishers, totalCount };
}

export async function searchPublishers(
  q: string,
  limit = 12
): Promise<PublisherOption[]> {
  const query = q.trim();
  let publishers = [];
  if (!query) {
    publishers = await prisma.publisher.findMany({
      take: 10,
      select: { id: true, name: true },
      orderBy: { name: 'asc' },
    });
  } else {
    publishers = await prisma.publisher.findMany({
      where: {
        OR: [{ name: { contains: query, mode: 'insensitive' } }],
      },
      take: limit,
      orderBy: { name: 'asc' },
      select: { id: true, name: true },
    });
  }
  return publishers.map((p) => ({ value: p.id, label: p.name }));
}

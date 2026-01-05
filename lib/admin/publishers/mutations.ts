import prisma from '@/lib/prisma';
import { CreatePublisherData, UpdatePublisherData } from './types';

export async function createPublisher(data: CreatePublisherData) {
  return prisma.publisher.create({
    data,
    select: { id: true, name: true, slug: true },
  });
}

export async function updatePublisher(data: UpdatePublisherData) {
  const { id, name, slug } = data;

  return prisma.publisher.update({
    where: { id },
    data: { name, slug },
    select: { id: true, name: true, slug: true },
  });
}

export async function deletePublisher(publisherId: string) {
  const book = await prisma.publisher.delete({
    where: {
      id: publisherId,
    },
  });

  return book;
}

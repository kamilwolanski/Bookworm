import { Publisher } from '@prisma/client';

export type CreatePublisherData = Omit<
  Publisher,
  'id' | 'createdAt' | 'updatedAt'
>;

export type UpdatePublisherData = Omit<Publisher, 'createdAt' | 'updatedAt'>;
export type PublisherOption = { value: string; label: string };

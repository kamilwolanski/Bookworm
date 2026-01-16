import { Edition, EditionPublisher } from '@prisma/client';

export type CreateEditionData = Omit<
  Edition,
  'id' | 'createdAt' | 'updatedAt' | 'subtitle_search' | 'title_search'
> & {
  publisherIds: string[];
};
export type UpdateEditionData = Omit<
  Edition,
  'createdAt' | 'updatedAt' | 'subtitle_search' | 'title_search'
> & {
  publisherIds: string[];
};

export type EditionDto = Edition & {
  publishers: EditionPublisher[];
};
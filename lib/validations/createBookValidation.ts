import { z } from 'zod';

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Tytuł jest wymagany'),
  authors: z.array(z.string()),
  genres: z.array(z.string()).default([]),
  firstPublicationDate: z.coerce.date().optional(),
});

export type BookInput = z.infer<typeof bookSchema>;

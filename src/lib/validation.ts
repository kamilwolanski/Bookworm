import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  author: z.string().min(1, 'Autor jest wymagany'),
});

export type BookInput = z.infer<typeof bookSchema>;

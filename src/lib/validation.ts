import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  author: z.string().min(1, 'Autor jest wymagany'),
  file: z
    .union([
      z.instanceof(File),
      z.undefined(),
      z.null(),
      z.literal(''), // na wypadek pustego stringa
    ])
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: 'Obrazek nie może być większy niż 5MB',
    })
    .refine((file) => !file || file.type.startsWith('image/'), {
      message: 'Plik musi być obrazem (jpg, png...)',
    }),
  description: z.string().max(1000).optional(),
  genres: z.array(z.string()).default([]),
  pageCount: z.number().int().positive().optional(),
  publicationYear: z
    .number()
    .int()
    .min(0)
    .max(new Date().getFullYear())
    .optional(),
  readingStatus: z.enum(['WANT_TO_READ', 'READING', 'READ', 'ABANDONED']),
  rating: z.number().min(1).max(5).optional(),
});

export type BookInput = z.infer<typeof bookSchema>;

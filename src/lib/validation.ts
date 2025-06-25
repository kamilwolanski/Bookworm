import { z } from 'zod';

export const bookSchema = z.object({
  id: z.string().optional(),
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
  readingStatus: z.enum(['WANT_TO_READ', 'READING', 'READ', 'ABANDONED']),
  pageCount: z.coerce.number().int().positive().optional(),
  publicationYear: z.coerce
    .number()
    .int()
    .min(0)
    .max(new Date().getFullYear())
    .optional(),
  rating: z.coerce.number().min(1).max(5).optional(),
  imagePublicId: z.string().optional(),
});

export type BookInput = z.infer<typeof bookSchema>;

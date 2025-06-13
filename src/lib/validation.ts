import { z } from 'zod';

export const bookSchema = z.object({
  title: z.string().min(1, 'Tytuł jest wymagany'),
  author: z.string().min(1, 'Autor jest wymagany'),
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: 'Plik jest wymagany',
    })
    .refine((file) => file.type.startsWith('image/'), {
      message: 'Plik musi być obrazem (jpg, png...)',
    })
    .refine((file) => file.size <= 5 * 1024 * 1024, {
      message: 'Obrazek nie może być większy niż 5MB',
    }),
});

export type BookInput = z.infer<typeof bookSchema>;

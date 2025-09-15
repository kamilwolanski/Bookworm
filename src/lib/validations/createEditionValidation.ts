import { z } from 'zod';

export const editionContributorRoleSchema = z.enum([
  'TRANSLATOR',
  'ILLUSTRATOR',
  'EDITOR',
  'NARRATOR',
  'PREFACE_AUTHOR',
]);

export const mediaFormatSchema = z.enum([
  'HARDCOVER',
  'PAPERBACK',
  'EBOOK',
  'AUDIOBOOK',
]);

export const languageSchema = z.enum([
  'pl', // Polski
  'en', // Angielski
  'de', // Niemiecki
  'fr', // Francuski
  'es', // Hiszpański
  'it', // Włoski
  'ru', // Rosyjski
  'uk', // Ukraiński
  'cs', // Czeski
  'sk', // Słowacki
  'zh', // Chiński
  'ja', // Japoński
  'ko', // Koreański
  'pt', // Portugalski
  'nl', // Niderlandzki
  'sv', // Szwedzki
  'no', // Norweski
  'fi', // Fiński
  'da', // Duński
  'el', // Grecki
  'tr', // Turecki
  'hu', // Węgierski
  'ro', // Rumuński
  'bg', // Bułgarski
  'ar', // Arabski
]);

export const editionContributorSchema = z.object({
  editionId: z.string().uuid().optional(), // zwykle przy tworzeniu można pominąć
  personId: z.string().uuid(),
  role: editionContributorRoleSchema,
  order: z.number().int().nullable().optional(),
});

export const editionSchema = z.object({
  isbn13: z
    .string()
    .regex(/^\d{13}$/, 'ISBN-13 musi mieć 13 cyfr')
    .or(z.literal(''))
    .optional(),

  isbn10: z
    .string()
    .regex(/^\d{10}$/, 'ISBN-10 musi mieć 10 cyfr')
    .or(z.literal(''))
    .optional(),
  language: languageSchema.optional(),
  file: z
    .union([z.instanceof(File), z.undefined(), z.null(), z.literal('')])
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: 'Obrazek nie może być większy niż 5MB',
    })
    .refine((file) => !file || file.type.startsWith('image/'), {
      message: 'Plik musi być obrazem (jpg, png...)',
    }),
  publicationDate: z.coerce.date().nullable().optional(),
  pageCount: z.coerce.number().int().positive().optional(),
  format: mediaFormatSchema.optional(),
  coverUrl: z.string().url().optional(),
  coverPublicId: z.string().optional(),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  publishers: z.array(z.string()),
  description: z.string().max(3000).optional(),
  // contributors: z.array(editionContributorSchema).optional().default([]),
});

export type LanguageInput = z.infer<typeof languageSchema>;

export type EditionInput = z.infer<typeof editionSchema>;

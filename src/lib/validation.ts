import { z } from 'zod';

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Tytuł jest wymagany'),
  authors: z.array(z.string()),
  genres: z.array(z.string()).default([]),
  firstPublicationDate: z.coerce.date().optional(),
});

export type BookInput = z.infer<typeof bookSchema>;

export const COUNTRY_CODES = [
  'pl',
  'de',
  'us',
  'gb',
  'fr',
  'es',
  'it',
  'ua',
  'cz',
  'sk',
  'ru',
  'cn',
  'jp',
  'kr',
  'br',
  'ar',
  'ca',
  'au',
  'se',
  'no',
  'fi',
  'dk',
  'nl',
  'be',
  'ch',
  'at',
  'gr',
  'tr',
  'hu',
  'ro',
  'bg',
  'pt',
  'ie',
  'il',
] as const;

export const personSchema = z.object({
  name: z.string().min(1, 'Imię i nazwisko są wymagane'),
  slug: z.string().optional(), // np. generowany po stronie serwera
  sortName: z.string().min(2, 'Nazwa sortowania jest za krótka').optional(),
  aliases: z.array(z.string()),
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
  bio: z.string().optional(),
  imageUrl: z.string().url().optional(),
  imagePublicId: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  deathDate: z.coerce.date().optional(),
  nationality: z.enum(COUNTRY_CODES).optional(),
  imageCredit: z.string().optional(),
  imageSourceUrl: z.string().url().optional(),
});

export type PersonInput = z.infer<typeof personSchema>;

export const publisherSchema = z.object({
  name: z.string().min(1, 'Nazwa wydawcy jest wymagana'),
});

export type PublisherInput = z.infer<typeof publisherSchema>;

// Enum MediaFormat w Zod
export const mediaFormatSchema = z.enum([
  'HARDCOVER',
  'PAPERBACK',
  'EBOOK',
  'AUDIOBOOK',
]);

// Enum EditionContributorRole w Zod
export const editionContributorRoleSchema = z.enum([
  'TRANSLATOR',
  'ILLUSTRATOR',
  'EDITOR',
  'NARRATOR',
  'PREFACE_AUTHOR',
]);

// Schema dla EditionContributor
export const editionContributorSchema = z.object({
  editionId: z.string().uuid().optional(), // zwykle przy tworzeniu można pominąć
  personId: z.string().uuid(),
  role: editionContributorRoleSchema,
  order: z.number().int().nullable().optional(),
});

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
export type LanguageInput = z.infer<typeof languageSchema>;
// Schema dla Edition (tylko pola, które podałeś)
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

export type EditionInput = z.infer<typeof editionSchema>;

import { z } from 'zod';

// export const bookSchema = z.object({
//   id: z.string().optional(),
//   title: z.string().min(1, 'Tytuł jest wymagany'),
//   author: z.string().min(1, 'Autor jest wymagany'),
//   file: z
//     .union([
//       z.instanceof(File),
//       z.undefined(),
//       z.null(),
//       z.literal(''), // na wypadek pustego stringa
//     ])
//     .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
//       message: 'Obrazek nie może być większy niż 5MB',
//     })
//     .refine((file) => !file || file.type.startsWith('image/'), {
//       message: 'Plik musi być obrazem (jpg, png...)',
//     }),
//   description: z.string().max(1000).optional(),
//   genres: z.array(z.string()).default([]),
//   pageCount: z.preprocess((arg) => {
//     if (typeof arg === 'string' && arg === '') {
//       return undefined;
//     } else {
//       return arg;
//     }
//   }, z.coerce.number().int().positive().optional()),
//   publicationYear: z.preprocess((arg) => {
//     if (typeof arg === 'string' && arg === '') {
//       return undefined;
//     } else {
//       return arg;
//     }
//   }, z.coerce.number().min(0).positive().optional()),
//   imagePublicId: z.string().optional(),
// });

export const bookSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Tytuł jest wymagany'),
  authors: z.array(z.string()),
  description: z.string().max(1000).optional(),
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

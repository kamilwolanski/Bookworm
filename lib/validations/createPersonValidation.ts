import { z } from 'zod';

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

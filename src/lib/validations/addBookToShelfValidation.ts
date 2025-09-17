import { z } from 'zod';

export const addBookToShelfSchema = z.object({
  editionId: z
    .string({
      required_error: 'Wybierz edycję',
    })
    .uuid('Niepoprawne ID edycji'),
  readingStatus: z.enum(['WANT_TO_READ', 'READING', 'READ', 'ABANDONED']),
  rating: z.number().min(1).max(5).optional(),
  body: z.string().max(300, 'Maksymalna długość znaków to 300').optional(),
});

export type AddBookToShelfInput = z.infer<typeof addBookToShelfSchema>;

export const chooseEditionSchema = z.object({
  editionId: z
    .string({
      required_error: 'Wybierz edycję',
    })
    .uuid('Niepoprawne ID edycji'),
});

export type chooseEditionInput = z.infer<typeof chooseEditionSchema>;

export const statusSchema = z.object({
  readingStatus: z.enum(['WANT_TO_READ', 'READING', 'READ', 'ABANDONED']),
});

export type StatusInput = z.infer<typeof statusSchema>;

export const addReviewSchema = z.object({
  rating: z.number().min(1).max(5).optional(),
  body: z.string().max(300, 'Maksymalna długość znaków to 300').optional(),
});

export const statusAndReviewSchema = statusSchema.merge(addReviewSchema);
export const addEditionReviewSchema = z
  .object({
    editionId: z
      .string({
        required_error: 'Wybierz edycję',
      })
      .uuid('Niepoprawne ID edycji'),
  })
  .merge(addReviewSchema);

export type AddEditionReviewInput = z.infer<typeof addEditionReviewSchema>;

export type StatusAndReviewInput = z.infer<typeof statusAndReviewSchema>;

export type AddReviewInput = z.infer<typeof addReviewSchema>;

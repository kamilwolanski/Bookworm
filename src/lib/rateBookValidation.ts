import { z } from 'zod';

export const addReviewSchema = z.object({
  rating: z.number().min(1).max(5),
  body: z.string().max(300, 'Maksymalna długość znaków to 300').optional(),
});

export type AddReviewInput = z.infer<typeof addReviewSchema>;

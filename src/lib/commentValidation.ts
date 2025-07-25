import { z } from 'zod';

export const commentSchema = z.object({
  content: z.string().min(1).max(100, 'Zbyt duża liczba znaków'),
});

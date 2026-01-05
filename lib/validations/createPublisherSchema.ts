import { z } from 'zod';

export const publisherSchema = z.object({
  name: z.string().min(1, 'Nazwa wydawcy jest wymagana'),
});

export type PublisherInput = z.infer<typeof publisherSchema>;

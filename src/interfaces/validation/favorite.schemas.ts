import { z } from 'zod';

export const addFavoriteSchema = z.object({
  productId: z.number().int().positive(),
});

export type AddFavoriteBody = z.infer<typeof addFavoriteSchema>;

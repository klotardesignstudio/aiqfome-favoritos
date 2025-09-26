import { z } from 'zod';

export const createUserSchema = z.object({
  name: z.string().min(2, 'name must have at least 2 characters'),
  email: z.string().email('invalid email'),
  password: z.string().min(8, 'password must have at least 8 characters'),
});

export type CreateUserRequestBody = z.infer<typeof createUserSchema>;

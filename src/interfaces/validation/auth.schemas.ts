import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('invalid email'),
  password: z.string().min(1, 'password is required'),
});

export type LoginRequestBody = z.infer<typeof loginSchema>;

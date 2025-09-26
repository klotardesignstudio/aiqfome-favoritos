import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const EnvSchema = z.object({
  PORT: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => Number.isFinite(v) && v > 0, 'PORT must be a positive number')
    .default('3000' as unknown as number),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  HMAC_SECRET: z.string().min(1, 'HMAC_SECRET is required').default('change-me'),
  HMAC_TOLERANCE_SECONDS: z
    .string()
    .transform((v) => Number(v))
    .refine((v) => Number.isFinite(v) && v >= 0, 'HMAC_TOLERANCE_SECONDS must be a non-negative number')
    .default('300' as unknown as number),
});

const parsed = EnvSchema.parse({
  PORT: process.env.PORT ?? '3000',
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  HMAC_SECRET: process.env.HMAC_SECRET ?? 'change-me',
  HMAC_TOLERANCE_SECONDS: process.env.HMAC_TOLERANCE_SECONDS ?? '300',
});

export const env = {
  PORT: parsed.PORT as unknown as number,
  NODE_ENV: parsed.NODE_ENV,
  HMAC_SECRET: parsed.HMAC_SECRET,
  HMAC_TOLERANCE_SECONDS: parsed.HMAC_TOLERANCE_SECONDS as unknown as number,
};

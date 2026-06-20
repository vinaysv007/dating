import { z } from 'zod';
const envSchema = z.object({
  PORT: z.string().default('5000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),  
  CLERK_PUBLISHABLE_KEY: z.string().min(1, 'CLERK_PUBLISHABLE_KEY is required'),
  CLERK_SECRET_KEY: z.string().min(1),
  CLERK_WEBHOOK_SECRET: z.string().min(1),
}); 

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const parsedEnv = envSchema.safeParse(process.env);
  if (!parsedEnv.success) {
    throw new Error('Invalid environment variables');
  }
  return parsedEnv.data;
}

let cachedEnv: Env | null = null;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = loadEnv();
  }    
  return cachedEnv;
}
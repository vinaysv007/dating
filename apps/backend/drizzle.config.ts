/// <reference types="drizzle-kit" />
import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';

dotenv.config(); 

export default defineConfig({
  schema: './src/db/Schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});
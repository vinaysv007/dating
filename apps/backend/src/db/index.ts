import { drizzle } from 'drizzle-orm/node-postgres'

import * as schema from './Schema'; 
import { Pool } from 'pg';
import dotenv from 'dotenv';    
dotenv.config();        

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});
export const db = drizzle(pool, { schema });
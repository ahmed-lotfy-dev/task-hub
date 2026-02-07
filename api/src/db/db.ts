import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";
import * as schema from './schema/index';

export { schema };

const pool = new Pool({
  connectionString: process.env.DATABASE_URL!,
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
  ssl: {
    rejectUnauthorized: false
  },
  // Add keepalive for Neon serverless
  keepAlive: true,
  keepAliveInitialDelayMillis: 10000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
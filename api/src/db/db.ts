import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from "pg";
import * as schema from './schema/index';

// Export the schema for use in other parts of the application
export { schema };

// You can specify any property from the node-postgres connection options
const connectionString = process.env.DATABASE_URL!;
const isLocal = connectionString.includes("localhost") || connectionString.includes("127.0.0.1");
const finalConnectionString = isLocal
  ? connectionString
  : (connectionString.includes("sslmode=") ? connectionString : `${connectionString}${connectionString.includes("?") ? "&" : "?"}sslmode=require`);

const pool = new Pool({
  connectionString: finalConnectionString,
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle client', err);
});

export const db = drizzle(pool, { schema });
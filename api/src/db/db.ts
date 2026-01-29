import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from './schema/index';

// Export the schema for use in other parts of the application
export { schema };

// You can specify any property from the node-postgres connection options
export const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL!,
    ssl: true
  },
  schema
});
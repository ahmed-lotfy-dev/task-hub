import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './drizzle',
  schema: './src/db/schema/index.ts',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!.includes("localhost")
      ? process.env.DATABASE_URL!
      : (process.env.DATABASE_URL!.includes("?")
        ? `${process.env.DATABASE_URL!}&sslmode=require`
        : `${process.env.DATABASE_URL!}?sslmode=require`),
    ssl: process.env.DATABASE_URL?.includes("localhost") ? false : { rejectUnauthorized: false },
  },
});
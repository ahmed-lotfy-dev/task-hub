import { pgTable, text, varchar, timestamp, jsonb, boolean } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  image: text('image'),

  // Extended application fields
  passwordHash: varchar('password_hash', { length: 255 }),
  avatarUrl: text('avatar_url'),
  timezone: varchar('timezone', { length: 50 }).notNull().default('UTC'),
  preferences: jsonb('preferences').notNull().default({
    theme: 'system',
    language: 'en',
    dateFormat: 'YYYY-MM-DD',
    notifications: {
      email: true,
      push: true,
      desktop: true,
      digest: 'immediate',
    },
  }),

  // Timestamps
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

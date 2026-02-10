import { pgTable, uuid, varchar, text, timestamp, index, unique } from 'drizzle-orm/pg-core';
import { users } from './users';

export const testimonials = pgTable(
  'testimonials',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    role: varchar('role', { length: 120 }),
    company: varchar('company', { length: 120 }),
    quote: text('quote').notNull(),
    avatarUrl: text('avatar_url'),
    createdBy: text('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    createdByUnique: unique('testimonials_created_by_unique').on(table.createdBy),
  })
);

export type Testimonial = typeof testimonials.$inferSelect;
export type NewTestimonial = typeof testimonials.$inferInsert;

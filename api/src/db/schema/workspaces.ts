import { pgTable, uuid, varchar, text, timestamp, jsonb, index, pgEnum } from 'drizzle-orm/pg-core';
import { users } from './users';

export const workspaceVisibilityEnum = pgEnum('workspace_visibility', ['private', 'team', 'public']);

export const workspaces = pgTable(
  'workspaces',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 100 }).notNull(),
    slug: varchar('slug', { length: 100 }).notNull(),
    description: text('description'),
    visibility: workspaceVisibilityEnum('visibility').notNull().default('private'),
    ownerId: uuid('owner_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    settings: jsonb('settings')
      .notNull()
      .default({
        allowGuests: false,
        defaultBoardVisibility: 'private',
        enableTimeTracking: false,
      }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    ownerIdIdx: index('workspaces_owner_id_idx').on(table.ownerId),
    slugIdx: index('workspaces_slug_idx').on(table.slug),
  })
);

export type Workspace = typeof workspaces.$inferSelect;
export type NewWorkspace = typeof workspaces.$inferInsert;

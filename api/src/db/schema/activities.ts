import { pgTable, uuid, varchar, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core';
import { users } from './users';
import { workspaces } from './workspaces';
import { boards } from './boards';

export const activities = pgTable(
  'activities',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    boardId: uuid('board_id')
      .references(() => boards.id, { onDelete: 'set null' }),
    action: varchar('action', { length: 50 }).notNull(), // 'create', 'update', 'delete', 'move', etc.
    entityType: varchar('entity_type', { length: 50 }).notNull(), // 'workspace', 'board', 'list', 'card'
    entityId: uuid('entity_id').notNull(),
    entityName: varchar('entity_name', { length: 200 }),
    metadata: jsonb('metadata').notNull().default({}),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    deletedAt: timestamp('deleted_at', { withTimezone: true }), // Soft delete timestamp
  },
  (table) => ({
    userIdIdx: index('activities_user_id_idx').on(table.userId),
    workspaceIdIdx: index('activities_workspace_id_idx').on(table.workspaceId),
    boardIdIdx: index('activities_board_id_idx').on(table.boardId),
    createdAtIdx: index('activities_created_at_idx').on(table.createdAt),
    deletedAtIdx: index('activities_deleted_at_idx').on(table.deletedAt),
  })
);

export type Activity = typeof activities.$inferSelect;
export type NewActivity = typeof activities.$inferInsert;

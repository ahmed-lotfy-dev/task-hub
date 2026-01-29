import { pgTable, uuid, timestamp, index, unique, pgEnum } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';
import { users } from './users';

export const workspaceRoleEnum = pgEnum('workspace_role', ['owner', 'admin', 'member', 'guest']);

export const workspaceMembers = pgTable(
  'workspace_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: workspaceRoleEnum('role').notNull().default('member'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueMember: unique('workspace_members_unique_idx').on(table.workspaceId, table.userId),
    workspaceIdIdx: index('workspace_members_workspace_id_idx').on(table.workspaceId),
    userIdIdx: index('workspace_members_user_id_idx').on(table.userId),
  })
);

export type WorkspaceMember = typeof workspaceMembers.$inferSelect;
export type NewWorkspaceMember = typeof workspaceMembers.$inferInsert;

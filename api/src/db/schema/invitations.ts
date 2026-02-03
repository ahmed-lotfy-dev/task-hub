import { pgTable, uuid, varchar, text, timestamp, pgEnum, index } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';
import { boards } from './boards';
import { users } from './users';

export const invitationStatusEnum = pgEnum('invitation_status', ['pending', 'accepted', 'expired', 'revoked']);
export const invitationRoleEnum = pgEnum('invitation_role', ['owner', 'admin', 'member', 'guest', 'observer']);

export const invitations = pgTable(
  'invitations',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 255 }).notNull(),
    workspaceId: uuid('workspace_id').references(() => workspaces.id, { onDelete: 'cascade' }),
    boardId: uuid('board_id').references(() => boards.id, { onDelete: 'cascade' }),
    inviterId: text('inviter_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    token: varchar('token', { length: 255 }).notNull().unique(),
    role: invitationRoleEnum('role').notNull().default('member'),
    status: invitationStatusEnum('status').notNull().default('pending'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tokenIdx: index('invitations_token_idx').on(table.token),
    emailIdx: index('invitations_email_idx').on(table.email),
    workspaceIdIdx: index('invitations_workspace_id_idx').on(table.workspaceId),
    boardIdIdx: index('invitations_board_id_idx').on(table.boardId),
  })
);

export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;

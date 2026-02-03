import { pgTable, uuid, text, timestamp, pgEnum, index, unique } from 'drizzle-orm/pg-core';
import { boards } from './boards';
import { users } from './users';

export const boardRoleEnum = pgEnum('board_role', ['owner', 'member', 'observer']);

export const boardMembers = pgTable(
  'board_members',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'cascade' }),
    userId: text('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    role: boardRoleEnum('role').notNull().default('member'),
    joinedAt: timestamp('joined_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    uniqueBoardMember: unique('board_members_unique_idx').on(table.boardId, table.userId),
    boardIdIdx: index('board_members_board_id_idx').on(table.boardId),
    userIdIdx: index('board_members_user_id_idx').on(table.userId),
  })
);

export type BoardMember = typeof boardMembers.$inferSelect;
export type NewBoardMember = typeof boardMembers.$inferInsert;

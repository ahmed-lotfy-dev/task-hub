import { pgTable, uuid, varchar, integer, timestamp, boolean, index } from 'drizzle-orm/pg-core';
import { boards } from './boards';

export const lists = pgTable(
  'lists',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    position: integer('position').notNull(),
    wipLimit: integer('wip_limit'),
    archived: boolean('archived').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    boardIdIdx: index('lists_board_id_idx').on(table.boardId),
    positionIdx: index('lists_position_idx').on(table.boardId, table.position),
    archivedIdx: index('lists_archived_idx').on(table.archived),
  })
);

export type List = typeof lists.$inferSelect;
export type NewList = typeof lists.$inferInsert;

import { pgTable, uuid, varchar, text, timestamp, jsonb, boolean, index, pgEnum } from 'drizzle-orm/pg-core';
import { workspaces } from './workspaces';

export const boardVisibilityEnum = pgEnum('board_visibility', ['private', 'team', 'public']);
export const boardTemplateEnum = pgEnum('board_template', ['kanban', 'scrum', 'simple', 'bug_tracker', 'blank']);

export const boards = pgTable(
  'boards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    workspaceId: uuid('workspace_id')
      .notNull()
      .references(() => workspaces.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 100 }).notNull(),
    description: text('description'),
    visibility: boardVisibilityEnum('visibility').notNull().default('private'),
    background: jsonb('background').notNull().default({
      type: 'color',
      value: '#0079bf',
    }),
    template: boardTemplateEnum('template').default('blank'),
    settings: jsonb('settings').notNull().default({
      allowComments: true,
      allowReactions: true,
      cardCoverImages: true,
      showCardId: false,
    }),
    archived: boolean('archived').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    workspaceIdIdx: index('boards_workspace_id_idx').on(table.workspaceId),
    archivedIdx: index('boards_archived_idx').on(table.archived),
  })
);

export const boardLabels = pgTable(
  'board_labels',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    boardId: uuid('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 50 }).notNull(),
    color: varchar('color', { length: 7 }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    boardIdIdx: index('board_labels_board_id_idx').on(table.boardId),
  })
);

export type Board = typeof boards.$inferSelect;
export type NewBoard = typeof boards.$inferInsert;
export type BoardLabel = typeof boardLabels.$inferSelect;
export type NewBoardLabel = typeof boardLabels.$inferInsert;

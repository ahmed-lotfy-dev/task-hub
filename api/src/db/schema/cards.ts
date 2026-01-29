import { pgTable, uuid, varchar, text, integer, timestamp, boolean, jsonb, index, pgEnum, primaryKey } from 'drizzle-orm/pg-core';
import { lists } from './lists';
import { boards } from './boards';
import { users } from './users';
import { boardLabels } from './boards';

export const cardPriorityEnum = pgEnum('card_priority', ['low', 'medium', 'high']);
export const attachmentTypeEnum = pgEnum('attachment_type', ['file', 'image', 'link']);

export const cards = pgTable(
  'cards',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    listId: uuid('list_id')
      .notNull()
      .references(() => lists.id, { onDelete: 'cascade' }),
    boardId: uuid('board_id')
      .notNull()
      .references(() => boards.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 200 }).notNull(),
    description: text('description'),
    descriptionHtml: text('description_html'),
    position: integer('position').notNull(),
    coverImage: text('cover_image'),
    dueDate: timestamp('due_date', { withTimezone: true }),
    startDate: timestamp('start_date', { withTimezone: true }),
    priority: cardPriorityEnum('priority'),
    archived: boolean('archived').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    listIdIdx: index('cards_list_id_idx').on(table.listId),
    boardIdIdx: index('cards_board_id_idx').on(table.boardId),
    positionIdx: index('cards_position_idx').on(table.listId, table.position),
    dueDateIdx: index('cards_due_date_idx').on(table.dueDate),
    archivedIdx: index('cards_archived_idx').on(table.archived),
  })
);

export const cardAssignees = pgTable(
  'card_assignees',
  {
    cardId: uuid('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cardId, table.userId] }),
    cardIdIdx: index('card_assignees_card_id_idx').on(table.cardId),
    userIdIdx: index('card_assignees_user_id_idx').on(table.userId),
  })
);

export const cardLabels = pgTable(
  'card_labels',
  {
    cardId: uuid('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    labelId: uuid('label_id')
      .notNull()
      .references(() => boardLabels.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.cardId, table.labelId] }),
    cardIdIdx: index('card_labels_card_id_idx').on(table.cardId),
  })
);

export const cardComments = pgTable(
  'card_comments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cardId: uuid('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    content: text('content').notNull(),
    mentions: jsonb('mentions').notNull().default([]),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    cardIdIdx: index('card_comments_card_id_idx').on(table.cardId),
    userIdIdx: index('card_comments_user_id_idx').on(table.userId),
  })
);

export const cardAttachments = pgTable(
  'card_attachments',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cardId: uuid('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    url: text('url').notNull(),
    type: attachmentTypeEnum('type').notNull(),
    size: integer('size'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    createdBy: uuid('created_by')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
  },
  (table) => ({
    cardIdIdx: index('card_attachments_card_id_idx').on(table.cardId),
  })
);

export const checklists = pgTable(
  'checklists',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    cardId: uuid('card_id')
      .notNull()
      .references(() => cards.id, { onDelete: 'cascade' }),
    title: varchar('title', { length: 100 }).notNull(),
    position: integer('position').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    cardIdIdx: index('checklists_card_id_idx').on(table.cardId),
  })
);

export const checklistItems = pgTable(
  'checklist_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    checklistId: uuid('checklist_id')
      .notNull()
      .references(() => checklists.id, { onDelete: 'cascade' }),
    content: varchar('content', { length: 500 }).notNull(),
    completed: boolean('completed').notNull().default(false),
    position: integer('position').notNull(),
    assignedTo: uuid('assigned_to').references(() => users.id, { onDelete: 'set null' }),
    dueDate: timestamp('due_date', { withTimezone: true }),
    completedAt: timestamp('completed_at', { withTimezone: true }),
  },
  (table) => ({
    checklistIdIdx: index('checklist_items_checklist_id_idx').on(table.checklistId),
  })
);

export type Card = typeof cards.$inferSelect;
export type NewCard = typeof cards.$inferInsert;
export type CardAssignee = typeof cardAssignees.$inferSelect;
export type NewCardAssignee = typeof cardAssignees.$inferInsert;
export type CardLabel = typeof cardLabels.$inferSelect;
export type NewCardLabel = typeof cardLabels.$inferInsert;
export type CardComment = typeof cardComments.$inferSelect;
export type NewCardComment = typeof cardComments.$inferInsert;
export type CardAttachment = typeof cardAttachments.$inferSelect;
export type NewCardAttachment = typeof cardAttachments.$inferInsert;
export type Checklist = typeof checklists.$inferSelect;
export type NewChecklist = typeof checklists.$inferInsert;
export type ChecklistItem = typeof checklistItems.$inferSelect;
export type NewChecklistItem = typeof checklistItems.$inferInsert;

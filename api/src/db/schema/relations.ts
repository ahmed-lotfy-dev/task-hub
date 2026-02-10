import { relations } from 'drizzle-orm';
import { users } from './users';
import { workspaces } from './workspaces';
import { workspaceMembers } from './workspace_members';
import { boards } from './boards';
import { boardMembers } from './board_members';
import { lists } from './lists';
import { cards, cardAssignees, cardLabels, cardComments, cardAttachments, checklists, checklistItems } from './cards';
import { boardLabels } from './boards';
import { testimonials } from './testimonials';

// WORKSPACE RELATIONS
export const workspacesRelations = relations(workspaces, ({ many }) => ({
  members: many(workspaceMembers),
  boards: many(boards),
}));

export const workspaceMembersRelations = relations(workspaceMembers, ({ one }) => ({
  workspace: one(workspaces, {
    fields: [workspaceMembers.workspaceId],
    references: [workspaces.id],
  }),
  user: one(users, {
    fields: [workspaceMembers.userId],
    references: [users.id],
  }),
}));

// USER RELATIONS
export const usersRelations = relations(users, ({ many }) => ({
  workspaceMemberships: many(workspaceMembers),
  boardMemberships: many(boardMembers),
  assignedCards: many(cardAssignees),
  testimonials: many(testimonials),
}));

// BOARD RELATIONS
export const boardsRelations = relations(boards, ({ one, many }) => ({
  workspace: one(workspaces, {
    fields: [boards.workspaceId],
    references: [workspaces.id],
  }),
  lists: many(lists),
  members: many(boardMembers),
  labels: many(boardLabels),
  cards: many(cards),
}));

export const boardMembersRelations = relations(boardMembers, ({ one }) => ({
  board: one(boards, {
    fields: [boardMembers.boardId],
    references: [boards.id],
  }),
  user: one(users, {
    fields: [boardMembers.userId],
    references: [users.id],
  }),
}));

export const boardLabelsRelations = relations(boardLabels, ({ one, many }) => ({
  board: one(boards, {
    fields: [boardLabels.boardId],
    references: [boards.id],
  }),
  cards: many(cardLabels),
}));

// LIST RELATIONS
export const listsRelations = relations(lists, ({ one, many }) => ({
  board: one(boards, {
    fields: [lists.boardId],
    references: [boards.id],
  }),
  cards: many(cards),
}));

// CARD RELATIONS
export const cardsRelations = relations(cards, ({ one, many }) => ({
  list: one(lists, {
    fields: [cards.listId],
    references: [lists.id],
  }),
  board: one(boards, {
    fields: [cards.boardId],
    references: [boards.id],
  }),
  assignees: many(cardAssignees),
  labels: many(cardLabels),
  comments: many(cardComments),
  attachments: many(cardAttachments),
  checklists: many(checklists),
}));

export const cardAssigneesRelations = relations(cardAssignees, ({ one }) => ({
  card: one(cards, {
    fields: [cardAssignees.cardId],
    references: [cards.id],
  }),
  user: one(users, {
    fields: [cardAssignees.userId],
    references: [users.id],
  }),
}));

export const cardLabelsRelations = relations(cardLabels, ({ one }) => ({
  card: one(cards, {
    fields: [cardLabels.cardId],
    references: [cards.id],
  }),
  label: one(boardLabels, {
    fields: [cardLabels.labelId],
    references: [boardLabels.id],
  }),
}));

export const cardCommentsRelations = relations(cardComments, ({ one }) => ({
  card: one(cards, {
    fields: [cardComments.cardId],
    references: [cards.id],
  }),
  user: one(users, {
    fields: [cardComments.userId],
    references: [users.id],
  }),
}));

export const cardAttachmentsRelations = relations(cardAttachments, ({ one }) => ({
  card: one(cards, {
    fields: [cardAttachments.cardId],
    references: [cards.id],
  }),
  user: one(users, {
    fields: [cardAttachments.createdBy],
    references: [users.id],
  }),
}));

export const checklistsRelations = relations(checklists, ({ one, many }) => ({
  card: one(cards, {
    fields: [checklists.cardId],
    references: [cards.id],
  }),
  items: many(checklistItems),
}));

export const checklistItemsRelations = relations(checklistItems, ({ one }) => ({
  checklist: one(checklists, {
    fields: [checklistItems.checklistId],
    references: [checklists.id],
  }),
  assignee: one(users, {
    fields: [checklistItems.assignedTo],
    references: [users.id],
  }),
}));

// TESTIMONIAL RELATIONS
export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  creator: one(users, {
    fields: [testimonials.createdBy],
    references: [users.id],
  }),
}));

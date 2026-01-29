import { z } from 'zod';

export const createCardSchema = z.object({
  title: z.string().min(1, 'Card title is required').max(200, 'Title too long'),
  description: z.string().max(10000).optional(),
  listId: z.string().uuid('Invalid list ID'),
  position: z.number().int().min(0).optional(),
  dueDate: z.string().datetime().optional(),
  startDate: z.string().datetime().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  labelIds: z.array(z.string().uuid()).optional(),
  assigneeIds: z.array(z.string().uuid()).optional(),
});

export const updateCardSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(10000).optional(),
  coverImage: z.string().url().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
  startDate: z.string().datetime().nullable().optional(),
  priority: z.enum(['low', 'medium', 'high']).nullable().optional(),
  archived: z.boolean().optional(),
});

export const moveCardSchema = z.object({
  listId: z.string().uuid(),
  position: z.number().int().min(0),
});

export const createCommentSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const updateCommentSchema = z.object({
  content: z.string().min(1).max(5000),
});

export const createChecklistSchema = z.object({
  title: z.string().min(1).max(100),
});

export const createChecklistItemSchema = z.object({
  content: z.string().min(1).max(500),
  assignedTo: z.string().uuid().optional(),
  dueDate: z.string().datetime().optional(),
});

export const updateChecklistItemSchema = z.object({
  content: z.string().min(1).max(500).optional(),
  completed: z.boolean().optional(),
  assignedTo: z.string().uuid().nullable().optional(),
  dueDate: z.string().datetime().nullable().optional(),
});

export const cardIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateCardInput = z.infer<typeof createCardSchema>;
export type UpdateCardInput = z.infer<typeof updateCardSchema>;
export type MoveCardInput = z.infer<typeof moveCardSchema>;
export type CreateCommentInput = z.infer<typeof createCommentSchema>;
export type UpdateCommentInput = z.infer<typeof updateCommentSchema>;
export type CreateChecklistInput = z.infer<typeof createChecklistSchema>;
export type CreateChecklistItemInput = z.infer<typeof createChecklistItemSchema>;
export type UpdateChecklistItemInput = z.infer<typeof updateChecklistItemSchema>;

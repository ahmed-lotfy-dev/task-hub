import { z } from 'zod';

export const createListSchema = z.object({
  name: z.string().min(1, 'List name is required').max(100, 'Name too long'),
  wipLimit: z.number().int().min(0).max(100).optional(),
});

export const updateListSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  wipLimit: z.number().int().min(0).max(100).nullable().optional(),
  archived: z.boolean().optional(),
});

export const moveListSchema = z.object({
  position: z.number().int().min(0),
});

export const listIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateListInput = z.infer<typeof createListSchema>;
export type UpdateListInput = z.infer<typeof updateListSchema>;
export type MoveListInput = z.infer<typeof moveListSchema>;

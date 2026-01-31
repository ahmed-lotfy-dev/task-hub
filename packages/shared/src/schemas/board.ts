import { z } from 'zod';

export const createBoardSchema = z.object({
  name: z.string().min(1, 'Board name is required').max(100, 'Name too long'),
  description: z.string().max(1000, 'Description too long').default(''),
  workspaceId: z.string().min(1, 'Workspace ID is required'),
  visibility: z.enum(['private', 'team', 'public']).default('private'),
  background: z
    .object({
      type: z.enum(['color', 'image', 'gradient']),
      value: z.string(),
    })
    .optional(),
  template: z.enum(['kanban', 'scrum', 'simple', 'bug_tracker', 'blank']).default('blank'),
});

export const updateBoardSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).nullable().optional(),
  visibility: z.enum(['private', 'team', 'public']).optional(),
  background: z
    .object({
      type: z.enum(['color', 'image', 'gradient']),
      value: z.string(),
    })
    .optional(),
  settings: z
    .object({
      allowComments: z.boolean().optional(),
      allowReactions: z.boolean().optional(),
      cardCoverImages: z.boolean().optional(),
      showCardId: z.boolean().optional(),
    })
    .optional(),
  archived: z.boolean().optional(),
});

export const createLabelSchema = z.object({
  name: z.string().max(50),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color'),
});

export const updateLabelSchema = z.object({
  name: z.string().max(50).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
});

export const boardIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateBoardInput = z.infer<typeof createBoardSchema>;
export type UpdateBoardInput = z.infer<typeof updateBoardSchema>;
export type CreateLabelInput = z.infer<typeof createLabelSchema>;
export type UpdateLabelInput = z.infer<typeof updateLabelSchema>;

import { z } from 'zod';

export const createWorkspaceSchema = z.object({
  name: z.string().min(1, 'Workspace name is required').max(100, 'Name too long'),
  description: z.string().max(500, 'Description too long').default(''),
  visibility: z.enum(['private', 'team', 'public']).default('private'),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).nullable().optional(),
  visibility: z.enum(['private', 'team', 'public']).optional(),
  settings: z
    .object({
      allowGuests: z.boolean().optional(),
      defaultBoardVisibility: z.enum(['private', 'team', 'public']).optional(),
      enableTimeTracking: z.boolean().optional(),
    })
    .optional(),
});

export const inviteMemberSchema = z.object({
  email: z.string().email('Invalid email address'),
  role: z.enum(['admin', 'member', 'guest']),
});

export const updateMemberRoleSchema = z.object({
  role: z.enum(['admin', 'member', 'guest']),
});

export const workspaceIdSchema = z.object({
  id: z.string().uuid(),
});

export type CreateWorkspaceInput = z.infer<typeof createWorkspaceSchema>;
export type UpdateWorkspaceInput = z.infer<typeof updateWorkspaceSchema>;
export type InviteMemberInput = z.infer<typeof inviteMemberSchema>;
export type UpdateMemberRoleInput = z.infer<typeof updateMemberRoleSchema>;

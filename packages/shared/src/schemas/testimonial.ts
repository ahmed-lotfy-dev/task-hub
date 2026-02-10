import { z } from 'zod';

export const createTestimonialSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  quote: z.string().min(1, 'Quote is required').max(1000, 'Quote too long'),
  role: z.string().max(120).optional(),
  company: z.string().max(120).optional(),
  avatarUrl: z.string().url().optional(),
});

export const updateTestimonialSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  quote: z.string().min(1).max(1000).optional(),
  role: z.string().max(120).optional(),
  company: z.string().max(120).optional(),
  avatarUrl: z.string().url().optional(),
});

export type CreateTestimonialInput = z.infer<typeof createTestimonialSchema>;
export type UpdateTestimonialInput = z.infer<typeof updateTestimonialSchema>;

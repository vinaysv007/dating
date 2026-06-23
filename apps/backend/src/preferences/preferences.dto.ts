import { z } from 'zod';

const genderSchema = z.enum(['man', 'woman', 'nonbinary', 'other', 'prefer_not_to_say']);

export const updatePreferencesSchema = z.object({
  interestedIn: genderSchema.nullable().optional(),
  minAge: z.number().int().min(18).max(100).optional(),
  maxAge: z.number().int().min(18).max(100).optional(),
  maxDistance: z.number().int().min(1).max(500).optional(),
});
export type UpdatePreferencesInput = z.infer<typeof updatePreferencesSchema>;

export const getPreferencesParamsSchema = z.object({
  userId: z.string().min(1),
});
export type GetPreferencesParams = z.infer<typeof getPreferencesParamsSchema>;

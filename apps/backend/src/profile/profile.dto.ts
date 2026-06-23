import { z } from 'zod';

const genderSchema = z.enum(['man', 'woman', 'nonbinary', 'other', 'prefer_not_to_say']);
const lookingForSchema = z.enum(['relationship', 'casual', 'friendship', 'unsure']);

export const createProfileSchema = z.object({
  bio: z.string().max(1000).optional(),
  photos: z.array(z.string().url()).max(9).default([]),
  gender: genderSchema.optional(),
  dob: z.iso.date().optional(),
  interests: z.array(z.string().min(1).max(40)).max(20).default([]),
  preferences: z.record(z.string(), z.unknown()).default({}),
  lookingFor: lookingForSchema.optional(),
  height: z.number().int().min(80).max(250).optional(),
  occupation: z.string().max(255).optional(),
  education: z.string().max(255).optional(),
  completed: z.boolean().optional(),
});

export type CreateProfileInput = z.infer<typeof createProfileSchema>;

export const updateProfileSchema = createProfileSchema.partial();
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

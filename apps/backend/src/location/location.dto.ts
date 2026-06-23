import { z } from 'zod';

export const updateLocationSchema = z.object({
  location: z.string().max(255).nullable().optional(),
  latitude: z.number().min(-90).max(90).nullable().optional(),
  longitude: z.number().min(-180).max(180).nullable().optional(),
});
export type UpdateLocationInput = z.infer<typeof updateLocationSchema>;

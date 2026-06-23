import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userLocations } from '../db/Schema';
import type { UpdateLocationInput } from './location.dto';
import { UserLocation } from './location.types';

function toLocation(row: typeof userLocations.$inferSelect): UserLocation {
  return {
    userId: row.userId,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getLocationByUserId(
  userId: string,
): Promise<UserLocation | null> {
  const [row] = await db
    .select()
    .from(userLocations)
    .where(eq(userLocations.userId, userId))
    .limit(1);
  return row ? toLocation(row) : null;
}

/**
 * Upsert a user_locations row. If the row exists, only the fields present
 * in `input` are written — missing keys are left untouched. Pass `null` to
 * clear a field.
 */
export async function upsertLocation(
  userId: string,
  input: UpdateLocationInput,
): Promise<UserLocation> {
  const set: Partial<typeof userLocations.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.location !== undefined) set.location = input.location;
  if (input.latitude !== undefined) {
    set.latitude = input.latitude != null ? String(input.latitude) : null;
  }
  if (input.longitude !== undefined) {
    set.longitude = input.longitude != null ? String(input.longitude) : null;
  }

  const [row] = await db
    .insert(userLocations)
    .values({
      userId,
      location: input.location ?? null,
      latitude: input.latitude != null ? String(input.latitude) : null,
      longitude: input.longitude != null ? String(input.longitude) : null,
    })
    .onConflictDoUpdate({
      target: userLocations.userId,
      set,
    })
    .returning();
  return toLocation(row);
}

export async function deleteLocation(userId: string): Promise<void> {
  await db.delete(userLocations).where(eq(userLocations.userId, userId));
}

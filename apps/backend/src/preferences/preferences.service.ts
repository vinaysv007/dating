import { eq } from 'drizzle-orm';
import { db } from '../db';
import { userPreferences } from '../db/Schema';
import type { UpdatePreferencesInput } from './preferences.dto';
import { UserPreferences } from './preferences.types';

function toPreferences(row: typeof userPreferences.$inferSelect): UserPreferences {
  return {
    userId: row.userId,
    interestedIn: row.interestedIn,
    minAge: row.minAge,
    maxAge: row.maxAge,
    maxDistance: row.maxDistance,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getPreferencesByUserId(
  userId: string,
): Promise<UserPreferences | null> {
  const [row] = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return row ? toPreferences(row) : null;
}

/**
 * Upsert a user_preferences row. If the row exists, only the fields present
 * in `input` are written — missing keys are left untouched. Pass `null` to
 * clear a field.
 */
export async function upsertPreferences(
  userId: string,
  input: UpdatePreferencesInput,
): Promise<UserPreferences> {
  const set: Partial<typeof userPreferences.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.interestedIn !== undefined) set.interestedIn = input.interestedIn;
  if (input.minAge !== undefined) set.minAge = input.minAge;
  if (input.maxAge !== undefined) set.maxAge = input.maxAge;
  if (input.maxDistance !== undefined) set.maxDistance = input.maxDistance;

  const [row] = await db
    .insert(userPreferences)
    .values({
      userId,
      interestedIn: input.interestedIn ?? null,
      minAge: input.minAge ?? 18,
      maxAge: input.maxAge ?? 50,
      maxDistance: input.maxDistance ?? 50,
    })
    .onConflictDoUpdate({
      target: userPreferences.userId,
      set,
    })
    .returning();
  return toPreferences(row);
}

export async function deletePreferences(userId: string): Promise<void> {
  await db.delete(userPreferences).where(eq(userPreferences.userId, userId));
}

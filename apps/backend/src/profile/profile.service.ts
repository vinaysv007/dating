import { and, eq, isNull } from 'drizzle-orm';
import { db } from '../db';
import { profiles } from '../db/Schema';
import type { CreateProfileInput, UpdateProfileInput } from './profile.dto';
import {
  Profile,
  ProfileAlreadyExistsError,
  ProfileNotFoundError,
} from './profile.types';

function toProfile(row: typeof profiles.$inferSelect): Profile {
  return {
    id: row.id,
    userId: row.userId,
    bio: row.bio,
    photos: row.photos,
    gender: row.gender,
    dob: row.dob,
    interests: row.interests,
    lookingFor: row.lookingFor,
    height: row.height,
    occupation: row.occupation,
    education: row.education,
    completed: row.completed,
    deletedAt: row.deletedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export async function getProfileByUserId(userId: string): Promise<Profile | null> {
  const [row] = await db
    .select()
    .from(profiles)
    .where(and(eq(profiles.userId, userId), isNull(profiles.deletedAt)))
    .limit(1);
  return row ? toProfile(row) : null;
}

export async function createProfile(
  userId: string,
  input: CreateProfileInput,
): Promise<Profile> {
  // userId has a UNIQUE constraint at the DB level, so we must look across
  // BOTH active and soft-deleted rows. A soft-deleted profile is treated as
  // reusable: clear deletedAt and apply the new payload in place.
  const [existing] = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (existing && existing.deletedAt === null) {
    throw new ProfileAlreadyExistsError();
  }

  if (existing) {
    // Revive the soft-deleted row in place. Using UPDATE avoids the unique-
    // constraint violation that INSERT would hit.
    const [row] = await db
      .update(profiles)
      .set({
        ...buildCreatePayload(input),
        deletedAt: null,
      })
      .where(eq(profiles.id, existing.id))
      .returning();
    return toProfile(row);
  }

  const [row] = await db
    .insert(profiles)
    .values({ userId, ...buildCreatePayload(input) })
    .returning();
  return toProfile(row);
}

function buildCreatePayload(input: CreateProfileInput) {
  return {
    bio: input.bio ?? null,
    photos: input.photos,
    gender: input.gender ?? null,
    dob: input.dob ?? null,
    interests: input.interests,
    preferences: input.preferences,
    lookingFor: input.lookingFor ?? null,
    height: input.height ?? null,
    occupation: input.occupation ?? null,
    education: input.education ?? null,
    completed: input.completed ?? false,
  };
}

function buildUpdatePayload(input: UpdateProfileInput) {
  const payload: Partial<typeof profiles.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.bio !== undefined) payload.bio = input.bio;
  if (input.photos !== undefined) payload.photos = input.photos;
  if (input.gender !== undefined) payload.gender = input.gender;
  if (input.dob !== undefined) payload.dob = input.dob;
  if (input.interests !== undefined) payload.interests = input.interests;
  if (input.lookingFor !== undefined) payload.lookingFor = input.lookingFor;
  if (input.height !== undefined) payload.height = input.height;
  if (input.occupation !== undefined) payload.occupation = input.occupation;
  if (input.education !== undefined) payload.education = input.education;
  if (input.completed !== undefined) payload.completed = input.completed;
  return payload;
}

export async function updateProfile(
  userId: string,
  input: UpdateProfileInput,
): Promise<Profile> {
  const [row] = await db
    .update(profiles)
    .set(buildUpdatePayload(input))
    .where(and(eq(profiles.userId, userId), isNull(profiles.deletedAt)))
    .returning();
  if (!row) {
    throw new ProfileNotFoundError();
  }
  return toProfile(row);
}

export async function softDeleteProfile(userId: string): Promise<void> {
  const result = await db
    .update(profiles)
    .set({ deletedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(profiles.userId, userId), isNull(profiles.deletedAt)))
    .returning({ id: profiles.id });
  if (result.length === 0) {
    throw new ProfileNotFoundError();
  }
}

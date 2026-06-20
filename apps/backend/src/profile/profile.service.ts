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
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    interests: row.interests,
    preferences: row.preferences,
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
  const existing = await getProfileByUserId(userId);
  if (existing) {
    throw new ProfileAlreadyExistsError();
  }

  const [row] = await db
    .insert(profiles)
    .values({
      userId,
      bio: input.bio ?? null,
      photos: input.photos,
      gender: input.gender ?? null,
      dob: input.dob ?? null,
      location: input.location ?? null,
      latitude: input.latitude != null ? String(input.latitude) : null,
      longitude: input.longitude != null ? String(input.longitude) : null,
      interests: input.interests,
      preferences: input.preferences,
      lookingFor: input.lookingFor ?? null,
      height: input.height ?? null,
      occupation: input.occupation ?? null,
      education: input.education ?? null,
      completed: input.completed ?? false,
    })
    .returning();
  return toProfile(row);
}

function buildUpdatePayload(input: UpdateProfileInput) {
  const payload: Partial<typeof profiles.$inferInsert> = {
    updatedAt: new Date(),
  };
  if (input.bio !== undefined) payload.bio = input.bio;
  if (input.photos !== undefined) payload.photos = input.photos;
  if (input.gender !== undefined) payload.gender = input.gender;
  if (input.dob !== undefined) payload.dob = input.dob;
  if (input.location !== undefined) payload.location = input.location;
  if (input.latitude !== undefined) {
    payload.latitude = input.latitude != null ? String(input.latitude) : null;
  }
  if (input.longitude !== undefined) {
    payload.longitude = input.longitude != null ? String(input.longitude) : null;
  }
  if (input.interests !== undefined) payload.interests = input.interests;
  if (input.preferences !== undefined) payload.preferences = input.preferences;
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

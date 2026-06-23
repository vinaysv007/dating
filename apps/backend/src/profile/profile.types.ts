export type Gender = 'man' | 'woman' | 'nonbinary' | 'other' | 'prefer_not_to_say';
export type LookingFor = 'relationship' | 'casual' | 'friendship' | 'unsure';

import { HttpError } from '../middleware/HttpError';

export interface Profile {
  id: string;
  userId: string;
  bio: string | null;
  photos: string[];
  gender: Gender | null;
  dob: string | null;
  interests: string[];
  preferences: Record<string, unknown>;
  lookingFor: LookingFor | null;
  height: number | null;
  occupation: string | null;
  education: string | null;
  completed: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ProfileNotFoundError extends HttpError {
  constructor() {
    super(404, 'Profile not found');
    this.name = 'ProfileNotFoundError';
  }
}

export class ProfileAlreadyExistsError extends HttpError {
  constructor() {
    super(409, 'Profile already exists');
    this.name = 'ProfileAlreadyExistsError';
  }
}

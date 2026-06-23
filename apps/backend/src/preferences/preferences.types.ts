import { HttpError } from '../middleware/HttpError';

export type Gender = 'man' | 'woman' | 'nonbinary' | 'other' | 'prefer_not_to_say';

export interface UserPreferences {
  userId: string;
  interestedIn: Gender | null;
  minAge: number;
  maxAge: number;
  maxDistance: number;
  createdAt: Date;
  updatedAt: Date;
}

export class PreferencesNotFoundError extends HttpError {
  constructor() {
    super(404, 'Preferences not found');
    this.name = 'PreferencesNotFoundError';
  }
}

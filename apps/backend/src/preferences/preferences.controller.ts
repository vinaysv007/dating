import { NextFunction, Request, Response } from 'express';
import { getAuthedUserId } from '../middleware/requireAuthedUser';
import { getPreferencesParamsSchema, updatePreferencesSchema } from './preferences.dto';
import {
  getPreferencesByUserId,
  upsertPreferences,
} from './preferences.service';
import { PreferencesNotFoundError } from './preferences.types';

export async function getMyPreferences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const preferences = await getPreferencesByUserId(getAuthedUserId(req));
    if (!preferences) {
      throw new PreferencesNotFoundError();
    }
    res.status(200).json(preferences);
  } catch (err) {
    next(err);
  }
}

export async function updateMyPreferences(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updatePreferencesSchema.parse(req.body);
    const preferences = await upsertPreferences(getAuthedUserId(req), input);
    res.status(200).json(preferences);
  } catch (err) {
    next(err);
  }
}

export async function getPreferencesById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Auth gate: requireAuthedUser already validated the session. The call
    // here is just to surface a 401 if it wasn't run. Any authed user can
    // fetch any preferences row by userId.
    getAuthedUserId(req);
    const { userId } = getPreferencesParamsSchema.parse(req.params);
    const preferences = await getPreferencesByUserId(userId);
    if (!preferences) {
      throw new PreferencesNotFoundError();
    }
    res.status(200).json(preferences);
  } catch (err) {
    next(err);
  }
}

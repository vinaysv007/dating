import { NextFunction, Request, Response } from 'express';
import { getAuthedUserId } from '../middleware/requireAuthedUser';
import { createProfileSchema, updateProfileSchema } from './profile.dto';
import {
  createProfile,
  getProfileByUserId,
  softDeleteProfile,
  updateProfile,
} from './profile.service';
import { ProfileNotFoundError } from './profile.types';

export async function getMyProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const profile = await getProfileByUserId(getAuthedUserId(req));
    if (!profile) {
      throw new ProfileNotFoundError();
    }
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}

export async function createMyProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = createProfileSchema.parse(req.body);
    const profile = await createProfile(getAuthedUserId(req), input);
    res.status(201).json(profile);
  } catch (err) {
    next(err);
  }
}

export async function updateMyProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updateProfileSchema.parse(req.body);
    const profile = await updateProfile(getAuthedUserId(req), input);
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}

export async function deleteMyProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    await softDeleteProfile(getAuthedUserId(req));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function getProfileById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // Auth gate: requireAuthedUser already validated the session. The call
    // here is just to surface a 401 if it wasn't run. Any authed user can
    // fetch any profile by id.
    getAuthedUserId(req);
    const profile = await getProfileByUserId(req.params.userId);
    if (!profile) {
      throw new ProfileNotFoundError();
    }
    res.status(200).json(profile);
  } catch (err) {
    next(err);
  }
}

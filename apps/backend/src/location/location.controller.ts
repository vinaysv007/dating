import { NextFunction, Request, Response } from 'express';
import { getAuthedUserId } from '../middleware/requireAuthedUser';
import { updateLocationSchema } from './location.dto';
import {
  getLocationByUserId,
  upsertLocation,
} from './location.service';
import { LocationNotFoundError } from './location.types';

export async function getMyLocation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const location = await getLocationByUserId(getAuthedUserId(req));
    if (!location) {
      throw new LocationNotFoundError();
    }
    res.status(200).json(location);
  } catch (err) {
    next(err);
  }
}

export async function updateMyLocation(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const input = updateLocationSchema.parse(req.body);
    const location = await upsertLocation(getAuthedUserId(req), input);
    res.status(200).json(location);
  } catch (err) {
    next(err);
  }
}

export async function getLocationById(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    getAuthedUserId(req);
    const location = await getLocationByUserId(req.params.userId);
    if (!location) {
      throw new LocationNotFoundError();
    }
    res.status(200).json(location);
  } catch (err) {
    next(err);
  }
}

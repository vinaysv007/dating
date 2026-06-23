import { NextFunction, Request, Response } from 'express';
import { getAuth } from '@clerk/express';
import { HttpError } from './HttpError';

export class UnauthorizedError extends HttpError {
  constructor(message = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

/**
 * Express middleware that requires a valid Clerk session.
 * Populates `req.authedUserId` for downstream handlers.
 * Must be installed AFTER `clerkMiddleware()`.
 */
export function requireAuthedUser(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const auth = getAuth(req);
  if (!auth.userId) {
    return next(new UnauthorizedError());
  }
  (req as Request & { authedUserId?: string }).authedUserId = auth.userId;
  next();
}

export function getAuthedUserId(req: Request): string {
  const userId = (req as Request & { authedUserId?: string }).authedUserId;
  if (!userId) {
    throw new Error(
      'authedUserId missing — requireAuthedUser middleware not run',
    );
  }
  return userId;
}

import { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { HttpError } from './HttpError';

export function handleError(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({ message: 'Invalid input', issues: err.issues });
    return;
  }
  if (err instanceof HttpError) {
    res.status(err.status).json({ message: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ message: 'Internal server error' });
}

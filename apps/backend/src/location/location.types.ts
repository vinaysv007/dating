import { HttpError } from '../middleware/HttpError';

export interface UserLocation {
  userId: string;
  location: string | null;
  latitude: string | null;
  longitude: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class LocationNotFoundError extends HttpError {
  constructor() {
    super(404, 'Location not found');
    this.name = 'LocationNotFoundError';
  }
}

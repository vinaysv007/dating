import { Router } from 'express';
import { requireAuthedUser } from '../middleware/requireAuthedUser';
import {
  getLocationById,
  getMyLocation,
  updateMyLocation,
} from './location.controller';

const router: Router = Router();

router.use(requireAuthedUser);

router.get('/me', getMyLocation);
router.put('/me', updateMyLocation);

router.get('/:userId', getLocationById);

export default router;

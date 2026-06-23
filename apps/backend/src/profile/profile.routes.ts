import { Router } from 'express';
import { requireAuthedUser } from '../middleware/requireAuthedUser';
import {
  createMyProfile,
  deleteMyProfile,
  getMyProfile,
  getProfileById,
  updateMyProfile,
} from './profile.controller';

const router: Router = Router();

router.use(requireAuthedUser);

router.get('/me', getMyProfile);
router.post('/me', createMyProfile);
router.patch('/me', updateMyProfile);
router.delete('/me', deleteMyProfile);

router.get('/:userId', getProfileById);

export default router;

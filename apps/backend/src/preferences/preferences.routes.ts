import { Router } from 'express';
import { requireAuthedUser } from '../middleware/requireAuthedUser';
import {
  getMyPreferences,
  getPreferencesById,
  updateMyPreferences,
} from './preferences.controller';

const router: Router = Router();

router.use(requireAuthedUser);

router.get('/me', getMyPreferences);
router.put('/me', updateMyPreferences);

router.get('/:userId', getPreferencesById);

export default router;

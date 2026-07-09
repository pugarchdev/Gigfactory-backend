import { Router } from 'express';
import mediaSettingsController from '../controllers/mediaSettingsController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

// Secure all settings endpoints
router.use(requireAdmin);

router.get('/', mediaSettingsController.getSettings);
router.put('/', mediaSettingsController.updateSettings);

export default router;

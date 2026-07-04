import { Router } from 'express';
import mediaSettingsController from '../controllers/mediaSettingsController.js';

const router = Router();

router.get('/', mediaSettingsController.getSettings);
router.put('/', mediaSettingsController.updateSettings);

export default router;

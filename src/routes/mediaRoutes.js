import { Router } from 'express';
import mediaController from '../controllers/mediaController.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', mediaController.list);
router.get('/:id', mediaController.getById);

// Protected administrative actions
router.post('/', requireAdmin, mediaController.create);
router.put('/:id', requireAdmin, mediaController.update);
router.put('/:id/reorder', requireAdmin, mediaController.reorder);
router.delete('/:id', requireAdmin, mediaController.remove);

export default router;

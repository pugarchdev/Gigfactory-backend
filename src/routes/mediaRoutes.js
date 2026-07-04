import { Router } from 'express';
import mediaController from '../controllers/mediaController.js';

const router = Router();

router.get('/', mediaController.list);
router.get('/:id', mediaController.getById);
router.post('/', mediaController.create);
router.put('/:id', mediaController.update);
router.put('/:id/reorder', mediaController.reorder);
router.delete('/:id', mediaController.remove);

export default router;

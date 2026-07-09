import faqController from '../controllers/faqController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = createCrudRouter(faqController);

router.post('/bulk', faqController.bulkCreate);
router.put('/:id/reorder', faqController.reorder);

export default router;

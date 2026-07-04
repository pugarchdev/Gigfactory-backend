import projectsController from '../controllers/projectsController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = createCrudRouter(projectsController);

router.put('/:id/reorder', projectsController.reorder);

export default router;


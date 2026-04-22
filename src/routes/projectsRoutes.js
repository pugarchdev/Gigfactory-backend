import projectsController from '../controllers/projectsController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = createCrudRouter(projectsController);

export default router;


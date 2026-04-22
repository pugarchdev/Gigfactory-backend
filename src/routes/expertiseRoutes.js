import expertiseController from '../controllers/expertiseController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = createCrudRouter(expertiseController);

export default router;


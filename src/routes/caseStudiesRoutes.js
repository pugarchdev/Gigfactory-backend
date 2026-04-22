import caseStudiesController from '../controllers/caseStudiesController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = createCrudRouter(caseStudiesController);

export default router;


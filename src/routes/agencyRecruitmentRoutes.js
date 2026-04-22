import agencyRecruitmentController from '../controllers/agencyRecruitmentController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = createCrudRouter(agencyRecruitmentController);

export default router;


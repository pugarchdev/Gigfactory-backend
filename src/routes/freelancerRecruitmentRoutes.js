import freelancerRecruitmentController from '../controllers/freelancerRecruitmentController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = createCrudRouter(freelancerRecruitmentController);

export default router;


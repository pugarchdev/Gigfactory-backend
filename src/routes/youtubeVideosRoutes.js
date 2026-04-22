import youtubeVideosController from '../controllers/youtubeVideosController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = createCrudRouter(youtubeVideosController);

export default router;


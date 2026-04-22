import { Router } from 'express';
import adminsController from '../controllers/adminsController.js';
import { createCrudRouter } from './crudRouterFactory.js';

const router = Router();

// Custom routes first
router.post('/login', adminsController.login);

// CRUD routes
const crudRouter = createCrudRouter(adminsController);
router.use('/', crudRouter);

export default router;

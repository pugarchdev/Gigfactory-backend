import { Router } from 'express';

export function createCrudRouter(controller) {
  const router = Router();

  router.get('/', controller.list);
  router.get('/count', controller.count);
  router.get('/:id', controller.getById);
  router.post('/', controller.create);
  router.put('/:id', controller.update);
  router.delete('/:id', controller.remove);

  return router;
}


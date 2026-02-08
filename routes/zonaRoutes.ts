import { Router } from 'express';
import { findAll, findOne, add, update, remove, findZonasActivas } from '../controllers/zonaController.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const zonaRouter = Router()

zonaRouter.get('/activos/', findZonasActivas)
zonaRouter.get('/', authMiddleware, adminOnly, findAll)
zonaRouter.get('/:id', authMiddleware, adminOnly, findOne)
zonaRouter.post('/', authMiddleware, adminOnly, add)
zonaRouter.put('/:id', authMiddleware, adminOnly, update)
zonaRouter.patch('/:id', authMiddleware, adminOnly, update)
zonaRouter.delete('/:id', authMiddleware, adminOnly, remove)
import { Router } from 'express';
import { findAll, findOne, add, update, remove, findZonasActivas } from '../controllers/zonaController.js';
import { adminOnly } from '../middleware/adminOnly.js';

export const zonaRouter = Router()

zonaRouter.get('/activos/', findZonasActivas)
zonaRouter.get('/', adminOnly, findAll)
zonaRouter.get('/:id', adminOnly, findOne)
zonaRouter.post('/',  adminOnly,add)
zonaRouter.put('/:id', adminOnly, update)
zonaRouter.patch('/:id', adminOnly, update)
zonaRouter.delete('/:id',  adminOnly, remove)
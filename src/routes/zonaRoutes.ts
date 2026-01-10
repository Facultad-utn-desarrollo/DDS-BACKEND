import { Router } from 'express';
import { findAll, findOne, add, update, remove, findZonasActivas } from '../controllers/zonaController.js';

export const zonaRouter = Router()

zonaRouter.get('/', findAll)
zonaRouter.get('/activos/', findZonasActivas)
zonaRouter.get('/:id', findOne)
zonaRouter.post('/', add)
zonaRouter.put('/:id', update)
zonaRouter.patch('/:id', update)
zonaRouter.delete('/:id', remove)
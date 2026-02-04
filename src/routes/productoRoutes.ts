import { Router } from 'express';
import { findAll, findOne, add, update, remove, findAllByFilters, findProductosActivos } from '../controllers/productoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

export const productoRouter = Router()

productoRouter.get('/', findAll)
productoRouter.get('/filter', findAllByFilters)
productoRouter.get('/activos', findProductosActivos)
productoRouter.get('/:codigo', findOne)
productoRouter.post('/', adminOnly, add)
productoRouter.put('/:codigo', adminOnly, update)
productoRouter.patch('/:codigo', adminOnly, update)
productoRouter.delete('/:codigo', adminOnly, remove)
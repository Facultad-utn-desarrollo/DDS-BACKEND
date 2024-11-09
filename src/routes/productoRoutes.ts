import { Router } from 'express';
import { findAll, findOne, add, update, remove, findAllByFilters } from '../controllers/productoController.js';

export const productoRouter = Router()

productoRouter.get('/', findAll)
productoRouter.get('/filter', findAllByFilters)
productoRouter.get('/:codigo', findOne)
productoRouter.post('/', add)
productoRouter.put('/:codigo', update)
productoRouter.patch('/:codigo', update)
productoRouter.delete('/:codigo', remove)
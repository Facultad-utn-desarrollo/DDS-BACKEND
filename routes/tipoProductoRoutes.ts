import { Router } from 'express';
import { findAll, findOne, add, update, remove, findTiposDeProductoActivos } from '../controllers/tipoProductoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

export const tipoProductoRouter = Router()

tipoProductoRouter.get('/', findAll)
tipoProductoRouter.get('/activos/', findTiposDeProductoActivos)
tipoProductoRouter.get('/:id', adminOnly, findOne)
tipoProductoRouter.post('/', adminOnly, add)
tipoProductoRouter.put('/',  adminOnly,update)
tipoProductoRouter.patch('/:id', adminOnly, update)
tipoProductoRouter.delete('/:id', adminOnly, remove)
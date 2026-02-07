import { Router } from 'express';
import { findAll, findOne, add, update, remove, findByPedidoId } from '../controllers/lineaProductoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

export const lineasRouter = Router()

lineasRouter.get('/', adminOnly, findAll)
lineasRouter.get('/:id', adminOnly, findOne)
lineasRouter.post('/',  adminOnly,add)
lineasRouter.put('/:id', adminOnly, update)
lineasRouter.patch('/:id', adminOnly, update)
lineasRouter.delete('/:id', adminOnly, remove)
lineasRouter.get('/pedido/:pedidoId', findByPedidoId)
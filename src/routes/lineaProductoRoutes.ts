import { Router } from 'express';
import { findAll, findOne, add, update, remove, findByPedidoId } from '../controllers/lineaProductoController.js';

export const lineasRouter = Router()

lineasRouter.get('/', findAll)
lineasRouter.get('/:id', findOne)
lineasRouter.post('/', add)
lineasRouter.put('/:id', update)
lineasRouter.patch('/:id', update)
lineasRouter.delete('/:id', remove)
lineasRouter.get('/pedido/:pedidoId', findByPedidoId)
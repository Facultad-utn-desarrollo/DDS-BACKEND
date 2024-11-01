import { Router } from 'express';
import { findAll, findOne, add, update, remove, findPedidosSinPago } from '../controllers/pedidoController.js';

export const pedidoRouter = Router()

pedidoRouter.get('/', findAll)
pedidoRouter.get('/:nroPedido', findOne)
pedidoRouter.post('/', add)
pedidoRouter.put('/:nroPedido', update)
pedidoRouter.patch('/:nroPedido', update)
pedidoRouter.delete('/:nroPedido', remove)
pedidoRouter.get('/pedidos/impagos', findPedidosSinPago);
import { Router } from 'express';
import { findAll, findOne, add, update, remove, findPedidosSinPago, findPedidosPagosSinEntrega , findAllPedidosByFilters} from '../controllers/pedidoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

export const pedidoRouter = Router()

pedidoRouter.get('/', adminOnly, findAll)
pedidoRouter.get('/:nroPedido',  findOne)
pedidoRouter.post('/', add)
pedidoRouter.put('/:nroPedido',  update)
pedidoRouter.patch('/:nroPedido', update)
pedidoRouter.delete('/:nroPedido', adminOnly, remove)
pedidoRouter.get('/pedidos/impagos',  adminOnly,findPedidosSinPago);
pedidoRouter.get('/pedidos/noentregados',  adminOnly,findPedidosPagosSinEntrega);
pedidoRouter.get('/pedido/filter', adminOnly, findAllPedidosByFilters)
 
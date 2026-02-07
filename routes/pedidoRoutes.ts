import { Router } from 'express';
import { findAll, findOne, add, update, remove, findPedidosSinPago, findPedidosPagosSinEntrega , findAllPedidosByFilters, findMisPedidos, findMisPedidosImpagos} from '../controllers/pedidoController.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

export const pedidoRouter = Router()



pedidoRouter.get('/mis-pedidos', authMiddleware, findMisPedidos);
pedidoRouter.get('/mis-pedidos-impagos', authMiddleware, findMisPedidosImpagos);
pedidoRouter.get('/', adminOnly, findAll)
pedidoRouter.get('/:nroPedido',authMiddleware,  findOne)
pedidoRouter.post('/', add)
pedidoRouter.put('/:nroPedido',  update)
pedidoRouter.patch('/:nroPedido', update)
pedidoRouter.delete('/:nroPedido', remove)
pedidoRouter.get('/pedidos/impagos',  adminOnly,findPedidosSinPago);
pedidoRouter.get('/pedidos/noentregados',  adminOnly,findPedidosPagosSinEntrega);
pedidoRouter.get('/pedido/filter', adminOnly, findAllPedidosByFilters)


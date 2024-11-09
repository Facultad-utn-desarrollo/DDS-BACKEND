import { Router } from 'express';
import { findAll, findOne, add, update, remove, findPedidosSinPago, findPedidosPagosSinEntrega , findAllPedidosByFilters} from '../controllers/pedidoController.js';

export const pedidoRouter = Router()

pedidoRouter.get('/', findAll)
pedidoRouter.get('/:nroPedido', findOne)
pedidoRouter.post('/', add)
pedidoRouter.put('/:nroPedido', update)
pedidoRouter.patch('/:nroPedido', update)
pedidoRouter.delete('/:nroPedido', remove)
pedidoRouter.get('/pedidos/impagos', findPedidosSinPago);
pedidoRouter.get('/pedidos/noentregados', findPedidosPagosSinEntrega);
pedidoRouter.get('/pedido/filter', findAllPedidosByFilters)
 
import { Router } from "express";
import { findAll, findOne, add, update, remove, findAllByFilters, findMisEntregas, findMisPedidosParaEntrega } from '../controllers/entregaController.js';
import { adminOnly } from "../middleware/adminOnly.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const entregaRouter = Router()
entregaRouter.get('/mis-pedidos-para-entrega', findMisPedidosParaEntrega);
entregaRouter.get('/mis-entregas', findMisEntregas);
entregaRouter.get('/filter', adminOnly, findAllByFilters);
entregaRouter.get('/',  adminOnly,findAll)
entregaRouter.get('/:id', adminOnly, findOne)
entregaRouter.post('/', add)
entregaRouter.put('/:id',update)
entregaRouter.patch('/:id', update)
entregaRouter.delete('/:id', adminOnly, remove)

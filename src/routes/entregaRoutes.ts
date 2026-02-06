import { Router } from "express";
import { findAll, findOne, add, update, remove, findAllByFilters, findMisEntregas } from '../controllers/entregaController.js';
import { adminOnly } from "../middleware/adminOnly.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

export const entregaRouter = Router()

entregaRouter.get('/mis-entregas', authMiddleware, findMisEntregas);
entregaRouter.get('/filter', adminOnly, findAllByFilters);
entregaRouter.get('/',  adminOnly,findAll)
entregaRouter.get('/:id', adminOnly, findOne)
entregaRouter.post('/', adminOnly, add)
entregaRouter.put('/:id',  adminOnly,update)
entregaRouter.patch('/:id', adminOnly, update)
entregaRouter.delete('/:id', adminOnly, remove)

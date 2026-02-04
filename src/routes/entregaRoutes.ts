import { Router } from "express";
import { findAll, findOne, add, update, remove, findAllByFilters } from '../controllers/entregaController.js';
import { adminOnly } from "../middleware/adminOnly.js";

export const entregaRouter = Router()

entregaRouter.get('/filter', adminOnly, findAllByFilters);
entregaRouter.get('/',  adminOnly,findAll)
entregaRouter.get('/:id', adminOnly, findOne)
entregaRouter.post('/', adminOnly, add)
entregaRouter.put('/:id',  adminOnly,update)
entregaRouter.patch('/:id', adminOnly, update)
entregaRouter.delete('/:id', adminOnly, remove)

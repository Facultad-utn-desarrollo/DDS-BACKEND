import { Router } from "express";
import { findAll, findOne, add, update, remove, findAllByFilters } from '../controllers/entregaController.js';

export const entregaRouter = Router()

entregaRouter.get('/filter', findAllByFilters);
entregaRouter.get('/', findAll)
entregaRouter.get('/:id', findOne)
entregaRouter.post('/', add)
entregaRouter.put('/:id', update)
entregaRouter.patch('/:id', update)
entregaRouter.delete('/:id', remove)

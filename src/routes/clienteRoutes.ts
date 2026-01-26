import { Router } from 'express';
import { findAll, findOne, add, update, remove, findClientesActivos } from '../controllers/clienteController.js';

export const clienteRouter = Router();

clienteRouter.get('/activos', findClientesActivos);
clienteRouter.get('/', findAll);
clienteRouter.get('/:id', findOne);
clienteRouter.post('/', add);
clienteRouter.put('/:id', update);
clienteRouter.patch('/:id', update);
clienteRouter.delete('/:id', remove);

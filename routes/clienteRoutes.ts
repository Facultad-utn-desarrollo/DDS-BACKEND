import { Router } from 'express';
import { findAll, findOne, add, update, remove, findClientesActivos, findMyself } from '../controllers/clienteController.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { authMiddleware } from '../middleware/auth.middleware.js';


export const clienteRouter = Router();
clienteRouter.get('/me', authMiddleware, findMyself);
clienteRouter.get('/activos', adminOnly,  findClientesActivos);
clienteRouter.get('/',adminOnly, findAll);
clienteRouter.get('/:id',adminOnly, findOne);
clienteRouter.post('/',adminOnly, add);
clienteRouter.put('/:id',adminOnly, update);
clienteRouter.patch('/:id', adminOnly ,update);
clienteRouter.delete('/:id', adminOnly, remove);
 
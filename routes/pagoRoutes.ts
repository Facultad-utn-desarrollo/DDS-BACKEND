import { Router } from 'express';
import { findAll, findOne, add, update, remove, findMisPagos } from '../controllers/pagoController.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { authMiddleware } from '../middleware/auth.middleware.js';


export const pagoRouter = Router()

pagoRouter.get('/mis-pagos', authMiddleware, findMisPagos);
pagoRouter.get('/', adminOnly, findAll)
pagoRouter.get('/:id',adminOnly, findOne)
pagoRouter.post('/', add)
pagoRouter.put('/:id', adminOnly, update)
pagoRouter.patch('/:id', adminOnly, update)
pagoRouter.delete('/:id', adminOnly, remove)
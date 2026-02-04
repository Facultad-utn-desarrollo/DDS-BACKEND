import { Router } from 'express';
import { findAll, findOne, add, update, remove, findTiposDePagoActivos } from '../controllers/tipoPagoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

export const tipoPagoRouter = Router()

tipoPagoRouter.get('/', adminOnly, findAll)
tipoPagoRouter.get('/activos/', adminOnly, findTiposDePagoActivos)
tipoPagoRouter.get('/:id', adminOnly, findOne)
tipoPagoRouter.post('/',  adminOnly,add)
tipoPagoRouter.put('/:id', adminOnly, update)
tipoPagoRouter.patch('/:id', adminOnly, update)
tipoPagoRouter.delete('/:id', adminOnly, remove)
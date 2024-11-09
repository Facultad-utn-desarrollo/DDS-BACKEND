import { Router } from 'express';
import { findAll, findOne, add, update, remove, findTiposDePagoActivos } from '../controllers/tipoPagoController.js';

export const tipoPagoRouter = Router()

tipoPagoRouter.get('/', findAll)
tipoPagoRouter.get('/activos/', findTiposDePagoActivos)
tipoPagoRouter.get('/:id', findOne)
tipoPagoRouter.post('/', add)
tipoPagoRouter.put('/:id', update)
tipoPagoRouter.patch('/:id', update)
tipoPagoRouter.delete('/:id', remove)
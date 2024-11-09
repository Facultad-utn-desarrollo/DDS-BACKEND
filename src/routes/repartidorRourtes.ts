import { Router } from "express";
import { findAll, findOne, add, update, remove, findRepartidoresActivos } from '../controllers/repartidorController.js';


export const repartidorRouter = Router()

repartidorRouter.get('/', findAll)
repartidorRouter.get('/activos/', findRepartidoresActivos)
repartidorRouter.get('/:id', findOne)
repartidorRouter.post('/', add)
repartidorRouter.put('/:id', update)
repartidorRouter.patch('/:id', update)
repartidorRouter.delete('/:id', remove)
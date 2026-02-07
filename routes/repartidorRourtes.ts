import { Router } from "express";
import { findAll, findOne, add, update, remove, findRepartidoresActivos } from '../controllers/repartidorController.js';
import { adminOnly } from "../middleware/adminOnly.js";


export const repartidorRouter = Router()

repartidorRouter.get('/', adminOnly, findAll)
repartidorRouter.get('/activos/',findRepartidoresActivos)
repartidorRouter.get('/:id', adminOnly, findOne)
repartidorRouter.post('/', adminOnly, add)
repartidorRouter.put('/:id', adminOnly, update)
repartidorRouter.patch('/:id',  adminOnly,update)
repartidorRouter.delete('/:id', adminOnly, remove)
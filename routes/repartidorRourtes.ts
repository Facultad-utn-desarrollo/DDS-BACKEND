import { Router } from "express";
import { findAll, findOne, add, update, remove, findRepartidoresActivos } from '../controllers/repartidorController.js';
import { adminOnly } from "../middleware/adminOnly.js";

/**
 * @swagger
 * /api/v2/repartidores:
 *   get:
 *     summary: Obtener todos los repartidores
 *     description: Lista todos los repartidores (solo admin)
 *     tags:
 *       - Repartidores
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de repartidores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Repartidor'
 *   post:
 *     summary: Crear nuevo repartidor
 *     description: Crea un nuevo repartidor (solo admin)
 *     tags:
 *       - Repartidores
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repartidor'
 *     responses:
 *       201:
 *         description: Repartidor creado
 */

/**
 * @swagger
 * /api/v2/repartidores/activos:
 *   get:
 *     summary: Obtener repartidores activos
 *     description: Lista solo los repartidores activos
 *     tags:
 *       - Repartidores
 *     responses:
 *       200:
 *         description: Lista de repartidores activos
 */

/**
 * @swagger
 * /api/v2/repartidores/{id}:
 *   get:
 *     summary: Obtener repartidor por ID
 *     description: Retorna los datos de un repartidor específico (solo admin)
 *     tags:
 *       - Repartidores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del repartidor
 *       404:
 *         description: Repartidor no encontrado
 *   put:
 *     summary: Actualizar repartidor
 *     description: Actualiza un repartidor (solo admin)
 *     tags:
 *       - Repartidores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repartidor'
 *     responses:
 *       200:
 *         description: Repartidor actualizado
 *   patch:
 *     summary: Actualizar repartidor parcialmente
 *     description: Actualiza parcialmente un repartidor (solo admin)
 *     tags:
 *       - Repartidores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Repartidor'
 *     responses:
 *       200:
 *         description: Repartidor actualizado
 *   delete:
 *     summary: Eliminar repartidor
 *     description: Elimina un repartidor (solo admin)
 *     tags:
 *       - Repartidores
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Repartidor eliminado
 */

export const repartidorRouter = Router()

// Rutas específicas primero
repartidorRouter.get('/activos/',findRepartidoresActivos)
// Rutas genéricas
repartidorRouter.get('/', adminOnly, findAll)
repartidorRouter.post('/', adminOnly, add)
// Rutas con parámetros después
repartidorRouter.get('/:id', adminOnly, findOne)
repartidorRouter.put('/:id', adminOnly, update)
repartidorRouter.patch('/:id',  adminOnly,update)
repartidorRouter.delete('/:id', adminOnly, remove)
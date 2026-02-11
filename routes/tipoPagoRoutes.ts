import { Router } from 'express';
import { findAll, findOne, add, update, remove, findTiposDePagoActivos } from '../controllers/tipoPagoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

/**
 * @swagger
 * /api/v2/tiposDePago/activos:
 *   get:
 *     summary: Obtener tipos de pago activos
 *     description: Lista solo los tipos de pago activos
 *     tags:
 *       - Tipos de Pago
 *     responses:
 *       200:
 *         description: Lista de tipos de pago activos
 */

/**
 * @swagger
 * /api/v2/tiposDePago:
 *   get:
 *     summary: Obtener todos los tipos de pago
 *     description: Lista todos los tipos de pago (solo admin)
 *     tags:
 *       - Tipos de Pago
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de tipos de pago
 *   post:
 *     summary: Crear nuevo tipo de pago
 *     description: Crea un nuevo tipo de pago (solo admin)
 *     tags:
 *       - Tipos de Pago
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Tipo de pago creado
 */

/**
 * @swagger
 * /api/v2/tiposDePago/{id}:
 *   get:
 *     summary: Obtener tipo de pago por ID
 *     description: Retorna un tipo de pago específico (solo admin)
 *     tags:
 *       - Tipos de Pago
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
 *         description: Datos del tipo de pago
 *       404:
 *         description: No encontrado
 *   put:
 *     summary: Actualizar tipo de pago
 *     description: Actualiza un tipo de pago (solo admin)
 *     tags:
 *       - Tipos de Pago
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
 *             type: object
 *     responses:
 *       200:
 *         description: Actualizado
 *   patch:
 *     summary: Actualizar tipo de pago parcialmente
 *     description: Actualiza parcialmente un tipo de pago (solo admin)
 *     tags:
 *       - Tipos de Pago
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
 *             type: object
 *     responses:
 *       200:
 *         description: Actualizado
 *   delete:
 *     summary: Eliminar tipo de pago
 *     description: Elimina un tipo de pago (solo admin)
 *     tags:
 *       - Tipos de Pago
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
 *         description: Eliminado
 */

export const tipoPagoRouter = Router()

// Rutas específicas primero
tipoPagoRouter.get('/activos/', findTiposDePagoActivos)
// Rutas genéricas
tipoPagoRouter.get('/', adminOnly, findAll)
tipoPagoRouter.post('/',  adminOnly,add)
// Rutas con parámetros después
tipoPagoRouter.get('/:id', adminOnly, findOne)
tipoPagoRouter.put('/:id', adminOnly, update)
tipoPagoRouter.patch('/:id', adminOnly, update)
tipoPagoRouter.delete('/:id', adminOnly, remove)
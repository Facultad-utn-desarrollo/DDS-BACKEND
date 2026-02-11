import { Router } from 'express';
import { findAll, findOne, add, update, remove, findMisPagos } from '../controllers/pagoController.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/v2/pago/mis-pagos:
 *   get:
 *     summary: Obtener mis pagos
 *     description: Lista todos los pagos realizados por el cliente autenticado
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 */

/**
 * @swagger
 * /api/v2/pago:
 *   get:
 *     summary: Obtener todos los pagos
 *     description: Lista todos los pagos (solo admin)
 *     tags:
 *       - Pagos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pagos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pago'
 *   post:
 *     summary: Crear nuevo pago
 *     description: Crea un nuevo pago
 *     tags:
 *       - Pagos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       201:
 *         description: Pago creado exitosamente
 */

/**
 * @swagger
 * /api/v2/pago/{id}:
 *   get:
 *     summary: Obtener pago por ID
 *     description: Retorna los datos de un pago específico (solo admin)
 *     tags:
 *       - Pagos
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
 *         description: Datos del pago
 *       404:
 *         description: Pago no encontrado
 *   put:
 *     summary: Actualizar pago
 *     description: Actualiza un pago (solo admin)
 *     tags:
 *       - Pagos
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
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       200:
 *         description: Pago actualizado
 *   patch:
 *     summary: Actualizar pago parcialmente
 *     description: Actualiza parcialmente un pago (solo admin)
 *     tags:
 *       - Pagos
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
 *             $ref: '#/components/schemas/Pago'
 *     responses:
 *       200:
 *         description: Pago actualizado
 *   delete:
 *     summary: Eliminar pago
 *     description: Elimina un pago (solo admin)
 *     tags:
 *       - Pagos
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
 *         description: Pago eliminado
 */

export const pagoRouter = Router()

// Rutas específicas primero
pagoRouter.get('/mis-pagos', authMiddleware, findMisPagos);
// Rutas genéricas
pagoRouter.get('/', adminOnly, findAll)
pagoRouter.post('/', add)
// Rutas con parámetros después
pagoRouter.get('/:id',adminOnly, findOne)
pagoRouter.put('/:id', adminOnly, update)
pagoRouter.patch('/:id', adminOnly, update)
pagoRouter.delete('/:id', adminOnly, remove)
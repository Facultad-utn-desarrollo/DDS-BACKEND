import { Router } from 'express';
import { findAll, findOne, add, update, remove, findZonasActivas } from '../controllers/zonaController.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/v2/zonas/activos:
 *   get:
 *     summary: Obtener zonas activas
 *     description: Lista solo las zonas activas
 *     tags:
 *       - Zonas
 *     responses:
 *       200:
 *         description: Lista de zonas activas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zona'
 */

/**
 * @swagger
 * /api/v2/zonas:
 *   get:
 *     summary: Obtener todas las zonas
 *     description: Lista todas las zonas (solo admin)
 *     tags:
 *       - Zonas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todas las zonas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Zona'
 *   post:
 *     summary: Crear nueva zona
 *     description: Crea una nueva zona (solo admin)
 *     tags:
 *       - Zonas
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Zona'
 *     responses:
 *       201:
 *         description: Zona creada
 */

/**
 * @swagger
 * /api/v2/zonas/{id}:
 *   get:
 *     summary: Obtener zona por ID
 *     description: Retorna los datos de una zona específica (solo admin)
 *     tags:
 *       - Zonas
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
 *         description: Datos de la zona
 *       404:
 *         description: Zona no encontrada
 *   put:
 *     summary: Actualizar zona
 *     description: Actualiza una zona (solo admin)
 *     tags:
 *       - Zonas
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
 *             $ref: '#/components/schemas/Zona'
 *     responses:
 *       200:
 *         description: Zona actualizada
 *   patch:
 *     summary: Actualizar zona parcialmente
 *     description: Actualiza parcialmente una zona (solo admin)
 *     tags:
 *       - Zonas
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
 *             $ref: '#/components/schemas/Zona'
 *     responses:
 *       200:
 *         description: Zona actualizada
 *   delete:
 *     summary: Eliminar zona
 *     description: Elimina una zona (solo admin)
 *     tags:
 *       - Zonas
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
 *         description: Zona eliminada
 */

export const zonaRouter = Router()

// Rutas específicas primero
zonaRouter.get('/activos/', findZonasActivas)
// Rutas genéricas
zonaRouter.get('/', authMiddleware, adminOnly, findAll)
zonaRouter.post('/', authMiddleware, adminOnly, add)
// Rutas con parámetros después
zonaRouter.get('/:id', authMiddleware, adminOnly, findOne)
zonaRouter.put('/:id', authMiddleware, adminOnly, update)
zonaRouter.patch('/:id', authMiddleware, adminOnly, update)
zonaRouter.delete('/:id', authMiddleware, adminOnly, remove)
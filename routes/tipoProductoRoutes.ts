import { Router } from 'express';
import { findAll, findOne, add, update, remove, findTiposDeProductoActivos } from '../controllers/tipoProductoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

/**
 * @swagger
 * /api/v2/tiposDeProducto:
 *   get:
 *     summary: Obtener todos los tipos de producto
 *     description: Lista todos los tipos de producto disponibles
 *     tags:
 *       - Tipos de Producto
 *     responses:
 *       200:
 *         description: Lista de tipos de producto
 *   post:
 *     summary: Crear nuevo tipo de producto
 *     description: Crea un nuevo tipo de producto (solo admin)
 *     tags:
 *       - Tipos de Producto
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
 *         description: Tipo de producto creado
 */

/**
 * @swagger
 * /api/v2/tiposDeProducto/activos:
 *   get:
 *     summary: Obtener tipos de producto activos
 *     description: Lista solo los tipos de producto activos
 *     tags:
 *       - Tipos de Producto
 *     responses:
 *       200:
 *         description: Lista de tipos activos
 */

/**
 * @swagger
 * /api/v2/tiposDeProducto/{id}:
 *   get:
 *     summary: Obtener tipo de producto por ID
 *     description: Retorna un tipo de producto específico (solo admin)
 *     tags:
 *       - Tipos de Producto
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
 *         description: Datos del tipo de producto
 *       404:
 *         description: No encontrado
 *   patch:
 *     summary: Actualizar tipo de producto
 *     description: Actualiza un tipo de producto (solo admin)
 *     tags:
 *       - Tipos de Producto
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
 *     summary: Eliminar tipo de producto
 *     description: Elimina un tipo de producto (solo admin)
 *     tags:
 *       - Tipos de Producto
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

export const tipoProductoRouter = Router()

// Rutas específicas primero
tipoProductoRouter.get('/activos/', findTiposDeProductoActivos)
// Rutas genéricas
tipoProductoRouter.get('/', findAll)
tipoProductoRouter.post('/', adminOnly, add)
// Rutas con parámetros después
tipoProductoRouter.get('/:id', adminOnly, findOne)
tipoProductoRouter.put('/:id',  adminOnly,update)
tipoProductoRouter.patch('/:id', adminOnly, update)
tipoProductoRouter.delete('/:id', adminOnly, remove)
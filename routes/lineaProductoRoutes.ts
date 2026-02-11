import { Router } from 'express';
import { findAll, findOne, add, update, remove, findByPedidoId } from '../controllers/lineaProductoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

/**
 * @swagger
 * /api/v2/lineasDeProducto:
 *   get:
 *     summary: Obtener todas las líneas de producto
 *     description: Lista todas las líneas de producto (solo admin)
 *     tags:
 *       - Líneas de Producto
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de líneas de producto
 *   post:
 *     summary: Crear nueva línea de producto
 *     description: Crea una nueva línea de producto (solo admin)
 *     tags:
 *       - Líneas de Producto
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               pedidoId:
 *                 type: integer
 *               productoId:
 *                 type: integer
 *               cantidad:
 *                 type: integer
 *               precioUnitario:
 *                 type: number
 *     responses:
 *       201:
 *         description: Línea creada
 */

/**
 * @swagger
 * /api/v2/lineasDeProducto/{id}:
 *   get:
 *     summary: Obtener línea de producto por ID
 *     description: Retorna una línea de producto específica (solo admin)
 *     tags:
 *       - Líneas de Producto
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
 *         description: Datos de la línea
 *       404:
 *         description: No encontrada
 *   put:
 *     summary: Actualizar línea de producto
 *     description: Actualiza una línea de producto (solo admin)
 *     tags:
 *       - Líneas de Producto
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
 *         description: Actualizada
 *   patch:
 *     summary: Actualizar línea parcialmente
 *     description: Actualiza parcialmente una línea (solo admin)
 *     tags:
 *       - Líneas de Producto
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
 *         description: Actualizada
 *   delete:
 *     summary: Eliminar línea de producto
 *     description: Elimina una línea de producto (solo admin)
 *     tags:
 *       - Líneas de Producto
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
 *         description: Eliminada
 */

/**
 * @swagger
 * /api/v2/lineasDeProducto/pedido/{pedidoId}:
 *   get:
 *     summary: Obtener líneas por ID de pedido
 *     description: Lista las líneas de producto de un pedido específico
 *     tags:
 *       - Líneas de Producto
 *     parameters:
 *       - in: path
 *         name: pedidoId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Líneas del pedido
 */

export const lineasRouter = Router()

// Rutas específicas primero
lineasRouter.get('/pedido/:pedidoId', findByPedidoId)
// Rutas genéricas
lineasRouter.get('/', adminOnly, findAll)
lineasRouter.post('/',  adminOnly,add)
// Rutas con parámetros después
lineasRouter.get('/:id', adminOnly, findOne)
lineasRouter.put('/:id', adminOnly, update)
lineasRouter.patch('/:id', adminOnly, update)
lineasRouter.delete('/:id', adminOnly, remove)
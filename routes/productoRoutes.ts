import { Router } from 'express';
import { findAll, findOne, add, update, remove, findAllByFilters, findProductosActivos } from '../controllers/productoController.js';
import { adminOnly } from '../middleware/adminOnly.js';

/**
 * @swagger
 * /api/v2/producto:
 *   get:
 *     summary: Obtener todos los productos
 *     description: Lista todos los productos disponibles
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Producto'
 *   post:
 *     summary: Crear nuevo producto
 *     description: Crea un nuevo producto (solo admin)
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       201:
 *         description: Producto creado
 *       403:
 *         description: Acceso denegado
 */

/**
 * @swagger
 * /api/v2/producto/filter:
 *   get:
 *     summary: Filtrar productos
 *     description: Obtiene productos con filtros específicos
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: query
 *         name: nombre
 *         schema:
 *           type: string
 *       - in: query
 *         name: tipoProducto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Productos filtrados
 */

/**
 * @swagger
 * /api/v2/producto/activos:
 *   get:
 *     summary: Obtener productos activos
 *     description: Lista solo los productos activos
 *     tags:
 *       - Productos
 *     responses:
 *       200:
 *         description: Lista de productos activos
 */

/**
 * @swagger
 * /api/v2/producto/{codigo}:
 *   get:
 *     summary: Obtener producto por código
 *     description: Retorna un producto específico
 *     tags:
 *       - Productos
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Datos del producto
 *       404:
 *         description: Producto no encontrado
 *   put:
 *     summary: Actualizar producto
 *     description: Actualiza un producto (solo admin)
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *   patch:
 *     summary: Actualizar producto parcialmente
 *     description: Actualiza parcialmente un producto (solo admin)
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Producto'
 *     responses:
 *       200:
 *         description: Producto actualizado
 *   delete:
 *     summary: Eliminar producto
 *     description: Elimina un producto (solo admin)
 *     tags:
 *       - Productos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: codigo
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Producto eliminado
 */

export const productoRouter = Router()

// Rutas específicas primero
productoRouter.get('/filter', findAllByFilters)
productoRouter.get('/activos', findProductosActivos)
// Rutas genéricas
productoRouter.get('/', findAll)
productoRouter.post('/', adminOnly, add)
// Rutas con parámetros después
productoRouter.get('/:codigo', findOne)
productoRouter.put('/:codigo', adminOnly, update)
productoRouter.patch('/:codigo', adminOnly, update)
productoRouter.delete('/:codigo', adminOnly, remove)
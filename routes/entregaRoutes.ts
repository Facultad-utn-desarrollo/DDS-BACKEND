import { Router } from "express";
import { findAll, findOne, add, update, remove, findAllByFilters, findMisEntregas, findMisPedidosParaEntrega } from '../controllers/entregaController.js';
import { adminOnly } from "../middleware/adminOnly.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

/**
 * @swagger
 * /api/v2/entregas/mis-pedidos-para-entrega:
 *   get:
 *     summary: Obtener mis pedidos para entregar
 *     description: Lista los pedidos asignados al repartidor para entregar
 *     tags:
 *       - Entregas
 *     responses:
 *       200:
 *         description: Lista de pedidos para entregar
 */

/**
 * @swagger
 * /api/v2/entregas/mis-entregas:
 *   get:
 *     summary: Obtener mis entregas
 *     description: Lista las entregas realizadas por el repartidor autenticado
 *     tags:
 *       - Entregas
 *     responses:
 *       200:
 *         description: Lista de entregas
 */

/**
 * @swagger
 * /api/v2/entregas:
 *   get:
 *     summary: Obtener todas las entregas
 *     description: Lista todas las entregas (solo admin)
 *     tags:
 *       - Entregas
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de entregas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Entrega'
 *   post:
 *     summary: Crear nueva entrega
 *     description: Crea una nueva entrega
 *     tags:
 *       - Entregas
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Entrega'
 *     responses:
 *       201:
 *         description: Entrega creada
 */

/**
 * @swagger
 * /api/v2/entregas/filter:
 *   get:
 *     summary: Filtrar entregas
 *     description: Obtiene entregas con filtros específicos (solo admin)
 *     tags:
 *       - Entregas
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: repartidor
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Entregas filtradas
 */

/**
 * @swagger
 * /api/v2/entregas/{id}:
 *   get:
 *     summary: Obtener entrega por ID
 *     description: Retorna los datos de una entrega específica (solo admin)
 *     tags:
 *       - Entregas
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
 *         description: Datos de la entrega
 *       404:
 *         description: Entrega no encontrada
 *   put:
 *     summary: Actualizar entrega
 *     description: Actualiza una entrega
 *     tags:
 *       - Entregas
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
 *             $ref: '#/components/schemas/Entrega'
 *     responses:
 *       200:
 *         description: Entrega actualizada
 *   patch:
 *     summary: Actualizar entrega parcialmente
 *     description: Actualiza parcialmente una entrega
 *     tags:
 *       - Entregas
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
 *             $ref: '#/components/schemas/Entrega'
 *     responses:
 *       200:
 *         description: Entrega actualizada
 *   delete:
 *     summary: Eliminar entrega
 *     description: Elimina una entrega (solo admin)
 *     tags:
 *       - Entregas
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
 *         description: Entrega eliminada
 */

export const entregaRouter = Router()
// Rutas específicas primero
entregaRouter.get('/mis-pedidos-para-entrega', findMisPedidosParaEntrega);
entregaRouter.get('/mis-entregas', findMisEntregas);
entregaRouter.get('/filter', adminOnly, findAllByFilters);
// Rutas genéricas
entregaRouter.get('/',  adminOnly,findAll)
entregaRouter.post('/', add)
// Rutas con parámetros después
entregaRouter.get('/:id', adminOnly, findOne)
entregaRouter.put('/:id',update)
entregaRouter.patch('/:id', update)
entregaRouter.delete('/:id', adminOnly, remove)

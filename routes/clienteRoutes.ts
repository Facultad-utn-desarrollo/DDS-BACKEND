import { Router } from 'express';
import { findAll, findOne, add, update, remove, findClientesActivos, findMyself } from '../controllers/clienteController.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/v2/clientes/me:
 *   get:
 *     summary: Obtener mi perfil
 *     description: Retorna los datos del cliente autenticado
 *     tags:
 *       - Clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       401:
 *         description: No autorizado
 */

/**
 * @swagger
 * /api/v2/clientes/activos:
 *   get:
 *     summary: Obtener clientes activos
 *     description: Lista todos los clientes activos (solo admin)
 *     tags:
 *       - Clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes activos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       403:
 *         description: Acceso denegado - requiere permisos de admin
 */

/**
 * @swagger
 * /api/v2/clientes:
 *   get:
 *     summary: Obtener todos los clientes
 *     description: Lista todos los clientes (solo admin)
 *     tags:
 *       - Clientes
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de clientes
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Cliente'
 *       403:
 *         description: Acceso denegado
 *   post:
 *     summary: Crear nuevo cliente
 *     description: Crea un nuevo cliente (solo admin)
 *     tags:
 *       - Clientes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       201:
 *         description: Cliente creado exitosamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Acceso denegado
 */

/**
 * @swagger
 * /api/v2/clientes/{id}:
 *   get:
 *     summary: Obtener cliente por ID
 *     description: Retorna los datos de un cliente específico (solo admin)
 *     tags:
 *       - Clientes
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
 *         description: Datos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cliente'
 *       404:
 *         description: Cliente no encontrado
 *       403:
 *         description: Acceso denegado
 *   put:
 *     summary: Actualizar cliente
 *     description: Actualiza los datos de un cliente (solo admin)
 *     tags:
 *       - Clientes
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
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       404:
 *         description: Cliente no encontrado
 *       403:
 *         description: Acceso denegado
 *   patch:
 *     summary: Actualizar cliente parcialmente
 *     description: Actualiza parcialmente un cliente (solo admin)
 *     tags:
 *       - Clientes
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
 *             $ref: '#/components/schemas/Cliente'
 *     responses:
 *       200:
 *         description: Cliente actualizado
 *       404:
 *         description: Cliente no encontrado
 *   delete:
 *     summary: Eliminar cliente
 *     description: Elimina un cliente (solo admin)
 *     tags:
 *       - Clientes
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
 *         description: Cliente eliminado
 *       404:
 *         description: Cliente no encontrado
 *       403:
 *         description: Acceso denegado
 */

export const clienteRouter = Router();
// Rutas específicas primero
clienteRouter.get('/me', authMiddleware, findMyself);
clienteRouter.get('/activos', adminOnly,  findClientesActivos);
// Rutas genéricas
clienteRouter.post('/',adminOnly, add);
clienteRouter.get('/',adminOnly, findAll);
// Rutas con parámetros después
clienteRouter.get('/:id',adminOnly, findOne);
clienteRouter.put('/:id',adminOnly, update);
clienteRouter.patch('/:id', adminOnly ,update);
clienteRouter.delete('/:id', adminOnly, remove);
 
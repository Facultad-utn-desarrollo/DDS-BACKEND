import { Router } from 'express';
import { findAll, findOne, add, update, remove, findPedidosSinPago, findPedidosPagosSinEntrega , findAllPedidosByFilters, findMisPedidos, findMisPedidosImpagos} from '../controllers/pedidoController.js';
import { adminOnly } from '../middleware/adminOnly.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

/**
 * @swagger
 * /api/v2/pedido/mis-pedidos:
 *   get:
 *     summary: Obtener mis pedidos
 *     description: Lista todos los pedidos del cliente autenticado
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos del cliente
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 */

/**
 * @swagger
 * /api/v2/pedido/mis-pedidos-impagos:
 *   get:
 *     summary: Obtener mis pedidos impagos
 *     description: Lista pedidos sin pagar del cliente autenticado
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos impagos
 */

/**
 * @swagger
 * /api/v2/pedido:
 *   get:
 *     summary: Obtener todos los pedidos
 *     description: Lista todos los pedidos (solo admin)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos los pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Pedido'
 *   post:
 *     summary: Crear nuevo pedido
 *     description: Crea un nuevo pedido
 *     tags:
 *       - Pedidos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 */

/**
 * @swagger
 * /api/v2/pedido/{nroPedido}:
 *   get:
 *     summary: Obtener pedido por número
 *     description: Retorna un pedido específico
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: nroPedido
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Datos del pedido
 *       404:
 *         description: Pedido no encontrado
 *   put:
 *     summary: Actualizar pedido
 *     description: Actualiza un pedido
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: nroPedido
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *   patch:
 *     summary: Actualizar pedido parcialmente
 *     description: Actualiza parcialmente un pedido
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: nroPedido
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pedido'
 *     responses:
 *       200:
 *         description: Pedido actualizado
 *   delete:
 *     summary: Eliminar pedido
 *     description: Elimina un pedido
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: nroPedido
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedido eliminado
 */

/**
 * @swagger
 * /api/v2/pedido/pedidos/impagos:
 *   get:
 *     summary: Obtener pedidos sin pagar
 *     description: Lista pedidos sin pagos realizados (solo admin)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos impagos
 */

/**
 * @swagger
 * /api/v2/pedido/pedidos/noentregados:
 *   get:
 *     summary: Obtener pedidos pagos sin entregar
 *     description: Lista pedidos pagados que aún no se han entregado (solo admin)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de pedidos pagos sin entregar
 */

/**
 * @swagger
 * /api/v2/pedido/pedido/filter:
 *   get:
 *     summary: Filtrar pedidos
 *     description: Obtiene pedidos con filtros específicos (solo admin)
 *     tags:
 *       - Pedidos
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: estado
 *         schema:
 *           type: string
 *       - in: query
 *         name: cliente
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Pedidos filtrados
 */

export const pedidoRouter = Router()

// Rutas específicas primero
pedidoRouter.get('/mis-pedidos', authMiddleware, findMisPedidos);
pedidoRouter.get('/mis-pedidos-impagos', authMiddleware, findMisPedidosImpagos);
pedidoRouter.get('/pedidos/impagos',  adminOnly,findPedidosSinPago);
pedidoRouter.get('/pedidos/noentregados',  adminOnly,findPedidosPagosSinEntrega);
pedidoRouter.get('/pedido/filter', adminOnly, findAllPedidosByFilters)
// Rutas genéricas
pedidoRouter.get('/', adminOnly, findAll)
pedidoRouter.post('/', add)
// Rutas con parámetros después
pedidoRouter.get('/:nroPedido',authMiddleware,  findOne)
pedidoRouter.put('/:nroPedido',  update)
pedidoRouter.patch('/:nroPedido', update)
pedidoRouter.delete('/:nroPedido', remove)


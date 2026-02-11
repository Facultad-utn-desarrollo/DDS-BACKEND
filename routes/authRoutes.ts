
import { Router } from "express";
import {login} from "../controllers/authController.js"
import { register } from "../controllers/authController.js";

/**
 * @swagger
 * /api/v2/login:
 *   post:
 *     summary: Iniciar sesión
 *     description: Autentica un usuario con username y password
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan_perez
 *               password:
 *                 type: string
 *                 example: micontraseña123
 *             required:
 *               - username
 *               - password
 *     responses:
 *       200:
 *         description: Login exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIs...
 *                 usuario:
 *                   type: object
 *       401:
 *         description: Credenciales inválidas
 */

/**
 * @swagger
 * /api/v2/login/register:
 *   post:
 *     summary: Registrar nuevo usuario
 *     description: Crea una nueva cuenta de usuario y cliente
 *     tags:
 *       - Autenticación
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: juan_perez
 *               password:
 *                 type: string
 *                 example: micontraseña123
 *               cuit:
 *                 type: string
 *                 example: 20123456789
 *               apellidoNombre:
 *                 type: string
 *                 example: Pérez Juan
 *               telefono:
 *                 type: string
 *                 example: 1123456789
 *               email:
 *                 type: string
 *                 example: juan@example.com
 *               domicilio:
 *                 type: string
 *                 example: Calle 123, Buenos Aires
 *               zona:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                     example: 1
 *             required:
 *               - username
 *               - password
 *               - cuit
 *               - apellidoNombre
 *               - telefono
 *               - email
 *               - domicilio
 *     responses:
 *       201:
 *         description: Usuario registrado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       400:
 *         description: El usuario ya existe o datos inválidos
 */

export const authRouter = Router()

authRouter.post('/', login);
authRouter.post('/register', register);


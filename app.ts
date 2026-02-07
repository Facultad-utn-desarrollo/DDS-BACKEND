import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { clienteRouter } from './routes/clienteRoutes.js'
import { repartidorRouter } from './routes/repartidorRourtes.js'
import { tipoProductoRouter } from './routes/tipoProductoRoutes.js'
import { tipoPagoRouter } from './routes/tipoPagoRoutes.js'
import { orm, syncSchema } from './shared/db/orm.js'
import { RequestContext } from '@mikro-orm/core'
import { entregaRouter } from './routes/entregaRoutes.js'
import { pagoRouter } from './routes/pagoRoutes.js'
import { productoRouter } from './routes/productoRoutes.js'
import { pedidoRouter } from './routes/pedidoRoutes.js'
import { lineasRouter } from './routes/lineaProductoRoutes.js'
import { zonaRouter } from './routes/zonaRoutes.js'
import { authRouter } from './routes/authRoutes.js'
import dotenv from "dotenv";
import { authMiddleware } from './middleware/auth.middleware.js'

// Cargar las variables de entorno del archivo .env
dotenv.config();

console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log("JWT_EXPIRATION:", process.env.JWT_EXPIRATION);

const app = express()
app.use(express.json())
app.use((_, res, next) => {
  RequestContext.create(orm.em, next)
})
app.use(cors());
const allowedOrigins = ['http://localhost:4200'];
const corsOptions = {
  origin: allowedOrigins
};
app.use(cors(corsOptions));

app.use('/api/v2/clientes', authMiddleware ,clienteRouter)
app.use('/api/v2/repartidores', authMiddleware, repartidorRouter)
app.use('/api/v2/tiposDeProducto', authMiddleware ,tipoProductoRouter)
app.use('/api/v2/tiposDePago', authMiddleware, tipoPagoRouter)
app.use('/api/v2/entregas',authMiddleware, entregaRouter)
app.use('/api/v2/pago',authMiddleware, pagoRouter)
app.use('/api/v2/producto',authMiddleware, productoRouter)
app.use('/api/v2/pedido',authMiddleware, pedidoRouter)
app.use('/api/v2/lineasDeProducto',authMiddleware, lineasRouter)
app.use('/api/v2/login',authRouter)
app.use('/api/v2/zonas', zonaRouter)


app.use((_, res) => {
  return res.status(404).send({ message: 'No se encontro la ruta' })
})

 //await syncSchema() ///no lo borren, con esto actualizamos el schema si hace falta

app.listen(3000, () => {
  console.log("Server corriendo en la ruta http://localhost:3000/")
}) 
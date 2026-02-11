import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DDS Backend API',
      description: 'Documentación de la API de FAST',
      version: '1.0.0',
      contact: {
        name: 'Equipo de Desarrollo FAST',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: process.env.RENDER_URL || 'https://dds-backend-a.onrender.com',
        description: 'Servidor Deployado en OnRender',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Cliente: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            cuit: { type: 'string', example: '20-12345678-9' },
            apellidoNombre: { type: 'string', example: 'Pérez Juan' },
            telefono: { type: 'string', example: '1123456789' },
            email: { type: 'string', example: 'cliente@example.com' },
            domicilio: { type: 'string', example: 'Calle 123, Buenos Aires' },
            disponible: { type: 'boolean', example: true },
          },
          required: ['cuit', 'apellidoNombre', 'telefono', 'email', 'domicilio'],
        },
        Repartidor: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            cuit: { type: 'string', example: '20987654321' },
            apellidoNombre: { type: 'string', example: 'García Carlos' },
            vehiculo: { type: 'string', example: 'Moto ABC123' },
            disponible: { type: 'boolean', example: true },
            zona: { type: 'integer', example: 1 },
          },
          required: ['cuit', 'apellidoNombre', 'vehiculo', 'zona'],
        },
        Producto: {
          type: 'object',
          properties: {
            codigo: { type: 'integer', example: 1 },
            descripcion: { type: 'string', example: 'Producto de ejemplo' },
            stock: { type: 'integer', example: 100 },
            precio: { type: 'number', example: 29.99 },
            tipoProducto: { type: 'integer', example: 1 },
            disponible: { type: 'boolean', example: true },
          },
          required: ['descripcion', 'stock', 'precio', 'tipoProducto'],
        },
        Zona: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Zona Centro' },
            descripcion: { type: 'string', example: 'Centro de la ciudad' },
            disponible: { type: 'boolean', example: true },
          },
          required: ['nombre', 'descripcion'],
        },
        Pedido: {
          type: 'object',
          properties: {
            nroPedido: { type: 'integer', example: 1 },
            fecha: { type: 'string', format: 'date-time', example: '2026-02-10T10:00:00Z' },
            total: { type: 'number', example: 250.50 },
            cliente: { type: 'integer', example: 1 },
            entrega: { type: 'integer', nullable: true, example: 1 },
            pago: { type: 'integer', nullable: true, example: 1 },
          },
          required: ['fecha', 'total', 'cliente'],
        },
        Entrega: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            fecha: { type: 'string', format: 'date-time', example: '2026-02-10T15:30:00Z' },
            repartidor: { type: 'integer', example: 1 },
            zona: { type: 'integer', example: 1 },
          },
          required: ['fecha', 'repartidor', 'zona'],
        },
        Pago: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            fecha: { type: 'string', format: 'date-time', example: '2026-02-10T12:00:00Z' },
            tipoPago: { type: 'integer', example: 1 },
            pedido: { type: 'integer', example: 1 },
          },
          required: ['fecha', 'tipoPago', 'pedido'],
        },
        TipoProducto: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Bebidas' },
            disponible: { type: 'boolean', example: true },
          },
          required: ['nombre'],
        },
        TipoPago: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            nombre: { type: 'string', example: 'Tarjeta de Crédito' },
            disponible: { type: 'boolean', example: true },
          },
          required: ['nombre'],
        },
        LineaDeProducto: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            pedido: { type: 'integer', example: 1 },
            producto: { type: 'integer', example: 1 },
            cantidad: { type: 'integer', example: 5 },
            precioUnitario: { type: 'number', example: 29.99 },
          },
          required: ['pedido', 'producto', 'cantidad', 'precioUnitario'],
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./routes/*.ts'],
};

export const specs = swaggerJsdoc(options);

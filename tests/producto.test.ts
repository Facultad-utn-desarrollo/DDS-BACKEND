import request from 'supertest';
import express from 'express';
import bodyParser from 'body-parser';
import { productoRouter } from '../routes/productoRoutes.js';
// 1. import del ORM
import { orm } from '../shared/db/orm.js';

// 2. Mock del ORM
jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      find: jest.fn(),
      findOne: jest.fn(),
      findOneOrFail: jest.fn(),
      create: jest.fn(),
      persistAndFlush: jest.fn(),
      assign: jest.fn(),
      flush: jest.fn(),
    },
  },
}));

// 3. Mock del middleware
jest.mock('../middleware/adminOnly.js', () => ({
  adminOnly: (req: any, res: any, next: any) => next(),
}));

const app = express();
app.use(bodyParser.json());
app.use('/api/v2/producto', productoRouter);

describe('Integración: Productos', () => {
  
  const mockEm = orm.em as any;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Ver datos
  it('GET / debe devolver todos los productos', async () => {
    const mockProductos = [
      { codigo: 1, descripcion: 'Coca Cola 2L', precio: 100 },
      { codigo: 2, descripcion: 'Papas Lays', precio: 200 },
    ];
    mockEm.find.mockResolvedValue(mockProductos);

    const res = await request(app).get('/api/v2/producto');

    // Imprimimos datos
    console.log('\n🔵 [GET] Respuesta del servidor:', JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(200);
    expect(res.body.productos).toHaveLength(2);
    expect(mockEm.find).toHaveBeenCalled();
  });

  // Exito
  it('POST / debe crear un producto exitosamente', async () => {
    const nuevoProducto = {
      descripcion: 'Producto Nuevo',
      stock: 10,
      precio: 500,
      tipoProducto: { id: 1 }
    };

    mockEm.findOne.mockResolvedValue({ id: 1, descripcion: 'Tipo Test' });
    mockEm.create.mockReturnValue({ ...nuevoProducto, codigo: 99 });
    mockEm.persistAndFlush.mockResolvedValue(true);

    const res = await request(app)
      .post('/api/v2/producto')
      .send(nuevoProducto);

    // Imprimimos los datos
    console.log('\n🟢 [POST - Éxito] Respuesta del servidor:', JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(201);
    expect(res.body.message).toContain('Producto creado');
    // se veritifca el nuevo codigo
    expect(res.body.data.codigo).toBe(99); 
  });

  // Post fallido
  it('POST / debe fallar si el TipoProducto no existe', async () => {
    const nuevoProducto = {
      descripcion: 'Producto error',
      stock: 10,
      precio: 50,
      tipoProducto: { id: 999 } 
    };

    mockEm.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v2/producto')
      .send(nuevoProducto);

    // Imprimimos
    console.log('\n🔴 [POST - Error] Respuesta del servidor:', JSON.stringify(res.body, null, 2));

    expect(res.status).toBe(404);
    expect(mockEm.persistAndFlush).not.toHaveBeenCalled();
  });
});
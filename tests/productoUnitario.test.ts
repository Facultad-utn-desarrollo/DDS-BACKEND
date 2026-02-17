import { add } from '../controllers/productoController.js';
import { orm } from '../shared/db/orm.js';

// 1. MOCKEAMOS EL ORM 
jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      findOne: jest.fn(),
      create: jest.fn(),
      persistAndFlush: jest.fn(),
    },
  },
}));

describe('Unitario: ProductoController.add', () => {
  let req: any;
  let res: any;
  const mockEm = orm.em as any;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      body: {
        descripcion: 'Producto Unitario',
        precio: 50,
        stock: 100,
        tipoProducto: { id: 1 }
      }
    };

    res = {
      status: jest.fn().mockReturnThis(), // Para permitir res.status().json()
      json: jest.fn()
    };
  });

  it('debe responder con status 201 y mensaje de éxito', async () => {
    // Configuración del escenario
    mockEm.findOne.mockResolvedValue({ id: 1, descripcion: 'Tipo Test' });
    mockEm.create.mockReturnValue({ ...req.body, codigo: 777 });
    mockEm.persistAndFlush.mockResolvedValue(true);

    // ejecucion directa
    await add(req, res);

  
    // Verificamos que la función llamó a res.status(201)
    expect(res.status).toHaveBeenCalledWith(201);
    
    // verificamos json ok
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      message: 'Producto creado!',
      data: expect.objectContaining({ codigo: 777 })
    }));
  });

  it('debe manejar errores y devolver 500', async () => {
    // error de BD
    mockEm.findOne.mockRejectedValue(new Error('Error DB'));

    await add(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error DB' });
  });
});
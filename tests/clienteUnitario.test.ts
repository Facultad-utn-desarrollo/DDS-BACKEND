import { add, remove } from '../controllers/clienteController.js';
import { orm } from '../shared/db/orm.js';

// 1. Mockeamos el ORM
jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      findOne: jest.fn(),
      create: jest.fn(),
      persistAndFlush: jest.fn(),
      getReference: jest.fn(),
      assign: jest.fn(),
      flush: jest.fn(),
    },
  },
}));

describe('Unitario: ClienteController', () => {
  let req: any;
  let res: any;
  const mockEm = orm.em as any;

  beforeEach(() => {
    jest.clearAllMocks();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  describe('Función add', () => {
    it('404 si la zona no existe', async () => {
      req = { body: { nombre: 'Fede', zona: { id: 99 } } };
      
      // Simulamos que no encuentra la zona
      mockEm.findOne.mockResolvedValue(null);

      await add(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'La zona especificada no existe' });
      expect(mockEm.create).not.toHaveBeenCalled(); // aca no edeberia guardar
    });

    it('debe crear el cliente y devolver 201', async () => {
      req = { body: { nombre: 'Fede', zona: 1 } };
      
      const zonaFalsa = { id: 1, descripcion: 'Centro' };
      mockEm.findOne.mockResolvedValue(zonaFalsa);
      mockEm.create.mockReturnValue({ nombre: 'Fede', zona: zonaFalsa, disponible: true });
      mockEm.persistAndFlush.mockResolvedValue(true);

      await add(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Cliente creado!'
      }));
    });
  });

  describe('Función remove', () => {
    it('debe hacer borrado lógico (disponible = false) y devolver 200', async () => {
      req = { params: { id: '5' } }; // 
      
      const clienteFalso = { id: 5, nombre: 'Juan', disponible: true };
      mockEm.getReference.mockResolvedValue(clienteFalso);
      mockEm.flush.mockResolvedValue(true);

      await remove(req, res);

      expect(mockEm.assign).toHaveBeenCalledWith(clienteFalso, expect.objectContaining({ disponible: false }));
      expect(mockEm.flush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
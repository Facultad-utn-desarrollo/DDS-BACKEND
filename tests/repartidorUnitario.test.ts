import { add, remove } from '../controllers/repartidorController.js';
import { orm } from '../shared/db/orm.js';

jest.mock('../shared/db/orm.js', () => ({
  orm: {
    em: {
      findOne: jest.fn(),
      create: jest.fn(),
      persistAndFlush: jest.fn(),
      getReference: jest.fn(),
      flush: jest.fn(),
    },
  },
}));

describe('Unitario: RepartidorController', () => {
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
    it('debe devolver 400 si no se envía ninguna zona', async () => {
      //  sin zona
      req = { body: { nombre: 'Carlos Repartidor' } }; 

      await add(req, res);

      // aca falta la zona
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: 'La zona es obligatoria' });
    });

    it('debe crear un repartidor si los datos están bien', async () => {
      req = { body: { nombre: 'Carlos Repartidor', zona: { id: 2 } } };
      
      mockEm.findOne.mockResolvedValue({ id: 2, descripcion: 'Sur' });
      mockEm.create.mockReturnValue({ nombre: 'Carlos Repartidor', disponible: true });
      mockEm.persistAndFlush.mockResolvedValue(true);

      await add(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(mockEm.persistAndFlush).toHaveBeenCalled();
    });
  });

  describe('Función remove', () => {
    it('debe desactivar al repartidor y devolver 200', async () => {
      req = { params: { id: '10' } };
      
      const repartidorFalso = { id: 10, nombre: 'Carlos', disponible: true };
      
      // getReference devuelve el objeto, y tu código le cambia .disponible = false directamente
      mockEm.getReference.mockResolvedValue(repartidorFalso);
      mockEm.flush.mockResolvedValue(true);

      await remove(req, res);

      // Verificamos que tu código realmente le cambió la propiedad
      expect(repartidorFalso.disponible).toBe(false); 
      expect(mockEm.flush).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Repartidor borrado!' });
    });
  });
});
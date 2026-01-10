import { NextFunction, Request, Response } from 'express'
import { Entrega } from '../models/entrega.entity.js'
import { Pedido } from '../models/pedido.entity.js'
import { Repartidor } from '../models/repartidor.entity.js'
import { Zona } from '../models/zona.entity.js' 
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {

    const entregas = await em.find(Entrega, {}, { populate: ['repartidor', 'pedidos', 'zona'] })
    res.status(200).json({ message: 'Entregas encontradas', data: entregas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const EntregaEncontrada = await em.findOneOrFail(Entrega, { id }, { 
        populate: ['repartidor', 'pedidos', 'pedidos.cliente.zona', 'zona'] 
    })
    res.status(200).json({ message: 'Se encontró la entrega!', data: EntregaEncontrada })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const { id, repartidor, pedidos, zona, ...entregaData } = req.body;
    
    // 1. Zona
    const idZona = (typeof zona === 'object' && zona !== null) ? zona.id : zona;
    const zonaEntity = await em.findOne(Zona, idZona);
    if (!zonaEntity) return res.status(404).json({ message: 'Zona no encontrada' });

    // 2. Repartidor
    let repartidorEntity;
    if (repartidor?.id) {
      repartidorEntity = await em.findOne(Repartidor, repartidor.id, { populate: ['zona'] });
      if (!repartidorEntity) return res.status(404).json({ message: 'Repartidor no encontrado' });
      
      // Validación de zona repartidor
      if (repartidorEntity.zona.id !== zonaEntity.id) {
         return res.status(400).json({ message: 'El repartidor no pertenece a la zona seleccionada' });
      }
    }

    // 3. Crear Entrega 
    const entrega = em.create(Entrega, { 
        ...entregaData, 
        repartidor: repartidorEntity,
        zona: zonaEntity 
    });
    
    // GUARDAR PRIMERO para obtener ID real
    await em.persistAndFlush(entrega);

    // 4. Pedidos
    if (pedidos && pedidos.length > 0) {
      const nroPedidos = pedidos.map((pedido: Pedido) => pedido.nroPedido);
      
      const pedidosEntities = await em.find(Pedido, { nroPedido: { $in: nroPedidos } }, { populate: ['pago', 'cliente', 'cliente.zona'] });

      if (pedidosEntities.length !== nroPedidos.length) {
        return res.status(404).json({ message: 'Algunos de los pedidos no se encuentran' });
      }

      const fechaEntrega = new Date(entrega.fecha);

      for (const pedido of pedidosEntities) {
        if (!pedido.pago) return res.status(400).json({ message: `El pedido #${pedido.nroPedido} no está pagado.` });

        const fechaPedido = new Date(pedido.fecha);
        fechaEntrega.setHours(0,0,0,0);
        fechaPedido.setHours(0,0,0,0);

        if (fechaEntrega < fechaPedido) return res.status(400).json({ message: `La fecha de entrega es anterior a la del pedido #${pedido.nroPedido}` });

        if ((pedido.cliente as any).zona.id !== zonaEntity.id) {
            return res.status(400).json({ message: `El pedido #${pedido.nroPedido} pertenece a otra zona.` });
        }

        entrega.pedidos.add(pedido);
        pedido.entrega = entrega;
      }
      
      // Guardar la vinculación de pedidos
      await em.flush();
    }

    res.status(201).json({ message: 'Entrega creada!', data: entrega });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    
    const { repartidor, pedidos, zona, fecha } = req.body;

    const entregaToUpdate = await em.findOneOrFail(Entrega, { id }, { populate: ['repartidor', 'pedidos', 'zona'] });

    if (fecha) {
        entregaToUpdate.fecha = new Date(fecha);
    }

    // Actualizar Zona
    if (zona) {
        const idZona = (typeof zona === 'object') ? zona.id : zona;
        const zonaEntity = await em.findOne(Zona, idZona);
        if(zonaEntity) entregaToUpdate.zona = zonaEntity;
    }

    // Actualizar Repartidor
    if (repartidor && repartidor.id !== entregaToUpdate.repartidor.id) {
      const repartidorToUpdate = await em.findOneOrFail(Repartidor, { id: repartidor.id });
      entregaToUpdate.repartidor = repartidorToUpdate;
    }

    // Actualizar Pedidos
    entregaToUpdate.pedidos.removeAll();
    if (pedidos && pedidos.length > 0) {
        for (const pedidoData of pedidos) {
          const pedidoToAdd = await em.findOneOrFail(Pedido, { nroPedido: pedidoData.nroPedido }, { populate: ['pago']});
          if(!pedidoToAdd.pago) return res.status(400).json({ message: `El pedido #${pedidoToAdd.nroPedido} no está pagado.` });
          entregaToUpdate.pedidos.add(pedidoToAdd);
        }
    }

    await em.flush();
    res.status(200).json({ message: 'Entrega actualizada!', data: entregaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entrega = await em.getReference(Entrega, id)
    await em.removeAndFlush(entrega)
    res.status(200).json({ message: 'Entrega borrada!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove }
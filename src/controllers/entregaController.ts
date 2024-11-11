import { NextFunction, Request, Response } from 'express'
import { Entrega } from '../models/entrega.entity.js'
import { Pedido } from '../models/pedido.entity.js'
import { orm } from '../shared/db/orm.js'
import { Collection } from '@mikro-orm/core';
import { Repartidor } from '../models/repartidor.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const entregas = await em.find(Entrega, {}, { populate: ['repartidor', 'pedidos'] })
    res
      .status(200)
      .json({ entregas: entregas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const EntregaEncontrada = await em.findOneOrFail(Entrega, { id }, { populate: ['repartidor'] })
    res
      .status(200)
      .json({ message: 'se encontro la entrega!', data: EntregaEncontrada })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  console.log(req.body);
  try {
    const { repartidor, pedidos, ...entregaData } = req.body;
    let repartidorEntity;

    if (entregaData.id == 0) { entregaData.id = null }

    if (repartidor?.id) {
      repartidorEntity = await em.findOne(Repartidor, repartidor.id);
      if (!repartidorEntity) {
        return res.status(404).json({ message: 'Repartidor no encontrado' });
      }
    } else {
      repartidorEntity = em.create(Repartidor, {
        cuit: repartidor.cuit,
        apellidoNombre: repartidor.apellidoNombre,
        vehiculo: repartidor.vehiculo,
        zona: repartidor.zona,
        disponible: repartidor.disponible,
      });
    }

    const entrega = em.create(Entrega, { ...entregaData, repartidor: repartidorEntity });

    if (pedidos && pedidos.length > 0) {
      const nroPedidos = pedidos.map((pedido: Pedido) => pedido.nroPedido);

      const pedidosEntities = await em.find(Pedido, { nroPedido: { $in: nroPedidos } });

      if (pedidosEntities.length !== nroPedidos.length) {
        return res.status(404).json({ message: 'Algunos de los pedidos no se encuentran' });
      }

      pedidosEntities.forEach((pedido) => entrega.pedidos.add(pedido));

      pedidosEntities.forEach((pedido) => {
        pedido.entrega = entrega;
        em.persist(pedido);
      });
    }

    await em.persistAndFlush(entrega);

    res.status(201).json({ message: 'Entrega creada!', data: entrega });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { repartidor, pedidos } = req.body;

    const entregaToUpdate = await em.findOneOrFail(Entrega, { id }, { populate: ['repartidor', 'pedidos'] });

    if (repartidor && repartidor.id !== entregaToUpdate.repartidor.id) {
      const repartidorToUpdate = await em.findOneOrFail(Repartidor, { id: repartidor.id });
      entregaToUpdate.repartidor = repartidorToUpdate;
    }

    entregaToUpdate.pedidos.removeAll();
    for (const pedido of pedidos) {
      const pedidoToAdd = await em.findOneOrFail(Pedido, { nroPedido: pedido.nroPedido });
      entregaToUpdate.pedidos.add(pedidoToAdd);
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
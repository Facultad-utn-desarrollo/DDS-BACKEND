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

    // Buscar o crear el repartidor
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

    // Crear la entidad de entrega
    const entrega = em.create(Entrega, { ...entregaData, repartidor: repartidorEntity });

    // Procesar los pedidos recibidos (enviados como objetos completos)
    if (pedidos && pedidos.length > 0) {
      // Extraer el `nroPedido` de cada objeto de pedido
      const nroPedidos = pedidos.map((pedido: Pedido) => pedido.nroPedido);

      // Buscar en la base de datos los pedidos usando los nroPedido
      const pedidosEntities = await em.find(Pedido, { nroPedido: { $in: nroPedidos } });

      // Verificar si todos los pedidos existen en la base de datos
      if (pedidosEntities.length !== nroPedidos.length) {
        return res.status(404).json({ message: 'Algunos de los pedidos no se encuentran' });
      }

      // Asignar los pedidos a la entrega usando Collection de MikroORM
      pedidosEntities.forEach((pedido) => entrega.pedidos.add(pedido));

      // Establecer la relación de cada pedido con la entrega
      pedidosEntities.forEach((pedido) => {
        pedido.entrega = entrega;
        em.persist(pedido);
      });
    }

    // Persistir la entrega con los pedidos asociados
    await em.persistAndFlush(entrega);

    // Responder con la entrega creada
    res.status(201).json({ message: 'Entrega creada!', data: entrega });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { repartidor, pedidos } = req.body;

    // Encontrar la entrega existente y cargar sus relaciones
    const entregaToUpdate = await em.findOneOrFail(Entrega, { id }, { populate: ['repartidor', 'pedidos'] });

    // Actualizar el repartidor (si cambia)
    if (repartidor && repartidor.id !== entregaToUpdate.repartidor.id) {
      const repartidorToUpdate = await em.findOneOrFail(Repartidor, { id: repartidor.id });
      entregaToUpdate.repartidor = repartidorToUpdate; // Asignar nuevo repartidor
    }

    // Eliminar todos los pedidos de la entrega
    // Usar un ciclo para pasar cada pedido de forma individual al método remove
    for (const pedido of entregaToUpdate.pedidos) {
      entregaToUpdate.pedidos.remove(pedido); // Eliminar cada pedido de la entrega
    }

    // Agregar los nuevos pedidos (según el nroPedido recibido)
    for (const pedido of pedidos) {
      const pedidoToAdd = await em.findOneOrFail(Pedido, { nroPedido: pedido.nroPedido });
      entregaToUpdate.pedidos.add(pedidoToAdd); // Agregar el pedido a la entrega
    }

    // Asignar los valores restantes del cuerpo de la solicitud a la entrega
    em.assign(entregaToUpdate, req.body);

    // Guardar los cambios en la base de datos
    await em.flush();

    // Responder con el resultado
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
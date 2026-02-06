import { NextFunction, Request, Response } from 'express';
import { Pago } from '../models/pago.entity.js';
import { orm } from '../shared/db/orm.js';
import { TipoPago } from '../models/tipoPago.entity.js';
import { Pedido } from '../models/pedido.entity.js';
import { User } from '../models/user.entity.js';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const pagos = await em.find(Pago, {}, { populate: ['pedido', 'tipoPago'] });
    res.status(200).json({ message: 'Pagos encontrados', data: pagos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pagoEncontrado = await em.findOneOrFail(Pago, { id }, { populate: ['tipoPago', 'pedido'] });
    res.status(200).json({ message: 'Se encontró el Pago!', data: pagoEncontrado });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findMisPagos(req: any, res: Response) {
  try {
    const userId = req.user.userId; 

    const user = await em.findOne(User, { id: userId }, { populate: ['cliente'] });

    if (!user || !user.cliente) {
      return res.status(200).json({ message: 'No tiene perfil de cliente', data: [] });
    }

    const pagos = await em.find(Pago, { 
      pedido: { 
        cliente: user.cliente 
      } 
    }, { 
      populate: ['pedido', 'tipoPago'] 
    });

    res.status(200).json({ message: 'Mis pagos encontrados', data: pagos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const { id, tipoPago, pedido, ...pagoData } = req.body;

    let tipoPagoEntity;
    if (tipoPago?.id) {
      tipoPagoEntity = await em.findOne(TipoPago, tipoPago.id);
      if (!tipoPagoEntity) return res.status(404).json({ message: 'Tipo de Pago no encontrado' });
    }

    let pedidoEntity;
    if (pedido?.nroPedido) {
      pedidoEntity = await em.findOne(Pedido, pedido.nroPedido);
      if (!pedidoEntity) return res.status(404).json({ message: 'Pedido no encontrado' });
    } else {
        return res.status(400).json({ message: 'El pago debe estar asociado a un pedido.' });
    }

    const fechaPago = pagoData.fecha ? new Date(pagoData.fecha) : new Date();
    fechaPago.setHours(0,0,0,0);

    const fechaPedido = new Date(pedidoEntity.fecha);
    fechaPedido.setHours(0,0,0,0);

    if (fechaPago < fechaPedido) {
        return res.status(400).json({ message: `La fecha del pago no puede ser anterior a la del pedido (${pedidoEntity.fecha.toLocaleDateString()})` });
    }

    const pago = em.create(Pago, { 
        ...pagoData, 
        fecha: fechaPago,
        tipoPago: tipoPagoEntity, 
        pedido: pedidoEntity 
    });

    pedidoEntity.pago = pago;

    await em.persistAndFlush([pago, pedidoEntity]);

    res.status(201).json({ message: 'Pago creado y asociado al pedido!', data: pago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { tipoPago, pedido, fecha } = req.body;

    const pagoToUpdate = await em.findOneOrFail(Pago, { id }, { populate: ['pedido', 'tipoPago'] });

    let fechaEfectivaPago = fecha ? new Date(fecha) : new Date(pagoToUpdate.fecha);
    fechaEfectivaPago.setHours(0,0,0,0);

    let pedidoEntity = pagoToUpdate.pedido;
    if (pedido && pedido.nroPedido && pedido.nroPedido !== pagoToUpdate.pedido.nroPedido) {
         pedidoEntity = await em.findOneOrFail(Pedido, pedido.nroPedido);
    }

    const fechaPedido = new Date(pedidoEntity.fecha);
    fechaPedido.setHours(0,0,0,0);

    if (fechaEfectivaPago < fechaPedido) {
        return res.status(400).json({ message: `La fecha del pago no puede ser anterior a la del pedido (${pedidoEntity.fecha.toLocaleDateString()})` });
    }

    if (fecha) pagoToUpdate.fecha = new Date(fecha);
    
    if (tipoPago && tipoPago.id !== pagoToUpdate.tipoPago.id) {
        const nuevoTipo = await em.findOneOrFail(TipoPago, tipoPago.id);
        pagoToUpdate.tipoPago = nuevoTipo;
    }

    if (pedido && pedido.nroPedido !== pagoToUpdate.pedido.nroPedido) {
        const pedidoAnterior = pagoToUpdate.pedido;
        pedidoAnterior.pago = null as any; 
        
        pagoToUpdate.pedido = pedidoEntity;
        pedidoEntity.pago = pagoToUpdate;
        
        em.persist(pedidoAnterior);
        em.persist(pedidoEntity);
    }

    await em.flush();
    res.status(200).json({ message: 'Pago actualizado!', data: pagoToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = await em.getReference(Pago, id);
    await em.removeAndFlush(pago);
    res.status(200).json({ message: 'Pago borrado!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, add, findOne, update, remove,findMisPagos };
import { NextFunction, Request, Response } from 'express';
import { Pago } from '../models/pago.entity.js';
import { orm } from '../shared/db/orm.js';
import { TipoPago } from '../models/tipoPago.entity.js';
import { Pedido } from '../models/pedido.entity.js';
import { SourceTextModule } from 'vm';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const pagos = await em.find(Pago, {}, { populate: ['pedido', 'tipoPago'] });
    res.status(200).json({ pagos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {

    const { tipoPago, pedido, ...pagoData } = req.body;
    let tipoPagoEntity;
    let pedidoEntity;

    if (pagoData.fecha == "" || pagoData.fecha == null) {
      pagoData.fecha = new Date();
    }
    if (pagoData.id == 0) { pagoData.id = null }

    if (tipoPago?.id) {
      tipoPagoEntity = await em.findOne(TipoPago, tipoPago.id);
      if (!tipoPagoEntity) {
        return res.status(404).json({ message: 'Tipo de Pago no encontrado' });
      }
    } else {
      tipoPagoEntity = em.create(TipoPago, {
        nombre: tipoPago.nombre,
        descripcion: tipoPago.descripcion,
        disponible: tipoPago.disponible
      });
    }

    if (pedido?.nroPedido) {
      pedidoEntity = await em.findOne(Pedido, pedido.nroPedido);
      if (!pedidoEntity) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      if (pedidoEntity.pago) {
        return res.status(400).json({ message: 'El pedido ya tiene un pago asociado' });
      }
    }

    let pago = em.create(Pago, { ...pagoData, tipoPago: tipoPagoEntity, pedido: pedidoEntity });

    await em.persistAndFlush(pago);

    if (!pago) {
      return res.status(500).json({ message: 'Error al guardar el pago: ID no válido' });
    }

    if (pedidoEntity) {
      pedidoEntity.pago = pago;
      await em.persistAndFlush(pedidoEntity);
    }

    res.status(201).json({ message: 'Pago creado y asociado al pedido!', data: pago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pagoEncontrado = await em.findOneOrFail(Pago, { id }, { populate: ['tipoPago'] });
    res.status(200).json({ message: 'Se encontró el Pago!', data: pagoEncontrado });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { pedidoId, tipoPagoId } = req.body;

    const pagoToUpdate = await em.findOneOrFail(Pago, { id }, { populate: ['pedido', 'tipoPago'] });

    if (tipoPagoId && tipoPagoId !== pagoToUpdate.tipoPago.id) {
      const tipoPagoToUpdate = await em.findOneOrFail(TipoPago, { id: tipoPagoId });
      pagoToUpdate.tipoPago = tipoPagoToUpdate;
    }

    if (pedidoId && pedidoId !== pagoToUpdate.pedido.nroPedido) {
      const pedidoToUpdate = await em.findOneOrFail(Pedido, { nroPedido: pedidoId });
      pagoToUpdate.pedido = pedidoToUpdate;
    }

    em.assign(pagoToUpdate, req.body);

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

export { findAll, add, findOne, update, remove };

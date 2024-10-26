import { NextFunction, Request, Response } from 'express'
import { Pago } from '../models/pago.entity.js'
import { orm } from '../shared/db/orm.js'
import { TipoPago } from '../models/tipoPago.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const pagos = await em.find(Pago, {})
    res
      .status(200)
      .json({ pagos: pagos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  console.log(req.body)
  try {
    const { tipoPago, ...pagoData } = req.body;
    let tipoPagoEntity;

    if (tipoPago?.id) {
      tipoPagoEntity = await em.findOne(TipoPago, tipoPago.id);
      if (!tipoPagoEntity) {
        return res.status(404).json({ message: 'Tipo de Pago no encontrado' });
      }
    } else {
      tipoPagoEntity = em.create(TipoPago, {
        nombre: tipoPago.nombre,
        descripcion: tipoPago.descripcion,
      });
    }

    let pago = em.create(Pago, { ...pagoData, tipoPago: tipoPagoEntity });
    await em.persistAndFlush(pago);
    res.status(201).json({ message: 'Pago creado!', data: pago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }

}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const PagoEncontrado = await em.findOneOrFail(Pago, { id }, { populate: ['tipoPago'] })
    res
      .status(200)
      .json({ message: 'se encontro el Pago!', data: PagoEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const pagoToUpdate = await em.findOneOrFail(Pago, { id })
    em.assign(pagoToUpdate, req.body)
    await em.flush()
    res.status(200).json({ message: 'Pago actualizado!', data: pagoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const pago = await em.getReference(Pago, id)
    await em.removeAndFlush(pago)
    res.status(200).json({ message: 'Pago borrado!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}



export { findAll, add, findOne, update, remove }


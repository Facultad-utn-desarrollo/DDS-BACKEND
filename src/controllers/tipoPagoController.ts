import { NextFunction, Request, Response } from 'express'
import { TipoPago } from '../models/tipoPago.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const tiposDePago = await em.find(TipoPago, {})
    res
      .status(200)
      .json({ message: 'Se encontraron los tipos De Pago!', data: tiposDePago })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const tipoPagoEncontrado = await em.findOneOrFail(TipoPago, { id })
    res
      .status(200)
      .json({ message: 'se encontro el tipo de Pago!', data: tipoPagoEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const tipoPago = em.create(TipoPago, req.body)
    tipoPago.disponible = true;
    await em.flush()
    res.status(201).json({ message: 'tipo de Pago creado!', data: tipoPago })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const tipoPago = await em.getReference(TipoPago, id)
    em.assign(tipoPago, req.body)
    await em.flush()
    res.status(200).json({ message: 'tipo de Pago actualizado!', data: tipoPago })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const tipoPago = await em.getReference(TipoPago, id)

    const tipoPagoNoDisponible = tipoPago
    tipoPagoNoDisponible.disponible = false;

    em.assign(tipoPago, tipoPagoNoDisponible)

    await em.flush()

    res.status(200).json({ message: 'tipo de Pago borrado!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove }
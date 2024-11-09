import { NextFunction, Request, Response } from 'express'
import { Repartidor } from '../models/repartidor.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const repartidores = await em.find(Repartidor, {})
    res
      .status(200)
      .json({ message: 'Se encontraron los repartidores!', data: repartidores })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const RepartidorEncontrado = await em.findOneOrFail(Repartidor, { id })
    res
      .status(200)
      .json({ message: 'se encontro el Repartidor!', data: RepartidorEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findRepartidoresActivos(req: Request, res: Response) {
  try {
    const repartidores = await em.find(Repartidor, { disponible: true });
    res.status(200).json({
      message: 'Se encontraron los repartidores activos!',
      data: repartidores,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function add(req: Request, res: Response) {
  try {
    const repartidor = em.create(Repartidor, req.body)
    repartidor.disponible = true;
    await em.flush()
    res.status(201).json({ message: 'Repartidor creado!', data: repartidor })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const repartidor = await em.getReference(Repartidor, id)
    em.assign(repartidor, req.body)
    await em.flush()
    res.status(200).json({ message: 'Repartidor actualizado!', data: repartidor })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const repartidor = await em.getReference(Repartidor, id)

    const repartidorNoDisponible = repartidor
    repartidorNoDisponible.disponible = false;

    em.assign(repartidor, repartidorNoDisponible)

    await em.flush()

    res.status(200).json({ message: 'Repartidor borrado!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove, findRepartidoresActivos }
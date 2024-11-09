import { NextFunction, Request, Response } from 'express'
import { TipoProducto } from '../models/tipoProducto.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const tiposDeProducto = await em.find(TipoProducto, {})
    res
      .status(200)
      .json({ message: 'Se encontraron los tipos de productos!', data: tiposDeProducto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const tipoProductoEncontrado = await em.findOneOrFail(TipoProducto, { id })
    res
      .status(200)
      .json({ message: 'se encontro el tipo de producto!', data: tipoProductoEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findTiposDeProductoActivos(req: Request, res: Response) {
  try {
    const tiposProducto = await em.find(TipoProducto, { disponible: true });
    res.status(200).json({
      message: 'Se encontraron los tipo producto activos!',
      data: tiposProducto,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const tipoProducto = await em.getReference(TipoProducto, id)

    const tipoProductoNoDisponible = tipoProducto
    tipoProductoNoDisponible.disponible = false;

    em.assign(tipoProducto, tipoProductoNoDisponible)

    await em.flush()

    res.status(201).json({ message: 'Tipo de producto creado!', data: tipoProducto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.body.id)
    const tipoProducto = await em.getReference(TipoProducto, id)
    em.assign(tipoProducto, req.body)
    await em.flush()
    res.status(200).json({ message: 'Tipo de Producto actualizado!', data: tipoProducto })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const tipoProducto = await em.getReference(TipoProducto, id)
    await em.removeAndFlush(tipoProducto)
    res.status(200).json({ message: 'Tipo de Producto borrado!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove, findTiposDeProductoActivos }
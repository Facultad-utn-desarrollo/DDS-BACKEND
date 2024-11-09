import { NextFunction, Request, Response } from 'express'
import { Cliente } from '../models/cliente.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const clientes = await em.find(Cliente, {})
    res
      .status(200)
      .json({ message: 'Se encontraron los clientes!', data: clientes })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const clienteEncontrado = await em.findOneOrFail(Cliente, { id })
    res
      .status(200)
      .json({ message: 'se encontro el cliente!', data: clienteEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findClientesActivos(req: Request, res: Response) {
  try {
    const clientes = await em.find(Cliente, { disponible: true });
    res.status(200).json({
      message: 'Se encontraron los clientes activos!',
      data: clientes,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const cliente = em.create(Cliente, req.body)
    cliente.disponible = true;
    await em.flush()
    res.status(201).json({ message: 'Cliente creado!', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.body.id)
    console.log(req.body)
    const cliente = await em.getReference(Cliente, id)
    em.assign(cliente, req.body)
    await em.flush()
    res.status(200).json({ message: 'cliente actualizado!', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const cliente = await em.getReference(Cliente, id)

    const clienteNoDisponible = cliente
    clienteNoDisponible.disponible = false;

    em.assign(cliente, clienteNoDisponible)

    await em.flush()
    res.status(200).json({ message: 'cliente dado de baja!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove, findClientesActivos }
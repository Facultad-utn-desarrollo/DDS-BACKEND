import { Request, Response } from 'express'
import { Zona } from '../models/zona.entity.js' 
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const zonas = await em.find(Zona, {})
    res.status(200).json({ message: 'Se encontraron las zonas!', data: zonas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const zonaEncontrada = await em.findOneOrFail(Zona, { id })
    res.status(200).json({ message: 'Se encontró la zona!', data: zonaEncontrada })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findZonasActivas(req: Request, res: Response) {
  try {
    const zonas = await em.find(Zona, { disponible: true });
    res.status(200).json({
      message: 'Se encontraron las zonas activas!',
      data: zonas,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {
    const zona = em.create(Zona, req.body)
    zona.disponible = true; 
    await em.flush()
    res.status(201).json({ message: 'Zona creada!', data: zona })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const zona = await em.getReference(Zona, id)
    em.assign(zona, req.body)
    await em.flush()
    res.status(200).json({ message: 'Zona actualizada!', data: zona })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const zona = await em.getReference(Zona, id)

    const zonaNoDisponible = zona
    zonaNoDisponible.disponible = false;

    em.assign(zona, zonaNoDisponible)

    await em.flush()

    res.status(200).json({ message: 'Zona dada de baja!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove, findZonasActivas }
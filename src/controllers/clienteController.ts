import { NextFunction, Request, Response } from 'express'
import { Cliente } from '../models/cliente.entity.js'
import { Zona } from '../models/zona.entity.js' 
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const clientes = await em.find(Cliente, {}, { populate: ['zona'] })
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
    const clienteEncontrado = await em.findOneOrFail(Cliente, { id }, { populate: ['zona'] })
    res
      .status(200)
      .json({ message: 'se encontro el cliente!', data: clienteEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findClientesActivos(req: Request, res: Response) {
  try {
    const clientes = await em.find(Cliente, { disponible: true }, { populate: ['zona'] });
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
    const { zona, ...clienteData } = req.body;
    
    const idZona = (typeof zona === 'object' && zona !== null) ? zona.id : zona;
    
    const zonaEntity = await em.findOne(Zona, idZona);
    
    if (!zonaEntity) {
        return res.status(404).json({ message: 'La zona especificada no existe' });
    }

    const cliente = em.create(Cliente, {
        ...clienteData,
        zona: zonaEntity,
        disponible: true
    });

    await em.persistAndFlush(cliente)
    res.status(201).json({ message: 'Cliente creado!', data: cliente })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id) || Number.parseInt(req.body.id);
    
    const cliente = await em.findOneOrFail(Cliente, { id }, { populate: ['zona'] });
    
    const { zona, ...restoDatos } = req.body;

    if (zona) {
        const idZona = (typeof zona === 'object' && zona !== null) ? zona.id : zona;
        const zonaEntity = await em.findOne(Zona, idZona);
        if (zonaEntity) {
            cliente.zona = zonaEntity;
        }
    }

    em.assign(cliente, restoDatos);
    
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
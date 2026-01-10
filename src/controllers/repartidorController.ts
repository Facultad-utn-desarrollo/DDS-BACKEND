import { NextFunction, Request, Response } from 'express'
import { Repartidor } from '../models/repartidor.entity.js'
import { Zona } from '../models/zona.entity.js' 
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const repartidores = await em.find(Repartidor, {}, { populate: ['zona'] })
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
    const RepartidorEncontrado = await em.findOneOrFail(Repartidor, { id }, { populate: ['zona'] })
    res
      .status(200)
      .json({ message: 'se encontro el Repartidor!', data: RepartidorEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findRepartidoresActivos(req: Request, res: Response) {
  try {
    const repartidores = await em.find(Repartidor, { disponible: true }, { populate: ['zona'] });
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
    const { zona, ...repartidorData } = req.body;
    let zonaEntity;

    const idZona = (typeof zona === 'object' && zona !== null) ? zona.id : zona;

    if (idZona) {
      zonaEntity = await em.findOne(Zona, idZona);
      if (!zonaEntity) {
        return res.status(404).json({ message: 'Zona no encontrada' });
      }
    } else {
        return res.status(400).json({ message: 'La zona es obligatoria' });
    }

    const repartidor = em.create(Repartidor, { 
        ...repartidorData, 
        zona: zonaEntity,
        disponible: true 
    });

    await em.persistAndFlush(repartidor);
    
    res.status(201).json({ message: 'Repartidor creado!', data: repartidor })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    
    const repartidor = await em.findOneOrFail(Repartidor, { id }, { populate: ['zona'] });
    
    const { zona, ...restoDatos } = req.body;

    if (zona) {
        const idZona = (typeof zona === 'object' && zona !== null) ? zona.id : zona;
        const zonaEntity = await em.findOne(Zona, idZona);
        if (zonaEntity) {
            repartidor.zona = zonaEntity;
        }
    }

    em.assign(repartidor, restoDatos);
    
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

    repartidor.disponible = false;
    
    await em.flush()

    res.status(200).json({ message: 'Repartidor borrado!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export { findAll, findOne, add, update, remove, findRepartidoresActivos }
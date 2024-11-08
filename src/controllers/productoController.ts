import { NextFunction, Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Producto } from '../models/producto.entity.js'
import { TipoProducto } from '../models/tipoProducto.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const productos = await em.find(Producto, {}, { populate: ['tipoProducto'] })
    res
      .status(200)
      .json({productos: productos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const codigo = Number.parseInt(req.params.codigo)
    const productoEncontrado = await em.findOneOrFail(Producto, { codigo }, { populate: ['tipoProducto'] })
    res
      .status(200)
      .json({ message: 'se encontro el producto!', data: productoEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function add(req: Request, res: Response) {
  try {
    const { tipoProducto, ...productoData } = req.body;

    let tipoProductoEntity;
    
    // Si el tipoProducto tiene un ID, buscarlo en la base de datos
    if (tipoProducto?.id) {
      tipoProductoEntity = await em.findOne(TipoProducto, tipoProducto.id);
      
      // Si no se encuentra el tipoProducto, lanza un error
      if (!tipoProductoEntity) {
        return res.status(404).json({ message: 'TipoProducto no encontrado' });
      }
    } else {
      // Si no hay ID, crear uno nuevo con los datos proporcionados
      tipoProductoEntity = em.create(TipoProducto, tipoProducto);
    }

    // Crear el Producto con el tipoProducto existente o recién creado
    let producto = em.create(Producto, { ...productoData, tipoProducto: tipoProductoEntity });

    // Guardar los cambios
    await em.persistAndFlush(producto);
    
    // Responder con el producto creado
    res.status(201).json({ message: 'Producto creado!', data: producto });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const codigo = Number.parseInt(req.body.codigo)
    const productoToUpdate = await em.findOneOrFail(Producto, { codigo })
    em.assign(productoToUpdate, req.body)
    await em.flush()
    res.status(200).json({ message: 'Producto actualizado!', data: productoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const codigo = Number.parseInt(req.params.codigo)
    const producto = await em.findOneOrFail(Producto, { codigo })
    await em.removeAndFlush(producto)
    res.status(200).json({ message: 'Producto borrado!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

export {
  findAll
  , findOne,
  add,
  update,
  remove
}
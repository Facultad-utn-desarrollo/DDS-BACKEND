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
      .json({ productos: productos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findProductosActivos(req: Request, res: Response) {
  try {
    const productos = await em.find(Producto, { disponible: true });
    res.status(200).json({
      message: 'Se encontraron los productos activos!',
      data: productos,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllByFilters(req: Request, res: Response) {
  try {

    const descripcionFilter = req.query.descripcion ? String(req.query.descripcion) : '';
    const tipoProductoFilter = req.query.tipoProducto ? Number(req.query.tipoProducto) : null;
    const precioMinimo = req.query.precioMinimo ? Number(req.query.precioMinimo) : null;
    const precioMaximo = req.query.precioMaximo ? Number(req.query.precioMaximo) : null;
    const disponible = req.query.disponible;

    const filter: any = {};

    if (descripcionFilter) {
      filter.descripcion = { $like: `%${descripcionFilter}%` };
    }

    if (tipoProductoFilter) {
      filter.tipoProducto = tipoProductoFilter;
    }

    if (precioMinimo || precioMaximo) {
      filter.precio = {};

      if (precioMinimo) {
        filter.precio.$gte = precioMinimo;
      }

      if (precioMaximo) {
        filter.precio.$lte = precioMaximo;
      }
    }

    if (disponible !== undefined && disponible !== null && disponible !== 'null') {
        filter.disponible = (disponible === 'true');
    }

    const productos = await em.find(Producto, filter, {
      populate: ['tipoProducto'],
    });

    res.status(200).json({ productos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
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

    if (tipoProducto?.id) {
      tipoProductoEntity = await em.findOne(TipoProducto, tipoProducto.id);

      if (!tipoProductoEntity) {
        return res.status(404).json({ message: 'TipoProducto no encontrado' });
      }
    }

    let producto = em.create(Producto, { ...productoData, tipoProducto: tipoProductoEntity });

    await em.persistAndFlush(producto);

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
    const producto = await em.findOneOrFail(Producto, { codigo });

    producto.disponible = false;
    await em.flush();

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
  remove,
  findAllByFilters,
  findProductosActivos
}
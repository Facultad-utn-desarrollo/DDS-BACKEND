import { NextFunction, Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Pedido } from '../models/pedido.entity.js'
import { LineaDeProducto } from '../models/lineaDeProducto.entity.js'
import { Producto } from '../models/producto.entity.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const pedidos = await em.find(Pedido, {}, { populate: ['cliente', 'lineas', 'pago', 'entrega'] })
    res
      .status(200)
      .json({ message: 'Se encontraron los pedidos!', data: pedidos })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findPedidosSinPago(req: Request, res: Response) {
  try {
    const pedidosSinPago = await em.find(Pedido, { pago: null });
    res.status(200).json({ message: 'Se encontraron los pedidos sin pago!', data: pedidosSinPago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const nroPedido = Number.parseInt(req.params.nroPedido)
    const pedidoEncontrado = await em.findOneOrFail(Pedido, { nroPedido }, { populate: ['cliente', 'lineas', 'pago', 'entrega'] })
    res
      .status(200)
      .json({ message: 'se encontro el pedido!', data: pedidoEncontrado })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}


async function add(req: Request, res: Response) {
  try {
    const { total, cliente, fecha, lineas } = req.body;

    // Crear una nueva instancia de Pedido
    const pedido = new Pedido();
    pedido.total = total;
    pedido.fecha = new Date(); // Usa la fecha actual o convierte desde el cuerpo de la solicitud
    pedido.cliente = cliente; // Asegúrate de que el cliente también sea una instancia válida

    // Agregar cada línea de producto al pedido
    for (const linea of lineas) {
      const lineaDeProducto = new LineaDeProducto();
      lineaDeProducto.cantidad = linea.cantidad;
      lineaDeProducto.subtotal = linea.subtotal;

      // Encontrar el producto por su código
      const productoEntity = await em.findOneOrFail(Producto, { codigo: linea.producto.codigo });

      // Asignar el producto a la línea
      lineaDeProducto.producto = productoEntity;

      // Agregar la línea de producto al pedido
      pedido.lineas.add(lineaDeProducto);
    }

    // Guardar el pedido
    await em.persistAndFlush(pedido);

    res.status(201).json({ message: 'Pedido creado con éxito!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




async function update(req: Request, res: Response) {
  try {
    const nroPedido = Number.parseInt(req.params.nroPedido)
    const pedidoToUpdate = await em.findOneOrFail(Pedido, { nroPedido })
    em.assign(pedidoToUpdate, req.body)
    await em.flush()
    res.status(200).json({ message: 'Pedido actualizado!', data: pedidoToUpdate })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function remove(req: Request, res: Response) {
  try {
    const nroPedido = Number.parseInt(req.params.nroPedido)
    const pedido = await em.findOneOrFail(Pedido, { nroPedido })
    await em.removeAndFlush(pedido)
    res.status(200).json({ message: 'Pedido borrado!' })
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
  findPedidosSinPago
}
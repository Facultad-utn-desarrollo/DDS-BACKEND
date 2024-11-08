import { NextFunction, Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Pedido } from '../models/pedido.entity.js'
import { LineaDeProducto } from '../models/lineaDeProducto.entity.js'
import { Producto } from '../models/producto.entity.js'
import { Entrega } from '../models/entrega.entity.js'

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

async function findPedidosPagosSinEntrega(req: Request, res: Response) {
  try {
    const pedidosConPagoySinEntrega = await em.find(Pedido, { pago: { $ne: null }, entrega: null });
    res.status(200).json({ message: 'Se encontraron los pedidos con pago pero sin entrega!', data: pedidosConPagoySinEntrega });
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
    const nroPedido = Number.parseInt(req.params.nroPedido);

    // Buscamos el pedido en la base de datos y aseguramos que la colección 'lineas' esté cargada
    const pedido = await em.findOneOrFail(Pedido, { nroPedido }, { populate: ['lineas'] });

    // Si el pedido tiene un pago, lo eliminamos primero
    if (pedido.pago) {
      await em.removeAndFlush(pedido.pago);
    }

    // Si el pedido tiene una entrega asociada
    if (pedido.entrega) {
      const entrega = await em.findOneOrFail(Entrega, { id: pedido.entrega.id });

      // Eliminar el pedido de la lista de pedidos en la entrega
      entrega.pedidos.remove(pedido);
      await em.flush();  // Guardamos los cambios en la entrega (ya no tiene ese pedido)
    }

    // Eliminar las líneas de productos asociadas al pedido
    if (pedido.lineas && pedido.lineas.isInitialized()) {
      await em.removeAndFlush(pedido.lineas.getItems());
    }

    // Finalmente, eliminamos el pedido
    await em.removeAndFlush(pedido);

    // Enviamos la respuesta de éxito
    res.status(200).json({ message: 'Pedido, pago, lineas de productos y relación de entrega eliminados correctamente.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




export {
  findAll
  , findOne,
  add,
  update,
  remove,
  findPedidosSinPago,
  findPedidosPagosSinEntrega
}
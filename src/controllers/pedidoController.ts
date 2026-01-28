import { NextFunction, Request, Response } from 'express'
import { orm } from '../shared/db/orm.js'
import { Pedido } from '../models/pedido.entity.js'
import { LineaDeProducto } from '../models/lineaDeProducto.entity.js'
import { Producto } from '../models/producto.entity.js'
import { Entrega } from '../models/entrega.entity.js'
import { Cliente } from '../models/cliente.entity.js'

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
    const pedidosSinPago = await em.find(Pedido, { pago: null }, { populate: ['lineas', 'lineas.producto', 'cliente'] });
    res.status(200).json({ message: 'Se encontraron los pedidos sin pago!', data: pedidosSinPago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findPedidosPagosSinEntrega(req: Request, res: Response) {
  try {
    const pedidosConPagoySinEntrega = await em.find(Pedido, { pago: { $ne: null }, entrega: null }, { populate: ['pago', 'cliente', 'cliente.zona','entrega'] });
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

    const pedido = new Pedido();
    pedido.total = total;
    pedido.fecha = fecha ? new Date(fecha) : new Date();
    pedido.cliente = cliente;


    for (const linea of lineas) {
      const lineaDeProducto = new LineaDeProducto();
      lineaDeProducto.cantidad = linea.cantidad;
      lineaDeProducto.subtotal = linea.subtotal;

      const productoEntity = await em.findOneOrFail(Producto, { codigo: linea.producto.codigo });

      lineaDeProducto.producto = productoEntity;

      pedido.lineas.add(lineaDeProducto);
    }

    await em.persistAndFlush(pedido);

    res.status(201).json({ message: 'Pedido creado con éxito!', data: pedido });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const nroPedido = Number.parseInt(req.params.nroPedido);

    const pedidoToUpdate = await em.findOneOrFail(Pedido, { nroPedido }, { populate: ['lineas'] });

    const { lineas, cliente, ...datosCabecera } = req.body;

    em.assign(pedidoToUpdate, datosCabecera);

    if (cliente) {
        const idCliente = (cliente.id) ? cliente.id : cliente;
        pedidoToUpdate.cliente = em.getReference(Cliente, idCliente) as any;
    }

    if (lineas && lineas.length > 0) {
      
      const lineasActuales = pedidoToUpdate.lineas.getItems();
      for (const linea of lineasActuales) {
        const found = lineas.find((l: any) => l.id === linea.id);
        if (!found) {
          pedidoToUpdate.lineas.remove(linea);
        }
      }

      for (const lineaData of lineas) {
        
        const idProducto = (lineaData.producto && lineaData.producto.codigo) 
                           ? lineaData.producto.codigo 
                           : lineaData.producto;

        const productoRef = em.getReference(Producto, idProducto);

        if (lineaData.id) {
          const existingLinea = pedidoToUpdate.lineas.getItems().find((l) => l.id === lineaData.id);
          if (existingLinea) {
            existingLinea.cantidad = lineaData.cantidad;
            existingLinea.subtotal = lineaData.subtotal;
            existingLinea.producto = productoRef;
          }
        } else {
          const nuevaLinea = em.create(LineaDeProducto, {
            cantidad: lineaData.cantidad,
            subtotal: lineaData.subtotal,
            producto: productoRef,
            pedido: pedidoToUpdate
          });
          
          pedidoToUpdate.lineas.add(nuevaLinea);
        }
      }
    } else if (lineas && lineas.length === 0) {
        pedidoToUpdate.lineas.removeAll();
    }

    let nuevoTotal = 0;
    pedidoToUpdate.lineas.getItems().forEach((linea) => {
        nuevoTotal += Number(linea.subtotal);
    });
    pedidoToUpdate.total = nuevoTotal;

    console.log('Actualizando pedido. Nuevo total:', pedidoToUpdate.total);
    
    await em.flush();

    res.status(200).json({ message: 'Pedido actualizado!', data: pedidoToUpdate });

  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function findAllPedidosByFilters(req: Request, res: Response) {
  try {
    const clienteId = req.query.clienteId ? Number(req.query.clienteId) : null;
    const fechaInicio = req.query.fechaInicio ? new Date(req.query.fechaInicio as string) : null;
    const fechaFin = req.query.fechaFin ? new Date(req.query.fechaFin as string) : null;

    const filter: any = {};

    if (clienteId && !isNaN(clienteId)) {
      filter.cliente = clienteId;
    }

    if (fechaInicio && !isNaN(fechaInicio.getTime())) {
      filter.fecha = filter.fecha || {};
      filter.fecha.$gte = fechaInicio;
    }

    if (fechaFin && !isNaN(fechaFin.getTime())) {
      filter.fecha = filter.fecha || {};
      filter.fecha.$lte = fechaFin;
    }
    delete filter.nroPedido;


    const pedidos = await em.find(Pedido, filter, {
      populate: ['cliente', 'entrega', 'pago', 'lineas'],
    });

    res.status(200).json({ pedidos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}



async function remove(req: Request, res: Response) {
  try {
    const nroPedido = Number.parseInt(req.params.nroPedido);

    const pedido = await em.findOneOrFail(Pedido, { nroPedido }, { populate: ['lineas'] });

    if (pedido.pago) {
      await em.removeAndFlush(pedido.pago);
    }

    if (pedido.entrega) {
      const entrega = await em.findOneOrFail(Entrega, { id: pedido.entrega.id });

      entrega.pedidos.remove(pedido);
      await em.flush();
    }

    if (pedido.lineas && pedido.lineas.isInitialized()) {
      await em.removeAndFlush(pedido.lineas.getItems());
    }

    await em.removeAndFlush(pedido);

    res.status(200).json({ message: 'Pedido, pago, lineas de productos y relación de entrega eliminados correctamente.' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}




export {findAll, findOne, add, update, remove, findPedidosSinPago, findPedidosPagosSinEntrega, findAllPedidosByFilters}
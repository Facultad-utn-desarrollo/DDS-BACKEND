import { NextFunction, Request, Response } from 'express'
import { Entrega } from '../models/entrega.entity.js'
import { Pedido } from '../models/pedido.entity.js'
import { Repartidor } from '../models/repartidor.entity.js'
import { Zona } from '../models/zona.entity.js'
import { orm } from '../shared/db/orm.js'

const em = orm.em

async function findAll(req: Request, res: Response) {
  try {
    const entregas = await em.find(Entrega, {}, { populate: ['repartidor', 'pedidos', 'zona'] })
    res.status(200).json({ message: 'Entregas encontradas', data: entregas })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const EntregaEncontrada = await em.findOneOrFail(Entrega, { id }, {
      populate: ['repartidor', 'pedidos', 'pedidos.cliente.zona', 'zona']
    })
    res.status(200).json({ message: 'Se encontró la entrega!', data: EntregaEncontrada })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function add(req: Request, res: Response) {
  try {
    const { id, repartidor, pedidos, zona, ...entregaData } = req.body;

    // 1. Validar y Buscar Zona
    const idZona = (typeof zona === 'object' && zona !== null) ? zona.id : zona;
    const zonaEntity = await em.findOne(Zona, idZona);
    if (!zonaEntity) return res.status(404).json({ message: 'Zona no encontrada' });

    // 2. Validar y Buscar Repartidor
    let repartidorEntity;
    if (repartidor?.id) {
      repartidorEntity = await em.findOne(Repartidor, repartidor.id, { populate: ['zona'] });
      if (!repartidorEntity) return res.status(404).json({ message: 'Repartidor no encontrado' });

      // Validación de zona repartidor
      if (repartidorEntity.zona.id !== zonaEntity.id) {
        return res.status(400).json({ message: 'El repartidor no pertenece a la zona seleccionada' });
      }
    }

    // 3. PRE-VALIDACIÓN DE PEDIDOS (Antes de crear la entrega)
    // Esto soluciona el problema de que se cree la entrega vacía si fallan las fechas.
    const pedidosEntities: Pedido[] = [];
    const fechaEntrega = new Date(entregaData.fecha); // Fecha que viene del body
    fechaEntrega.setHours(0, 0, 0, 0); // Normalizamos

    if (pedidos && pedidos.length > 0) {
      const nroPedidos = pedidos.map((pedido: Pedido) => pedido.nroPedido);

      // Buscamos los pedidos completos
      const encontrados = await em.find(Pedido, { nroPedido: { $in: nroPedidos } }, { populate: ['pago', 'cliente', 'cliente.zona'] });

      if (encontrados.length !== nroPedidos.length) {
        return res.status(404).json({ message: 'Algunos de los pedidos no se encuentran' });
      }

      // Validamos reglas de negocio UNO POR UNO antes de guardar nada
      for (const pedido of encontrados) {
        // A. Validar Pago
        if (!pedido.pago) {
          return res.status(400).json({ message: `El pedido #${pedido.nroPedido} no está pagado.` });
        }

        // B. Validar Fecha (Entrega vs Pedido)
        const fechaPedido = new Date(pedido.fecha);
        fechaPedido.setHours(0, 0, 0, 0);

        if (fechaEntrega < fechaPedido) {
          return res.status(400).json({ message: `La fecha de entrega es anterior a la del pedido #${pedido.nroPedido}` });
        }

        // C. Validar Zona
        if ((pedido.cliente as any).zona.id !== zonaEntity.id) {
          return res.status(400).json({ message: `El pedido #${pedido.nroPedido} pertenece a otra zona.` });
        }

        pedidosEntities.push(pedido);
      }
    }

    // 4. Si llegamos acá, TODO ES VÁLIDO. Recién ahora creamos la entrega.
    const entrega = em.create(Entrega, {
      ...entregaData,
      repartidor: repartidorEntity,
      zona: zonaEntity
    });

    // Asignamos los pedidos ya validados a la entrega
    pedidosEntities.forEach(pedido => {
      entrega.pedidos.add(pedido);
      pedido.entrega = entrega;
    });

    // 5. Guardamos todo junto en una sola transacción atómica implícita
    await em.persistAndFlush(entrega);

    res.status(201).json({ message: 'Entrega creada!', data: entrega });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { repartidor, pedidos, zona, fecha } = req.body;

    // Buscamos la entrega actual
    const entregaToUpdate = await em.findOneOrFail(Entrega, { id }, { populate: ['repartidor', 'pedidos', 'zona'] });

    // Determinamos la FECHA EFECTIVA para las validaciones
    // (Si viene fecha nueva en el body la usamos, sino usamos la que ya tenía la entrega)
    let fechaEfectivaEntrega = fecha ? new Date(fecha) : new Date(entregaToUpdate.fecha);
    fechaEfectivaEntrega.setHours(0, 0, 0, 0);

    // Actualizamos la fecha en la entidad si cambió
    if (fecha) {
      entregaToUpdate.fecha = new Date(fecha);
    }

    // Actualizar Zona
    let zonaEntity = entregaToUpdate.zona; // Por defecto la que ya tiene
    if (zona) {
      const idZona = (typeof zona === 'object') ? zona.id : zona;
      const encontrada = await em.findOne(Zona, idZona);
      if (encontrada) {
        entregaToUpdate.zona = encontrada;
        zonaEntity = encontrada; // Actualizamos referencia para validar pedidos
      }
    }

    // Actualizar Repartidor
    if (repartidor && repartidor.id !== entregaToUpdate.repartidor.id) {
      const repartidorToUpdate = await em.findOneOrFail(Repartidor, { id: repartidor.id });
      entregaToUpdate.repartidor = repartidorToUpdate;
    }

    // Actualizar Pedidos
    entregaToUpdate.pedidos.removeAll(); // Quitamos los viejos

    if (pedidos && pedidos.length > 0) {
      for (const pedidoData of pedidos) {
        // Buscamos el pedido completo para validar
        const pedidoToAdd = await em.findOneOrFail(Pedido, { nroPedido: pedidoData.nroPedido }, { populate: ['pago', 'cliente', 'cliente.zona'] });

        // A. Validar Pago
        if (!pedidoToAdd.pago) {
          return res.status(400).json({ message: `El pedido #${pedidoToAdd.nroPedido} no está pagado.` });
        }

        // B. Validar Fecha (Nueva Fecha Entrega vs Fecha Pedido)
        const fechaPedido = new Date(pedidoToAdd.fecha);
        fechaPedido.setHours(0, 0, 0, 0);

        if (fechaEfectivaEntrega < fechaPedido) {
          return res.status(400).json({ message: `La fecha de entrega es anterior a la del pedido #${pedidoToAdd.nroPedido}` });
        }

        // C. Validar Zona (Zona Pedido vs Nueva Zona Entrega)
        if ((pedidoToAdd.cliente as any).zona.id !== zonaEntity.id) {
            return res.status(400).json({ message: `El pedido #${pedidoToAdd.nroPedido} pertenece a otra zona.` });
        }

        // Si pasa, lo agregamos
        entregaToUpdate.pedidos.add(pedidoToAdd);
      }
    }

    await em.flush();
    res.status(200).json({ message: 'Entrega actualizada!', data: entregaToUpdate });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id)
    const entrega = await em.getReference(Entrega, id)
    await em.removeAndFlush(entrega)
    res.status(200).json({ message: 'Entrega borrada!' })
  } catch (error: any) {
    res.status(500).json({ message: error.message })
  }
}

async function findAllByFilters(req: Request, res: Response) {
  try {
    const fechaDesde = req.query.fechaDesde ? new Date(String(req.query.fechaDesde)) : null;
    const fechaHasta = req.query.fechaHasta ? new Date(String(req.query.fechaHasta)) : null;
    const clienteId = req.query.clienteId ? Number(req.query.clienteId) : null;

    const filter: any = {};

    if (fechaDesde || fechaHasta) {
      filter.fecha = {};

      if (fechaDesde) {
        fechaDesde.setHours(0, 0, 0, 0);
        filter.fecha.$gte = fechaDesde;
      }

      if (fechaHasta) {
        fechaHasta.setHours(23, 59, 59, 999);
        filter.fecha.$lte = fechaHasta;
      }
    }

    if (clienteId) {
      filter.pedidos = { cliente: { id: clienteId } };
    }

    const entregas = await em.find(Entrega, filter, {
      populate: ['repartidor', 'pedidos', 'pedidos.cliente', 'zona'],
    });

    res.status(200).json({ message: 'Entregas filtradas', data: entregas });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, findOne, add, update, remove, findAllByFilters }
import { NextFunction, Request, Response } from 'express';
import { Pago } from '../models/pago.entity.js';
import { orm } from '../shared/db/orm.js';
import { TipoPago } from '../models/tipoPago.entity.js';
import { Pedido } from '../models/pedido.entity.js';
import { SourceTextModule } from 'vm';

const em = orm.em;

async function findAll(req: Request, res: Response) {
  try {
    const pagos = await em.find(Pago, {}, { populate: ['pedido', 'tipoPago'] });
    res.status(200).json({ pagos });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function add(req: Request, res: Response) {
  try {

    const { tipoPago, pedido, ...pagoData } = req.body;
    let tipoPagoEntity;
    let pedidoEntity;

    // Si no se ha proporcionado fecha, asigna la fecha actual
    if (pagoData.fecha == "" || pagoData.fecha == null) {
      pagoData.fecha = new Date();
    }
    if (pagoData.id == 0) { pagoData.id = null }

    // Obtener o crear el TipoPago
    if (tipoPago?.id) {
      tipoPagoEntity = await em.findOne(TipoPago, tipoPago.id);
      if (!tipoPagoEntity) {
        return res.status(404).json({ message: 'Tipo de Pago no encontrado' });
      }
    } else {
      tipoPagoEntity = em.create(TipoPago, {
        nombre: tipoPago.nombre,
        descripcion: tipoPago.descripcion,
        disponible: tipoPago.disponible
      });
    }

    // Obtener el Pedido
    if (pedido?.nroPedido) {
      pedidoEntity = await em.findOne(Pedido, pedido.nroPedido);
      if (!pedidoEntity) {
        return res.status(404).json({ message: 'Pedido no encontrado' });
      }

      // Verificar si el pedido ya tiene un pago asociado
      if (pedidoEntity.pago) {
        return res.status(400).json({ message: 'El pedido ya tiene un pago asociado' });
      }
    }

    // Crear el pago
    let pago = em.create(Pago, { ...pagoData, tipoPago: tipoPagoEntity, pedido: pedidoEntity });

    // Persistir el pago primero para asegurarse de que tiene un id válido
    await em.persistAndFlush(pago);

    // Verifica que el pago tiene un id válido antes de asignarlo al pedido
    if (!pago) {
      return res.status(500).json({ message: 'Error al guardar el pago: ID no válido' });
    }

    // Ahora que el pago tiene un id válido, lo asociamos al pedido
    if (pedidoEntity) {
      pedidoEntity.pago = pago; // Asociar el pago al pedido
      await em.persistAndFlush(pedidoEntity); // Persistir el pedido con el pago asociado
    }

    // Devolver la respuesta
    res.status(201).json({ message: 'Pago creado y asociado al pedido!', data: pago });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


async function findOne(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pagoEncontrado = await em.findOneOrFail(Pago, { id }, { populate: ['tipoPago'] });
    res.status(200).json({ message: 'Se encontró el Pago!', data: pagoEncontrado });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

async function update(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const { pedidoId, tipoPagoId } = req.body;

    // 1. Encontrar el pago existente y cargar sus relaciones
    const pagoToUpdate = await em.findOneOrFail(Pago, { id }, { populate: ['pedido', 'tipoPago'] });

    // 2. Actualizar el tipoPago (si cambia)
    if (tipoPagoId && tipoPagoId !== pagoToUpdate.tipoPago.id) {
      const tipoPagoToUpdate = await em.findOneOrFail(TipoPago, { id: tipoPagoId });
      pagoToUpdate.tipoPago = tipoPagoToUpdate; // Asignar nuevo tipo de pago
    }

    // 3. Actualizar el pedido (si cambia)
    if (pedidoId && pedidoId !== pagoToUpdate.pedido.nroPedido) {
      const pedidoToUpdate = await em.findOneOrFail(Pedido, { nroPedido: pedidoId });
      pagoToUpdate.pedido = pedidoToUpdate; // Asignar nuevo pedido
    }

    // 4. Asignar los valores restantes del cuerpo de la solicitud al pago
    em.assign(pagoToUpdate, req.body);

    // 5. Guardar los cambios en la base de datos
    await em.flush();

    // 6. Responder con el resultado
    res.status(200).json({ message: 'Pago actualizado!', data: pagoToUpdate });
  } catch (error: any) {
    // Error al procesar la solicitud
    res.status(500).json({ message: error.message });
  }
}


async function remove(req: Request, res: Response) {
  try {
    const id = Number.parseInt(req.params.id);
    const pago = await em.getReference(Pago, id);
    await em.removeAndFlush(pago);
    res.status(200).json({ message: 'Pago borrado!' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}

export { findAll, add, findOne, update, remove };

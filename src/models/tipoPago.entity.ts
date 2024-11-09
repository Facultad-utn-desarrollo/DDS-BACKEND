import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { Pago } from "./pago.entity.js";

@Entity()
export class TipoPago {

  @PrimaryKey()
  id?: number
  @Property()
  nombre!: string;
  @Property()
  descripcion!: string;

  @Property()
  disponible: boolean = true;

  @OneToMany(() => Pago, (pago) => pago.tipoPago, { cascade: [Cascade.ALL], })
  pagos = new Collection<Pago>(this)

  /*constructor(
    nombre: string,
    descripcion: string,
  ) {
    this.nombre = nombre;
    this.descripcion = descripcion;
  }*/
}
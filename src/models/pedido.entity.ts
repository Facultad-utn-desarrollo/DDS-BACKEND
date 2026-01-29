import { Cliente } from "./cliente.entity.js";
import { Entrega } from "./entrega.entity.js";
import { Pago } from "./pago.entity.js";
import { LineaDeProducto } from "./lineaDeProducto.entity.js";
import { Cascade, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property, Ref, Rel, OneToOne } from "@mikro-orm/core";
import { User } from "./user.entity.js";

@Entity()
export class Pedido {
  @PrimaryKey()
  nroPedido?: number

  @Property()
  fecha!: Date;

  @Property()
  total!: number;

  @ManyToOne(() => Cliente, { nullable: false })
  cliente!: Ref<Cliente>;

  @ManyToOne({ entity: () => Entrega, nullable: true })
  entrega!: Rel<Entrega>;

  @OneToOne(() => Pago, { nullable: true, eager: true })
  pago!: Rel<Pago>;

  @OneToMany(() => LineaDeProducto, lineaDeProducto => lineaDeProducto.pedido, {
    mappedBy: lineaDeProducto => lineaDeProducto.pedido,
    cascade: [Cascade.ALL],
    orphanRemoval: true,
  })
  lineas = new Collection<LineaDeProducto>(this);
  
  /* @ManyToOne({ entity: () => User, nullable: true,cascade: [Cascade.MERGE] })
  user!: Rel<User>; */ // Relación con el User, un Pedido siempre debe pertenecer a un User
}
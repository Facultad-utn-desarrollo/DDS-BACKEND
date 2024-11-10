import { Entity, ManyToOne, PrimaryKey, Property, Rel, OneToOne, Cascade } from "@mikro-orm/core";
import { TipoPago } from "./tipoPago.entity.js";
import { Pedido } from "./pedido.entity.js";

@Entity()
export class Pago {
    @PrimaryKey()
    id?: number;

    @Property()
    fecha!: Date;

    @ManyToOne({ entity: () => TipoPago, nullable: false })
    tipoPago!: Rel<TipoPago>;

    @OneToOne(() => Pedido, { nullable: false, cascade: [Cascade.PERSIST, Cascade.MERGE] })
    pedido!: Rel<Pedido>;


}
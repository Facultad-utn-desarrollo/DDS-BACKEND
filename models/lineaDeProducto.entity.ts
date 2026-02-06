import { Entity, ManyToOne, PrimaryKey, Property, Rel } from "@mikro-orm/core";
import { Producto } from "./producto.entity.js";
import { Pedido } from "./pedido.entity.js";
@Entity()
export class LineaDeProducto {

    @PrimaryKey()
    id?: number

    @ManyToOne(() => Producto, { nullable: false })
    producto!: Rel<Producto>;

    @ManyToOne(() => Pedido, { nullable: false })
    pedido!: Rel<Pedido>;

    @Property()
    cantidad!: number;

    @Property()
    subtotal!: number;

}

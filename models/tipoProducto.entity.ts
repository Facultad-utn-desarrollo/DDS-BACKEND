import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { Producto } from "./producto.entity.js";

@Entity()
export class TipoProducto {
    @PrimaryKey()
    id?: number;
    @Property()
    nombre!: string;

    @Property()
    disponible: boolean = true;

    @OneToMany(() => Producto, (producto) => producto.tipoProducto, { cascade: [Cascade.ALL], })
    productos = new Collection<Producto>(this)

}
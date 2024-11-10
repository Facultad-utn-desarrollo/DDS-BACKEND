import { Entity, ManyToOne, PrimaryKey, Property, OneToMany, Collection, Cascade, Rel } from "@mikro-orm/core";
import { TipoProducto } from "./tipoProducto.entity.js";
import { LineaDeProducto } from "./lineaDeProducto.entity.js";

@Entity()
export class Producto {
    @PrimaryKey()
    codigo?: number
    @Property()
    descripcion!: string;
    @Property()
    stock!: number;
    @Property()
    precio!: number;
    @ManyToOne({
        entity: () => TipoProducto,
        nullable: false,
        cascade: [Cascade.MERGE],
    })
    tipoProducto!: Rel<TipoProducto>;

    @Property()
    disponible: boolean = true;

    @OneToMany(() => LineaDeProducto, (lineaDeProducto) => lineaDeProducto.producto, { cascade: [Cascade.ALL], })
    lineas = new Collection<LineaDeProducto>(this)


}
import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { Entrega } from "./entrega.entity.js";

@Entity()
export class Repartidor {

    @PrimaryKey()
    id?: number
    @Property()
    cuit!: number;
    @Property()
    apellidoNombre!: String;
    @Property()
    vehiculo!: String;
    @Property()
    zona!: String;

    @Property()
    disponible: boolean = true;

    @OneToMany(() => Entrega, (entrega) => entrega.repartidor, { cascade: [Cascade.ALL], })
    entregas = new Collection<Entrega>(this)

    /*constructor(nroDoc: number, vehiculo: String, zona: String) {
        this.cuit = nroDoc
        this.vehiculo = vehiculo
        this.zona = zona
    }*/
}
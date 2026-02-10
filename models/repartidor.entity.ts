import { Entity, PrimaryKey, Property, OneToMany, Collection, Rel, Cascade, ManyToOne } from "@mikro-orm/core";
import { Entrega } from "./entrega.entity.js";
import { Zona } from "./zona.entity.js";

@Entity()
export class Repartidor {

    @PrimaryKey()
    id?: number
    @Property()
    cuit!: String;
    @Property()
    apellidoNombre!: String;
    @Property()
    vehiculo!: String;
    //@Property()
    //zona!: String;

    @Property()
    disponible: boolean = true;

    @OneToMany(() => Entrega, (entrega) => entrega.repartidor, { cascade: [Cascade.ALL], })
    entregas = new Collection<Entrega>(this)

    @ManyToOne(() => Zona, { nullable: false })
    zona!: Rel<Zona>;
}
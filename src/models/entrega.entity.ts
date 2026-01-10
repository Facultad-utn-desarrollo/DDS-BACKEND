import { Entity, ManyToOne, PrimaryKey, PrimaryKeyProp, Property, OneToMany, Cascade, Collection, Rel } from "@mikro-orm/core";
import { Repartidor } from "./repartidor.entity.js";
import { Pedido } from "./pedido.entity.js";
import { Zona } from "./zona.entity.js";

@Entity()
export class Entrega {

    @PrimaryKey()
    id?: number

    @Property()
    fecha!: Date;

    //@Property({ nullable: false })
    //zona!: string;

    @ManyToOne({ entity: () => Repartidor, nullable: false })
    repartidor!: Rel<Repartidor>;

      @ManyToOne(() => Zona, { nullable: false })
        zona!: Rel<Zona>;

    @OneToMany(() => Pedido, (pedido) => pedido.entrega, { cascade: [Cascade.ALL], })
    pedidos = new Collection<Pedido>(this)


}
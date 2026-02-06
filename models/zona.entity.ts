import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade } from "@mikro-orm/core";
import { Cliente } from "./cliente.entity.js";
import { Repartidor } from "./repartidor.entity.js"; 
import { Entrega } from "./entrega.entity.js";    

@Entity()
export class Zona {

  @PrimaryKey()
  id?: number;

  @Property()
  nombre!: string;

  @Property() 
  descripcion!: string;

  @Property()
  disponible: boolean = true;

  @OneToMany(() => Cliente, (cliente) => cliente.zona, { cascade: [Cascade.ALL] })
  clientes = new Collection<Cliente>(this);

  @OneToMany(() => Repartidor, (repartidor) => repartidor.zona, { cascade: [Cascade.ALL] })
  repartidores = new Collection<Repartidor>(this);

  @OneToMany(() => Entrega, (entrega) => entrega.zona, { cascade: [Cascade.ALL] })
  entregas = new Collection<Entrega>(this);

}
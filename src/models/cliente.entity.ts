import { Entity, PrimaryKey, Property, OneToMany, Collection, Rel, Cascade, ManyToOne, OneToOne } from "@mikro-orm/core";
import { Pedido } from "./pedido.entity.js";
import { Zona } from "./zona.entity.js";
import { User } from "./user.entity.js";

@Entity()
export class Cliente {

  @PrimaryKey()
  id?: number

  @Property()
  cuit!: number;

  @Property()
  apellidoNombre!: string;

  @Property()
  telefono!: number; 

  @Property()
  email!: string;

  @Property()
  domicilio!: string;

  //@Property()
  //zona!: string;

  @Property()
  disponible:boolean = true;


  @ManyToOne(() => Zona, { nullable: true }) 
  zona?: Rel<Zona>;

  @OneToMany(() => Pedido, (pedido) => pedido.cliente, { cascade: [Cascade.ALL], joinColumn: 'nroPedido', inverseJoinColumn: 'cuit' })
  pedidos = new Collection<Pedido>(this);

  constructor(
    cuit: number,
    apellidoNombre: string,
    telefono: number,
    email: string,
    domicilio: string,
    pedidos: Collection<Pedido>
  ) {
    this.cuit = cuit
    this.apellidoNombre = apellidoNombre;
    this.telefono = telefono;
    this.email = email;
    this.domicilio = domicilio;
    this.pedidos = pedidos
  }
}
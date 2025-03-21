import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade } from '@mikro-orm/core'; // Asegúrate de tener los decoradores correctos
import { Pedido } from './pedido.entity.js';

@Entity()
export class User {
  @PrimaryKey()
  id!: number;

  @Property({ unique: true })
  username!: string;

  @Property()
  password!: string;

  @Property({ default: true })
  isActive: boolean = true;
  
  @OneToMany(() => Pedido, (pedido) => pedido.user, { cascade: [Cascade.ALL], })
  pedidos = new Collection<Pedido>(this);
}




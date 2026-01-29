import { Entity, PrimaryKey, Property, OneToMany, Collection, Cascade, OneToOne, Rel } from '@mikro-orm/core'; // Asegúrate de tener los decoradores correctos
import { Pedido } from './pedido.entity.js';
import { UserRole } from './userrole..js';
import { Cliente } from './cliente.entity.js';

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

  @Property()
  role: UserRole = UserRole.CLIENTE;

  @OneToOne(() => Cliente, { nullable: true })
  cliente?: Rel<Cliente>;
  
  /* @OneToMany(() => Pedido, (pedido) => pedido.user, { cascade: [Cascade.ALL], })
  pedidos = new Collection<Pedido>(this); */
}




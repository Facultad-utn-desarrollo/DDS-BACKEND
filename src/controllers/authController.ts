import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {User} from '../models/user.entity.js';
import { orm } from '../shared/db/orm.js';
import { EntityManager } from '@mikro-orm/mysql';
import { Zona } from '../models/zona.entity.js';
import { Cliente } from '../models/cliente.entity.js';
import { UserRole } from '../models/userrole..js';
const em = orm.em;

const register = async (req: any, res: any) => {
  const em = orm.em.fork();

  try {
    const {
      username,
      password,
      cuit,
      apellidoNombre,
      telefono,
      email,
      domicilio,
      zona
    } = req.body;

    const existingUser = await em.findOne(User, { username });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const zonaRef = zona && zona.id ? em.getReference(Zona, zona.id) : undefined;

    const cliente = em.create(Cliente, {
      cuit,
      apellidoNombre,
      telefono,
      email,
      domicilio,
      zona: zonaRef,
      disponible: true,
    });

    const user = em.create(User, {
      username,
      password: hashedPassword,
      isActive: true,
      role: UserRole.CLIENTE,
      cliente,
    });

    await em.persistAndFlush([cliente, user]);

    return res.status(201).json({
      message: 'Usuario y cliente creados correctamente',
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Error al registrar usuario' });
  }
};

async function login(req: any, res: any) { 
  try{ 
  const { username, password } = req.body;

  const user = await orm.em.findOne(User, { username: username });

  console.log(user);

  if (user == null) {
    return res.status(401).json({ message: 'No existe el usuario' });
  }

  
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const secret = process.env.JWT_SECRET || 'fallback_secret';
  
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en el archivo .env");
  }
  
  const token = jwt.sign(
  {
    userId: user.id, 
    role: user.role,
  },
  secret,
  { expiresIn: '1h' }
  );
  


  return res.status(200).json({ token });

  }catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ message: "Error interno del servidor" });
  }
};


const createUser = async (username: string, hashedPassword: string) => {
  const user = new User();
  user.username = username;
  user.password = hashedPassword;

  await em.persistAndFlush(user);

  return user; 
};

export { login, register }
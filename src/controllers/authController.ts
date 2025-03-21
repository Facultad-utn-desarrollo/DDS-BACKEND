import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import {User} from '../models/user.entity.js';
import { orm } from '../shared/db/orm.js';
import { EntityManager } from '@mikro-orm/mysql';
const em = orm.em;


const register = async(req: any, res: any) => {
  try {
      const { username, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = await createUser(username, hashedPassword);
      res.status(201).json({ message: "Usuario registrado", user: newUser });
  } catch (error) {
      res.status(500).json({ error: error });
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

  
  // Verificar si la contraseña es correcta usando await
  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const secret = process.env.JWT_SECRET || 'fallback_secret'; // Evitar error si falta la variable
  const expiration = process.env.JWT_EXPIRATION || "1h";
  
  if (!secret) {
    throw new Error("JWT_SECRET no está definido en el archivo .env");
  }
  
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    secret as string, // Asegurar que TypeScript lo trate como string
    { expiresIn: 3600 }  // 1 hora en segundos
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

  // Guardar el usuario en la base de datos
  await em.persistAndFlush(user);

  return user; // Retorna el objeto User recién creado
};

export { login, register }
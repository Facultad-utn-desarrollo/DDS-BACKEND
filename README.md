# BACKEND Trabajo Práctico de Desarrollo de Software - Supermercado FAST

## 👥 Integrantes

| Legajo | Apellido y Nombres |
|:-------|:-------------------|
| 47048 | Zarate, Exequiel |
| 47094 | Martinez, Bruno |
| 43814 | Aieta, Federico |
| 42775 | Reinoso, Alfredo |

## 🔗 Repositorios

* **Frontend App:** [https://github.com/Facultad-utn-desarrollo/DDS-FRONTEND/tree/stable](https://github.com/Facultad-utn-desarrollo/DDS-FRONTEND/tree/stable)
* **Backend App:** [https://github.com/Facultad-utn-desarrollo/DDS-BACKEND/tree/stable](https://github.com/Facultad-utn-desarrollo/DDS-BACKEND/tree/stable)

---

## 1. Propuesta

### Descripción
La empresa de nuestro trabajo es un supermercado "FAST" que busca desarrollar una plataforma web para que los clientes puedan realizar pedidos de forma online. El sistema administra todo el ciclo de venta, desde la selección de productos hasta la entrega (delivery) y el pago, diferenciando roles entre Clientes y Administradores.

[Hacer click aquí para acceder al modelo, alcances, etc.](https://github.com/BrunoMar99/tp/blob/fc37bd3851383300b3631d4459443cda8e70dfed/proposal.md)

---

## 2. Información de la Aplicación

- **Node.js:** El proyecto requiere Node.js v20 o superior para poder correr el código en el servidor.

- **Framework Web:** Express (v4.21.2) para armar la estructura de la API y manejar las rutas.

- **ORM (Base de datos):** Mikro-ORM (v5.9) apuntando a una Base de Datos MySQL subida en **https://panel.filess.io/**.

- **Lenguaje:** TypeScript (v5.1.3) que le suma tipado estricto a JavaScript para atrapar errores antes de ejecutar el código.

- **Seguridad:** Bcryptjs (v3.0.2) para encriptar contraseñas y JSONWebToken (v9.0.2) para la autenticación.

- **Testing:** Jest (v30.2.0) y Supertest (v7.2.2), usamos el primero para ejecutar las pruebas y el segundo para simular las llamadas a la API sin necesidad de levantar el servidor web.

- **Documentación API:** Swagger (swagger-jsdoc v6.2.8 y swagger-ui-express v5.0.0) como generador de documentación para poder leer y probar los endpoints de la API.

- **Gestor de paquetes:** pnpm (v9.0.4) para instalar todas las dependencias del backend.

---

## 3. Instrucciones de Instalación

Sigue estos pasos para correr el backend en tu entorno local:

### a. Clonar el repositorio
```bash
git clone https://github.com/Facultad-utn-desarrollo/DDS-BACKEND.git
```
```bash
cd DDS-BACKEND
```
### b. Instalar dependencias
```bash
npm install
```
### c. Ejecutar la aplicación

Para entorno de desarrollo:

```bash
npm run start:dev
```
La aplicación estará disponible localmente en http://localhost:3000.

---

## 4. Datos de Prueba (Testing)
Para facilitar la corrección y pruebas de los roles, se proporcionan las siguientes credenciales:

**Rol: CLIENTE**
* **Usuario:** BrunoCliente
* **Contraseña:** BrunoCliente12345

**Rol: ADMINISTRADOR**
* **Usuario:** Bruno123
* **Contraseña:** Bruno123
---

## 5. Documentación de la API y Deploy

El proyecto se encuentra desplegado y funcional en los siguientes enlaces:

* **Frontend (Netlify):** [https://frontfast.netlify.app/](https://frontfast.netlify.app/)

* **Backend (Render):** [https://dds-backend-a.onrender.com/](https://dds-backend-a.onrender.com/)

**Aviso Importante: Debido a las limitaciones del plan gratuito en Render, el servidor entra en modo suspensión por inactividad. La primera petición puede demorar unos 60 segundos en responder mientras el servicio se reactiva.**

**Swagger UI (Documentación Interactiva)**
Hemos implementado Swagger/OpenAPI 3.0 para documentar todos los endpoints. Puedes probar la API directamente desde el navegador:

* **Link directo a Swagger:** [https://dds-backend-a.onrender.com/api-docs](https://dds-backend-a.onrender.com/api-docs)

* **Localmente:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

Para probar la documentación podemos elegir el servidor de desarrollo o el deploy:

<img width="735" height="138" alt="image" src="https://github.com/user-attachments/assets/e99ecea1-f550-405d-82df-3821ec59e55e" />

Luego, desplegamos POST de Autenticación y hacemos click en donde dice "Try it out":

<img width="1810" height="582" alt="image" src="https://github.com/user-attachments/assets/fa084f53-27df-4ded-88d8-995595dc600a" />

Ahí proporcionamos alguna de las credenciales brindadas anteriormente (ya sea admin o cliente) y le damos a "Execute":

<img width="1771" height="530" alt="image" src="https://github.com/user-attachments/assets/c55dbb1d-3705-439a-ab8e-27d6ea62871d" />

Esto nos va a generar un token, el cual debemos copiar:

<img width="1752" height="342" alt="image" src="https://github.com/user-attachments/assets/1f7cbe9a-66c6-4698-a535-911a2e91934c" />

Y pegar aca:

<img width="1821" height="212" alt="image" src="https://github.com/user-attachments/assets/5dbdc699-7f86-4595-b83e-b9974b4161b6" />
<img width="866" height="372" alt="image" src="https://github.com/user-attachments/assets/f51e4caa-0253-4ba8-8b6e-3f7a43af4c4b" />

Una vez listo eso, podremos probar todos los endpoints (teniendo en cuenta que admin solo podrá ver lo que le permita al ser admin, y cliente lo que le corresponda a él).

---

## 6. Playlist de Vistas
(En esta sección se agregarán próximamente los videos demostrativos del flujo de Usuario y Administrador)




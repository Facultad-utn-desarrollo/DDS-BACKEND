# BACKEND Trabajo Práctico de Desarrollo de Software - Supermercado FAST

## Integrantes

| Legajo | Apellido y Nombres |
|:-------|:-------------------|
| 47048 | Zarate, Exequiel |
| 47094 | Martinez, Bruno |
| 43814 | Aieta, Federico |
| 42775 | Reinoso, Alfredo |

## Repositorios

* **Frontend App:** [https://github.com/Facultad-utn-desarrollo/DDS-FRONTEND/tree/stable](https://github.com/Facultad-utn-desarrollo/DDS-FRONTEND/tree/stable)
* **Backend App:** [https://github.com/Facultad-utn-desarrollo/DDS-BACKEND/tree/stable](https://github.com/Facultad-utn-desarrollo/DDS-BACKEND/tree/stable)

---

## 1. Propuesta

### Descripción
La empresa de nuestro trabajo es un supermercado "FAST" que busca desarrollar una plataforma web para que los clientes puedan realizar pedidos de forma online. El sistema administra todo el ciclo de venta, desde la selección de productos hasta la entrega (delivery) y el pago, diferenciando roles entre Clientes y Administradores.

- Proposal: [Hacer click aquí](https://github.com/BrunoMar99/tp/blob/fc37bd3851383300b3631d4459443cda8e70dfed/proposal.md)
- Trello: [Hacer click aquí](https://trello.com/invite/b/6620503434dd05d365b99496/ATTI867d255b6b2db2c7a96e0ef11a6976e6055451AE/trabajo-practico)
- Toda la conversacion/organizacion fue a traves de Discord

---

## 2. Información de la Aplicación

- **Node.js:** El proyecto requiere Node.js v20 o superior para ejecutar el servidor backend y las herramientas de desarrollo del frontend.

- **Framework:** Express (v4.21.2) para armar la estructura de la API y manejar las rutas.

- **ORM (Base de datos):** Mikro-ORM (v5.9) apuntando a una Base de Datos MySQL subida en **https://panel.filess.io/**.

- **Lenguaje:** TypeScript (v5.1.3) que le suma tipado estricto a JavaScript para atrapar errores antes de ejecutar el código.

- **Seguridad:** Bcryptjs (v3.0.2) para encriptar contraseñas y JSONWebToken (v9.0.2) para la autenticación.

- **Testing:** Jest (v30.2.0) y Supertest (v7.2.2), usamos el primero para ejecutar las pruebas y el segundo para simular las llamadas a la API sin necesidad de levantar el servidor web.

- **Documentación API:** Swagger (swagger-jsdoc v6.2.8 y swagger-ui-express v5.0.0) como generador de documentación para poder leer y probar los endpoints de la API.

- **Gestor de paquetes:** npm (v11.6.2) para instalar todas las dependencias del backend.

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

## 6. Testing 
El proyecto cuenta con unos test de componentes automatizados desarrollados con Jest y Supertest. 
Los mismos se pueden encontrar en **\test**

### Automatizado por componentes

- **productoUnitario.test.ts:** Verifica la lógica de negocio aislada dentro de las funciones del controlador, específicamente la función add de productoController. A diferencia del test de integración, este no levanta el servidor ni simula peticiones HTTP. En su lugar, simula ("mockea") directamente los objetos req y res de Express junto con la base de datos, validando que el código interno de la función asigne correctamente un estado 201 ante un caso de éxito, o que atrape las excepciones.
- **clienteUnitario.test.ts:** Evalúa las funciones add y remove del controlador de clientes en total aislamiento. Comprueba el manejo de relaciones de base de datos (como devolver un error 404 si la zona asignada no existe) y confirma el correcto funcionamiento del borrado lógico, asegurando que el sistema cambie la disponibilidad del cliente a false en lugar de eliminar el registro. 
- **repartidorUnitario.test.ts:** Testea la lógica aislada del controlador de repartidores, enfocándose en las validaciones estrictas de datos (como emitir un error 400 Bad Request si el usuario omite enviar la zona obligatoria durante la creación) y validando también la desactivación exitosa del repartidor manteniendo la integridad de los datos.

### De integración

- **producto.test.ts:** Valida qe se muestre el loguin, la interacción con los campos de entrada y la lógica de cambio entre los formularios de ingreso y registro del mismo.

### Pre-requisitos para ejecutarlos
Asegúrese de estar posicionado en la terminal dentro de la carpeta raíz del Backend

1. Abrir una nueva consola y escribir para instalar las librerías de testing (si no se han instalado previamente):
``` bash
npm install --save-dev jest ts-jest supertest @types/jest @types/supertest
```
2. Asegúrese de que en su archivo package.json el script de test esté configurado para soportar módulos modernos (ESM). Debe tener esta línea en la sección "scripts":
``` bash
"test": "node --experimental-vm-modules node_modules/jest/bin/jest.js"
```
3. Una vez verificado lo anterior, ejecutar:
``` bash
npm test
```
4. Finalmente en la terminal podrás visualizar el resultado de los mismos.

---

## 7. Playlist de Vistas
En esta seccion brindaremos el link a la playlist de videos mostrando la aplicación y el manejo de los roles.

[Hacer click aquí](https://youtube.com/playlist?list=PLfm1QmpcGZxFqjhD5qURIUcmYd2H9kl27&si=gglMzCbjGbAkKWve)




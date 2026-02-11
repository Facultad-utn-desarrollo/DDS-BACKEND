# Trabajo Práctico de Desarrollo de Software - Supermercado FAST

## 👥 Integrantes

| Legajo | Apellido y Nombres |
|:-------|:-------------------|
| 47048 | Zarate, Exequiel |
| 47094 | Martinez, Bruno |
| 43814 | Aieta, Federico |
| 42775 | Reinoso, Alfredo |

## 🔗 Repositorios

* **Frontend App:** [https://github.com/exe72418/DDS-FRONTEND](https://github.com/exe72418/DDS-FRONTEND)
* **Backend App:** [https://github.com/exe72418/DDS-BACKEND](https://github.com/exe72418/DDS-BACKEND)

---

## 1. Tema

### Descripción
La empresa de nuestro trabajo es un supermercado "FAST" que busca desarrollar una plataforma web para que los clientes puedan realizar pedidos de forma online. El sistema administra todo el ciclo de venta, desde la selección de productos hasta la entrega (delivery) y el pago, diferenciando roles entre Clientes y Administradores.

### Modelo de Datos
<img width="786" height="796" alt="Modelo de Datos FAST" src="https://github.com/user-attachments/assets/fd3ec264-7213-4490-970a-59be6bc4b3a3" />

---

## 2. Alcance Funcional

### 🟢 Alcance Mínimo (Regularidad)

| Req | Detalle |
|:----|:--------|
| **CRUD Simple** | 1. TipoProducto<br>2. Cliente<br>3. Repartidor<br>4. Producto |
| **CRUD Dependiente** | 1. Pedido<br>2. Entrega |
| **Listado + Detalle** | 1. Listado de productos filtrado por tipo, nombre y precio<br>2. Listado de pedidos filtrado por rango de fecha y nro de pedido |
| **CUU / Epic** | 1. Dar de alta Cliente<br>2. Realizar un pedido<br>3. Generar entregas |

### 🟡 Adicionales para Aprobación

| Req | Detalle |
|:----|:--------|
| **CRUD** | 1. Pago<br>2. Precio<br>3. LineaProducto<br>4. TipoPago |
| **CUU / Epic** | 1. Modificar Pedido<br>2. Dar de baja productos<br>3. Modificar productos |

### 🔵 Alcance Adicional Voluntario

| Req | Detalle |
|:----|:--------|
| **Listados** | 1. Listado de entregas filtrado por rango de fecha y por cliente |
| **CUU / Epic** | 1. Dar de baja pedido<br>2. Dar de baja cliente |

---

## 3. Instrucciones de Instalación

Sigue estos pasos para correr el backend en tu entorno local:

### a. Clonar el repositorio
```bash
git clone https://github.com/exe72418/DDS-BACKEND.git
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

## 4. Documentación de la API y Deploy

El proyecto se encuentra desplegado y funcional en los siguientes enlaces:

* **Frontend (Netlify):** [https://frontfast.netlify.app/](https://frontfast.netlify.app/)

* **Backend (Render):** [https://dds-backend-a.onrender.com/](https://dds-backend-a.onrender.com/)

⚠️ Aviso Importante: Debido a las limitaciones del plan gratuito en Render, el servidor entra en modo suspensión por inactividad. La primera petición puede demorar unos 60 segundos en responder mientras el servicio se reactiva.

**Swagger UI (Documentación Interactiva)**
Hemos implementado Swagger/OpenAPI 3.0 para documentar todos los endpoints. Puedes probar la API directamente desde el navegador:

* **Link directo a Swagger:** [https://dds-backend-a.onrender.com/api-docs](https://dds-backend-a.onrender.com/api-docs)

* **Localmente:** [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

---

## 5. Datos de Prueba (Testing)
Para facilitar la corrección y pruebas de los roles, se proporcionan las siguientes credenciales:

**Rol: CLIENTE**
* **Usuario:** BrunoCliente
* **Contraseña:** BrunoCliente12345

**Rol: ADMINISTRADOR**
* **Usuario:** Bruno123
* **Contraseña:** Bruno123
---

## 6. Playlist de Vistas
(En esta sección se agregarán próximamente los videos demostrativos del flujo de Usuario y Administrador)




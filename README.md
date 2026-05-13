# FERREMAS Frontend

Frontend desarrollado para la Evaluación 2 del ramo **Integración de Plataformas (ASY5131)**.

Este proyecto corresponde a la interfaz web del sistema de comercio electrónico **FERREMAS**, conectada con el backend desarrollado en Spring Boot mediante API REST.

---

## Integrantes

- Fernando Ronda
- Benjamín Lackington
- Vicente Soto

---

## Contexto del proyecto

FERREMAS requiere una solución web que permita modernizar su proceso de ventas, incorporando catálogo de productos, carrito de compras, gestión de pedidos, inicio de sesión por roles y comunicación con una API backend.

Este frontend consume los servicios REST del backend FERREMAS para mostrar productos, crear pedidos, simular pagos y gestionar el flujo operativo según los roles del sistema.

---

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- CSS
- Fetch API
- LocalStorage
- Visual Studio Code

---

## Arquitectura del frontend

El proyecto está organizado por componentes, páginas y servicios:

```text
src
│
├── components
│   ├── Navbar.jsx
│   └── ProductoCard.jsx
│
├── pages
│   ├── Catalogo.jsx
│   ├── Carrito.jsx
│   ├── Login.jsx
│   ├── Pedidos.jsx
│   ├── PanelVendedor.jsx
│   ├── PanelBodeguero.jsx
│   ├── PanelContador.jsx
│   └── PanelAdmin.jsx
│
├── services
│   └── api.js
│
├── App.jsx
├── main.jsx
└── styles.css
```

---

## Requisitos previos

Antes de ejecutar el frontend, se debe tener instalado:

- Node.js
- npm
- Visual Studio Code

También debe estar ejecutándose el backend de FERREMAS en:

```text
http://localhost:8080
```

---

## Instalación del proyecto

### 1. Clonar el repositorio

```bash
git clone URL_DEL_REPOSITORIO_FRONTEND
```

### 2. Entrar a la carpeta del frontend

```bash
cd ferremas-frontend
```

### 3. Instalar dependencias

```bash
npm install
```

### 4. Ejecutar el frontend

```bash
npm run dev
```

El frontend se levantará normalmente en:

```text
http://localhost:5173
```

---

## Conexión con el backend

El archivo encargado de consumir la API es:

```text
src/services/api.js
```

Actualmente el frontend consume el backend desde:

```javascript
const API_URL = "http://localhost:8080";
```

Por lo tanto, antes de usar el frontend, el backend debe estar activo en el puerto `8080`.

---

## Usuarios demo

Los usuarios demo se cargan desde el backend mediante `DataLoader`.

| Rol | Email | Contraseña |
|---|---|---|
| Cliente | cliente@ferremas.cl | 1234 |
| Vendedor | vendedor@ferremas.cl | 1234 |
| Bodeguero | bodeguero@ferremas.cl | 1234 |
| Contador | contador@ferremas.cl | 1234 |
| Administrador | admin@ferremas.cl | 1234 |

---

## Funcionalidades implementadas

### Cliente

- Inicio de sesión.
- Visualización del catálogo de productos.
- Agregar productos al carrito.
- Seleccionar tipo de entrega: retiro o despacho.
- Ingresar dirección para despacho.
- Crear pedido.
- Procesar pago simulado.
- Ver seguimiento del pedido.

### Vendedor

- Visualizar pedidos.
- Aprobar pedidos pagados.
- Rechazar pedidos.

### Bodeguero

- Visualizar pedidos aprobados.
- Marcar pedidos como en preparación.
- Marcar pedidos como listos para despacho.

### Contador

- Visualizar pedidos pagados y despachados.
- Registrar entrega final del pedido.
- Ver resumen financiero básico.

### Administrador

- Visualizar métricas generales.
- Ver productos registrados.
- Crear nuevos productos.
- Eliminar productos sin pedidos asociados.
- Acceder a paneles operativos.

---

## Flujo principal de la aplicación

```text
Login
→ Catálogo
→ Carrito
→ Crear pedido
→ Pagar pedido
→ Panel vendedor aprueba
→ Panel bodeguero prepara
→ Panel contador registra entrega
```

---

## Endpoints consumidos

El frontend consume principalmente los siguientes endpoints del backend:

### Usuarios

```http
POST /usuarios/login
```

### Productos

```http
GET /api/productos
GET /productos
POST /productos
DELETE /productos/{id}
```

### Pedidos

```http
POST /pedidos
GET /pedidos
GET /pedidos/{id}
PUT /pedidos/pagar
PUT /pedidos/{id}/aprobar
PUT /pedidos/{id}/rechazar
PUT /pedidos/{id}/preparar
PUT /pedidos/{id}/listo-despacho
PUT /pedidos/{id}/despachar
```

---

## Medio de pago

Actualmente el sistema utiliza un pago simulado conectado al backend mediante `WebpayService`.

La integración real con Webpay queda pendiente para una etapa posterior del desarrollo grupal.

---

## Repositorios del proyecto

Según lo solicitado para la evaluación, el sistema se divide en dos repositorios:

```text
ferremas-backend  -> API REST desarrollada con Spring Boot
ferremas-frontend -> Interfaz web desarrollada con React
```

Este repositorio corresponde al frontend de la solución.

---

## Estado actual del proyecto

El frontend se encuentra funcionalmente integrado con el backend.

Pendientes principales:

- Integración real con Webpay u otro medio de pago.
- Mejoras visuales finales.
- Revisión grupal.
- Preparación de demo para presentación.

---

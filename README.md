# FERREMAS Frontend

Frontend desarrollado para el proyecto **FERREMAS**, correspondiente a la evaluación de Integración de Plataformas.

La aplicación permite visualizar productos, iniciar sesión por roles, crear pedidos, pagar, revisar el estado de compra y gestionar el flujo operacional desde distintos paneles.

---

## Descripción del proyecto

FERREMAS es una empresa distribuidora de productos de ferretería y construcción que requiere una plataforma web de comercio electrónico.

Este frontend permite simular la experiencia completa de un sistema e-commerce conectado a un backend Spring Boot.

El sistema permite:

- Visualizar catálogo de productos.
- Mostrar imágenes de productos.
- Mostrar logo institucional de FERREMAS.
- Iniciar sesión según rol.
- Agregar productos al carrito.
- Crear pedidos asociados al cliente.
- Aplicar descuento al cliente.
- Seleccionar retiro o despacho.
- Pagar por transferencia o Webpay (Transbank).
- Ver seguimiento del pedido.
- Gestionar pedidos desde paneles internos.
- Registrar suscripciones.
- Mostrar precios en pesos y referencia aproximada en dólares.

---

## Tecnologías utilizadas

- React
- Vite
- JavaScript
- CSS
- Fetch API
- LocalStorage
- Git y GitHub
- Backend Spring Boot
- Webpay Plus de Transbank
- API Banco Central de Chile

---

## Estructura general del proyecto

```text
src
├── assets
│   ├── logo
│   │   └── logo.jpg
│   └── productos
│       ├── taladro.jpg
│       ├── martillo.jpg
│       ├── pintura.jpg
│       └── sierra.jpg
├── components
│   ├── Navbar.jsx
│   └── ProductoCard.jsx
├── data
│   └── imagenesProductos.js
├── pages
│   ├── Home.jsx
│   ├── Catalogo.jsx
│   ├── Login.jsx
│   ├── Carrito.jsx
│   ├── Pedidos.jsx
│   ├── Suscripcion.jsx
│   ├── PanelVendedor.jsx
│   ├── PanelBodeguero.jsx
│   ├── PanelContador.jsx
│   └── PanelAdmin.jsx
├── services
│   └── api.js
├── App.jsx
└── styles.css
```

---

## Funcionalidades principales

### Página de inicio

La página principal presenta el sistema FERREMAS con opciones para:

- Ver catálogo.
- Ir a suscripción.
- Iniciar sesión.
- Acceder a una experiencia visual más cercana a un e-commerce.

---

### Catálogo de productos

El catálogo consume productos desde el backend mediante API REST.

Cada producto muestra:

- Imagen.
- Marca.
- Nombre.
- Descripción.
- Precio en pesos chilenos.
- Precio aproximado en dólares.
- Stock.
- Botón para agregar al carrito.

Las imágenes se relacionan con el código del producto mediante el archivo:

```text
src/data/imagenesProductos.js
```

Relación actual:

```text
FER-12345 → taladro.jpg
FER-23456 → martillo.jpg
FER-34567 → pintura.jpg
FER-45678 → sierra.jpg
```

---

### Login por roles

El frontend permite iniciar sesión con usuarios demo entregados por el backend.

| Rol | Email | Contraseña |
|---|---|---|
| Cliente | cliente@ferremas.cl | 1234 |
| Vendedor | vendedor@ferremas.cl | 1234 |
| Bodeguero | bodeguero@ferremas.cl | 1234 |
| Contador | contador@ferremas.cl | 1234 |
| Administrador | admin@ferremas.cl | 1234 |

Según el rol, se habilitan distintas secciones en el menú.

---

## Roles del sistema

### Cliente

Puede:

- Ver catálogo.
- Agregar productos al carrito.
- Crear pedidos.
- Seleccionar retiro o despacho.
- Pagar por transferencia o Webpay (Transbank).
- Ver seguimiento del pedido.
- Recibir descuento visual del 10%.

---

### Vendedor

Puede:

- Ver pedidos.
- Revisar cliente asociado.
- Revisar producto, cantidad, total y método de pago.
- Aprobar pedidos pagados.
- Rechazar pedidos cuando corresponda.

---

### Bodeguero

Puede:

- Ver pedidos aprobados.
- Revisar cliente asociado.
- Preparar pedidos.
- Marcar pedidos como listos para despacho.

---

### Contador

Puede:

- Revisar pedidos pagados y listos.
- Ver información del cliente.
- Revisar total de ventas.
- Registrar entrega final.
- Consultar resumen financiero básico.

---

### Administrador

Puede acceder a los paneles internos y gestionar información general del sistema.

---

## Carrito de compras

El carrito permite:

- Ver productos seleccionados.
- Modificar cantidad.
- Eliminar productos.
- Vaciar carrito.
- Calcular subtotal.
- Aplicar descuento de cliente.
- Calcular total final.
- Seleccionar tipo de entrega:
  - Retiro en tienda.
  - Despacho a domicilio.

Actualmente el pedido se genera con el primer producto del carrito. La integración multiproducto queda definida como mejora futura.

---

## Pedidos

La vista de pedidos permite:

- Ver el pedido actual.
- Revisar producto, cantidad, entrega, dirección y total.
- Ver descuento aplicado.
- Seleccionar método de pago.
- Pagar con Webpay (redirige al portal oficial de Transbank).
- Confirmar transferencia bancaria.

---

## Integración con Webpay (Transbank)

El frontend se conecta al backend para crear una transacción de pago.

Flujo general:

```text
Cliente crea pedido
        ↓
Frontend solicita la transacción al backend
        ↓
Backend crea la transacción con Webpay Plus (Transbank)
        ↓
Frontend redirige al portal oficial de Webpay (POST con token)
        ↓
Cliente paga con tarjeta de prueba oficial
        ↓
Transbank vuelve a FERREMAS y el backend confirma (commit)
```

Endpoint utilizado:

```http
POST /api/pagos/webpay/crear
GET/POST /api/pagos/webpay/retorno
```

---

## Transferencia bancaria

El sistema también permite seleccionar transferencia bancaria.

Cuando el cliente selecciona este método, se muestran datos bancarios simulados de FERREMAS y se permite confirmar el pago.

---

## Suscripciones

La vista de suscripción permite registrar correos para recibir ofertas y descuentos.

El formulario se conecta al backend mediante:

```http
POST /api/suscripciones
```

El sistema muestra mensaje de éxito cuando el correo queda registrado.

---

## Consumo de API

El frontend centraliza las llamadas al backend en:

```text
src/services/api.js
```

Principales funciones:

- `loginUsuario`
- `obtenerProductos`
- `crearPedido`
- `pagarPedido`
- `obtenerPedidos`
- `aprobarPedido`
- `rechazarPedido`
- `prepararPedido`
- `marcarListoDespacho`
- `despacharPedido`
- `obtenerValorDolar`
- `crearTransaccionWebpay`
- `registrarSuscripcion`

---

## Variable de entorno del frontend

Para entorno local o producción, la URL del backend se puede manejar mediante:

```env
VITE_API_URL=http://localhost:8080
```

En `api.js` se recomienda utilizar:

```javascript
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
```

Esto permite cambiar la URL cuando el backend esté desplegado en Render, Railway u otro servicio.

---

## Cómo ejecutar el frontend

Desde PowerShell:

```powershell
cd C:\Users\Moonlab\OneDrive\Escritorio\Ferremas-Frontend
npm.cmd install
npm.cmd run dev
```

La aplicación queda disponible en:

```text
http://localhost:5173
```

---

## Backend requerido

Para funcionar correctamente, el frontend necesita que el backend esté ejecutándose en:

```text
http://localhost:8080
```

O bien configurar la variable:

```env
VITE_API_URL=https://url-del-backend-en-produccion
```

---

## Flujo completo de prueba

Para demostrar el sistema completo:

```text
1. Iniciar sesión como cliente.
2. Agregar producto al carrito.
3. Crear pedido.
4. Pagar por transferencia o Webpay (Transbank).
5. Iniciar sesión como vendedor.
6. Aprobar pedido pagado.
7. Iniciar sesión como bodeguero.
8. Preparar pedido.
9. Marcar pedido como listo para despacho.
10. Iniciar sesión como contador.
11. Registrar entrega final.
```

---

## Evidencias recomendadas para presentación

- Página de inicio con logo FERREMAS.
- Catálogo con imágenes de productos.
- Login con usuario cliente.
- Carrito con descuento.
- Creación de pedido.
- Pantalla de pago.
- Redirección al portal oficial de Webpay.
- Panel de vendedor mostrando cliente asociado.
- Panel de bodeguero mostrando preparación.
- Panel de contador mostrando entrega final.
- Suscripción registrada correctamente.
- Precio de productos con conversión aproximada a dólar.

---

## Mejoras futuras

- Implementar autenticación con JWT.
- Mantener sesión con token seguro.
- Agregar rutas protegidas.
- Mejorar diseño responsive para celulares.
- Implementar pedidos con múltiples productos.
- Agregar historial de pedidos por cliente.
- Agregar filtros avanzados por categoría, marca y precio.
- Agregar buscador de productos.
- Implementar confirmación automática de pago mediante webhook.
- Agregar pruebas unitarias con React Testing Library.
- Agregar pruebas end-to-end con Cypress o Playwright.
- Mejorar validaciones visuales de formularios.
- Crear panel de administración más completo.
- Desplegar frontend en Vercel o Netlify.

---

## Autor

Proyecto desarrollado por:

**Vicente Soto**  
**Fernando Ronda**  
**Benjamin Lackington**  

Ingeniería en Informática  
Duoc UC

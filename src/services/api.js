const API_URL = "http://localhost:8080";

// Helper: extrae el mensaje real del backend (Spring devuelve { message: "..." })
// y cae al mensaje genérico si no hay JSON parseable.
async function manejarRespuesta(response, mensajeGenerico) {
  if (response.ok) {
    return await response.json();
  }

  let mensajeBackend = null;

  try {
    const data = await response.json();
    mensajeBackend = data?.message || data?.error || null;
  } catch {
    mensajeBackend = null;
  }

  throw new Error(mensajeBackend || mensajeGenerico);
}

export async function loginUsuario(email, password) {
  const response = await fetch(`${API_URL}/usuarios/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  return await manejarRespuesta(response, "Credenciales incorrectas");
}

export async function obtenerProductos() {
  const response = await fetch(`${API_URL}/api/productos`);
  return await manejarRespuesta(response, "Error al obtener productos");
}

export async function obtenerProductosAdmin() {
  const response = await fetch(`${API_URL}/productos`);
  return await manejarRespuesta(response, "Error al obtener productos");
}

export async function crearProducto(producto) {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(producto),
  });

  return await manejarRespuesta(response, "Error al crear producto");
}

export async function eliminarProducto(id) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    let mensajeBackend = null;
    try {
      const data = await response.json();
      mensajeBackend = data?.message || null;
    } catch {
      mensajeBackend = null;
    }
    throw new Error(mensajeBackend || "Error al eliminar producto");
  }

  return true;
}

export async function crearPedido(pedido) {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido),
  });

  return await manejarRespuesta(response, "Error al crear pedido");
}

export async function pagarPedido(pago) {
  const response = await fetch(`${API_URL}/pedidos/pagar`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pago),
  });

  return await manejarRespuesta(response, "Error al procesar pago");
}

export async function obtenerPedidoPorId(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}`);
  return await manejarRespuesta(response, "Error al obtener pedido");
}

export async function obtenerPedidos() {
  const response = await fetch(`${API_URL}/pedidos`);
  return await manejarRespuesta(response, "Error al obtener pedidos");
}

export async function confirmarPagoTransferencia(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/confirmar-pago`, {
    method: "PUT",
  });

  return await manejarRespuesta(response, "Error al confirmar la transferencia");
}

export async function aprobarPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/aprobar`, {
    method: "PUT",
  });

  return await manejarRespuesta(response, "Error al aprobar pedido");
}

export async function rechazarPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/rechazar`, {
    method: "PUT",
  });

  return await manejarRespuesta(response, "Error al rechazar pedido");
}

export async function prepararPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/preparar`, {
    method: "PUT",
  });

  return await manejarRespuesta(response, "Error al preparar pedido");
}

export async function marcarListoDespacho(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/listo-despacho`, {
    method: "PUT",
  });

  return await manejarRespuesta(
    response,
    "Error al marcar pedido como listo para despacho"
  );
}

export async function despacharPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/despachar`, {
    method: "PUT",
  });

  return await manejarRespuesta(
    response,
    "Error al registrar despacho del pedido"
  );
}

export async function obtenerValorDolar() {
  const response = await fetch(`${API_URL}/api/divisas/dolar`);
  return await manejarRespuesta(response, "Error al obtener valor del dólar");
}

export async function registrarSuscripcion(email) {
  const response = await fetch(`${API_URL}/api/suscripciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  return await manejarRespuesta(response, "Error al registrar la suscripción");
}

export async function crearTransaccionWebpay(datos) {
  const response = await fetch(`${API_URL}/api/pagos/webpay/crear`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  return await manejarRespuesta(response, "Error al iniciar el pago con Webpay");
}

export async function registrarUsuario(usuario) {
  const response = await fetch(`${API_URL}/usuarios/registro`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(usuario),
  });

  return await manejarRespuesta(response, "Error al registrar usuario");
}

export async function enviarContacto(contacto) {
  const response = await fetch(`${API_URL}/api/contacto`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(contacto),
  });

  return await manejarRespuesta(response, "Error al enviar el mensaje de contacto");
}

export async function listarContactos() {
  const response = await fetch(`${API_URL}/api/contacto`);
  return await manejarRespuesta(response, "Error al obtener mensajes de contacto");
}

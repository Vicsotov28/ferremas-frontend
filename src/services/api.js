const API_URL = "http://localhost:8080";

export async function loginUsuario(email, password) {
  const response = await fetch(
    `${API_URL}/usuarios/login?email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`,
    {
      method: "POST",
    }
  );

  if (!response.ok) {
    throw new Error("Credenciales incorrectas");
  }

  return await response.json();
}

export async function obtenerProductos() {
  const response = await fetch(`${API_URL}/api/productos`);

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return await response.json();
}

export async function obtenerProductosAdmin() {
  const response = await fetch(`${API_URL}/productos`);

  if (!response.ok) {
    throw new Error("Error al obtener productos");
  }

  return await response.json();
}

export async function crearProducto(producto) {
  const response = await fetch(`${API_URL}/productos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(producto),
  });

  if (!response.ok) {
    throw new Error("Error al crear producto");
  }

  return await response.json();
}

export async function eliminarProducto(id) {
  const response = await fetch(`${API_URL}/productos/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Error al eliminar producto");
  }

  return true;
}

export async function crearPedido(pedido) {
  const response = await fetch(`${API_URL}/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pedido),
  });

  if (!response.ok) {
    throw new Error("Error al crear pedido");
  }

  return await response.json();
}

export async function pagarPedido(pago) {
  const response = await fetch(`${API_URL}/pedidos/pagar`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(pago),
  });

  if (!response.ok) {
    throw new Error("Error al procesar pago");
  }

  return await response.json();
}

export async function obtenerPedidoPorId(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}`);

  if (!response.ok) {
    throw new Error("Error al obtener pedido");
  }

  return await response.json();
}

export async function obtenerPedidos() {
  const response = await fetch(`${API_URL}/pedidos`);

  if (!response.ok) {
    throw new Error("Error al obtener pedidos");
  }

  return await response.json();
}

export async function aprobarPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/aprobar`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Error al aprobar pedido");
  }

  return await response.json();
}

export async function rechazarPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/rechazar`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Error al rechazar pedido");
  }

  return await response.json();
}

export async function prepararPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/preparar`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Error al preparar pedido");
  }

  return await response.json();
}

export async function marcarListoDespacho(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/listo-despacho`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Error al marcar pedido como listo para despacho");
  }

  return await response.json();
}

export async function despacharPedido(id) {
  const response = await fetch(`${API_URL}/pedidos/${id}/despachar`, {
    method: "PUT",
  });

  if (!response.ok) {
    throw new Error("Error al registrar despacho del pedido");
  }

  return await response.json();
}

export async function obtenerValorDolar() {
  const response = await fetch(`${API_URL}/api/divisas/dolar`);

  if (!response.ok) {
    throw new Error("Error al obtener valor del dólar");
  }

  return await response.json();
}

export async function crearPreferenciaMercadoPago(preferencia) {
  const response = await fetch(`${API_URL}/api/pagos/mercadopago/preferencia`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(preferencia),
  });

  if (!response.ok) {
    throw new Error("Error al crear preferencia de Mercado Pago");
  }

  return await response.json();
}

export async function registrarSuscripcion(email) {
  const response = await fetch(`${API_URL}/api/suscripciones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(
      errorData?.message || "Error al registrar la suscripción"
    );
  }

  return await response.json();
}
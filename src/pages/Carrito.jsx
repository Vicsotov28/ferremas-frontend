import { useState } from "react";
import { crearPedido } from "../services/api";

function Carrito({
  carrito,
  eliminarDelCarrito,
  actualizarCantidad,
  limpiarCarrito,
  cambiarPagina,
  setPedidoActual,
  usuarioActual,
}) {
  const [tipoEntrega, setTipoEntrega] = useState("RETIRO");
  const [direccion, setDireccion] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const total = carrito.reduce(
    (sum, item) => sum + item.precio * item.cantidad,
    0
  );

  const crearPedidoDesdeCarrito = async () => {
    setError("");

    if (!usuarioActual) {
      setError("Debes iniciar sesión antes de crear un pedido.");
      setTimeout(() => cambiarPagina("login"), 900);
      return;
    }

    if (usuarioActual.rol !== "CLIENTE") {
      setError("Solo los usuarios con rol CLIENTE pueden crear pedidos.");
      return;
    }

    if (carrito.length === 0) {
      setError("El carrito está vacío");
      return;
    }

    if (tipoEntrega === "DESPACHO" && direccion.trim() === "") {
      setError("Debe ingresar una dirección para despacho");
      return;
    }

    try {
      setCargando(true);

      const primerProducto = carrito[0];

      const pedido = await crearPedido({
        productoId: primerProducto.id,
        cantidad: primerProducto.cantidad,
        tipoEntrega,
        direccion: tipoEntrega === "DESPACHO" ? direccion : "",
      });

      setPedidoActual(pedido);
      limpiarCarrito();
      cambiarPagina("pedidos");
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">🛒</div>
          <h2>Tu carrito está vacío</h2>
          <p>Agrega productos desde el catálogo para iniciar una compra.</p>
          <button
            className="btn-primary"
            onClick={() => cambiarPagina("catalogo")}
          >
            Ir al catálogo
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="section-title">
        <div>
          <h2>Carrito de compras</h2>
          <p>Revisa los productos seleccionados antes de crear el pedido.</p>
        </div>

        <button className="btn-secondary" onClick={limpiarCarrito}>
          Vaciar carrito
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {!usuarioActual && (
        <div className="info-message">
          Para finalizar la compra debes iniciar sesión como cliente.
        </div>
      )}

      {usuarioActual && usuarioActual.rol !== "CLIENTE" && (
        <div className="warning-message">
          Sesión activa como {usuarioActual.rol}. Solo el rol CLIENTE puede crear
          pedidos desde el carrito.
        </div>
      )}

      <section className="carrito-layout">
        <div className="carrito-lista">
          {carrito.map((item) => (
            <article className="carrito-item" key={item.id}>
              <div className="carrito-icono">🔧</div>

              <div className="carrito-info">
                <p className="producto-marca">{item.marca}</p>
                <h3>{item.nombre}</h3>
                <p>{item.descripcion}</p>
                <span>${item.precio.toLocaleString("es-CL")} c/u</span>
              </div>

              <div className="cantidad-control">
                <button
                  onClick={() =>
                    actualizarCantidad(item.id, item.cantidad - 1)
                  }
                >
                  -
                </button>

                <span>{item.cantidad}</span>

                <button
                  onClick={() =>
                    actualizarCantidad(item.id, item.cantidad + 1)
                  }
                  disabled={item.cantidad >= item.stock}
                >
                  +
                </button>
              </div>

              <div className="carrito-subtotal">
                <strong>
                  ${(item.precio * item.cantidad).toLocaleString("es-CL")}
                </strong>
                <button
                  className="btn-danger"
                  onClick={() => eliminarDelCarrito(item.id)}
                >
                  Eliminar
                </button>
              </div>
            </article>
          ))}
        </div>

        <aside className="resumen-compra">
          <h3>Resumen</h3>

          <div className="resumen-row">
            <span>Productos distintos</span>
            <strong>{carrito.length}</strong>
          </div>

          <div className="resumen-row">
            <span>Total unidades</span>
            <strong>
              {carrito.reduce((sum, item) => sum + item.cantidad, 0)}
            </strong>
          </div>

          <div className="resumen-total">
            <span>Total referencial</span>
            <strong>${total.toLocaleString("es-CL")}</strong>
          </div>

          <div className="checkout-box">
            <label>Tipo de entrega</label>
            <select
              value={tipoEntrega}
              onChange={(e) => setTipoEntrega(e.target.value)}
            >
              <option value="RETIRO">Retiro en tienda</option>
              <option value="DESPACHO">Despacho a domicilio</option>
            </select>

            {tipoEntrega === "DESPACHO" && (
              <>
                <label>Dirección</label>
                <input
                  type="text"
                  placeholder="Ej: Santa Teresa 407"
                  value={direccion}
                  onChange={(e) => setDireccion(e.target.value)}
                />
              </>
            )}
          </div>

          <button
            className="btn-primary full"
            onClick={crearPedidoDesdeCarrito}
            disabled={cargando}
          >
            {cargando ? "Creando pedido..." : "Crear pedido"}
          </button>

          {carrito.length > 1 && (
            <p className="nota-carrito">
              Nota: esta versión genera el pedido con el primer producto del
              carrito. La integración multiproducto puede agregarse en una
              siguiente mejora.
            </p>
          )}
        </aside>
      </section>
    </main>
  );
}

export default Carrito;
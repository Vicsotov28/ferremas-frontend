import { useState } from "react";
import { pagarPedido } from "../services/api";

function Pedidos({ pedidoActual, setPedidoActual, cambiarPagina }) {
  const [metodoPago, setMetodoPago] = useState("TARJETA");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const pagar = async () => {
    if (!pedidoActual) return;

    try {
      setError("");
      setCargando(true);

      const pedidoPagado = await pagarPedido({
        pedidoId: pedidoActual.id,
        metodoPago,
      });

      setPedidoActual(pedidoPagado);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  if (!pedidoActual) {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No hay pedidos activos</h2>
          <p>Crea un pedido desde el carrito para hacer seguimiento.</p>
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
          <h2>Seguimiento de pedidos</h2>
          <p>Estado actual del pedido creado desde el carrito.</p>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <section className="pedido-layout">
        <article className="pedido-card">
          <div className="pedido-header">
            <div>
              <p className="eyebrow-dark">Pedido #{pedidoActual.id}</p>
              <h3>{pedidoActual.producto?.nombre}</h3>
            </div>

            <span className={`estado-badge estado-${pedidoActual.estado}`}>
              {pedidoActual.estado}
            </span>
          </div>

          <div className="pedido-grid">
            <div>
              <span>Producto</span>
              <strong>{pedidoActual.producto?.nombre}</strong>
            </div>

            <div>
              <span>Cantidad</span>
              <strong>{pedidoActual.cantidad}</strong>
            </div>

            <div>
              <span>Total</span>
              <strong>${pedidoActual.total?.toLocaleString("es-CL")}</strong>
            </div>

            <div>
              <span>Entrega</span>
              <strong>{pedidoActual.tipoEntrega}</strong>
            </div>

            <div>
              <span>Dirección</span>
              <strong>{pedidoActual.direccion || "Retiro en tienda"}</strong>
            </div>

            <div>
              <span>Método de pago</span>
              <strong>{pedidoActual.metodoPago}</strong>
            </div>
          </div>
        </article>

        <aside className="resumen-compra">
          <h3>Pago del pedido</h3>

          <div className="checkout-box">
            <label>Método de pago</label>
            <select
              value={metodoPago}
              onChange={(e) => setMetodoPago(e.target.value)}
              disabled={pedidoActual.estado !== "PENDIENTE"}
            >
              <option value="TARJETA">Tarjeta</option>
              <option value="DEBITO">Débito</option>
              <option value="CREDITO">Crédito</option>
              <option value="TRANSFERENCIA">Transferencia</option>
            </select>
          </div>

          <button
            className="btn-primary full"
            onClick={pagar}
            disabled={pedidoActual.estado !== "PENDIENTE" || cargando}
          >
            {pedidoActual.estado === "PENDIENTE"
              ? cargando
                ? "Procesando..."
                : "Pagar pedido"
              : "Pago procesado"}
          </button>

          <p className="nota-carrito">
            El pago se procesa mediante la capa de integración simulada
            WebpayService del backend.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default Pedidos;
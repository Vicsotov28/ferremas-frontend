import { useEffect, useState } from "react";
import {
  confirmarPagoTransferencia,
  despacharPedido,
  obtenerPedidos,
} from "../services/api";

function PanelContador({ usuarioActual, cambiarPagina }) {
  const [pedidos, setPedidos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(true);

  const cargarPedidos = async () => {
    try {
      setCargando(true);
      setError("");
      const data = await obtenerPedidos();
      setPedidos(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarPedidos();
  }, []);

  const manejarDespacho = async (id) => {
    try {
      setError("");
      const pedidoActualizado = await despacharPedido(id);

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((pedido) =>
          pedido.id === id ? pedidoActualizado : pedido
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const manejarConfirmarTransferencia = async (id) => {
    try {
      setError("");
      const pedidoActualizado = await confirmarPagoTransferencia(id);

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((pedido) =>
          pedido.id === id ? pedidoActualizado : pedido
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  if (!usuarioActual) {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">🔐</div>
          <h2>Acceso restringido</h2>
          <p>Debes iniciar sesión para acceder al panel de contador.</p>
          <button className="btn-primary" onClick={() => cambiarPagina("login")}>
            Ir al login
          </button>
        </section>
      </main>
    );
  }

  if (
    usuarioActual.rol !== "CONTADOR" &&
    usuarioActual.rol !== "ADMINISTRADOR"
  ) {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">⛔</div>
          <h2>No tienes permisos</h2>
          <p>
            Esta pantalla es solo para usuarios con rol CONTADOR o
            ADMINISTRADOR.
          </p>
          <button
            className="btn-primary"
            onClick={() => cambiarPagina("catalogo")}
          >
            Volver al catálogo
          </button>
        </section>
      </main>
    );
  }

  const pedidosContables = pedidos.filter(
    (pedido) =>
      pedido.estado === "EN_REVISION_PAGO" ||
      pedido.estado === "PAGADO" ||
      pedido.estado === "APROBADO" ||
      pedido.estado === "EN_PREPARACION" ||
      pedido.estado === "LISTO_DESPACHO" ||
      pedido.estado === "DESPACHADO"
  );

  const pedidosPorConfirmar = pedidos.filter(
    (pedido) => pedido.estado === "EN_REVISION_PAGO"
  ).length;

  const totalVentas = pedidos
    .filter((pedido) => pedido.estado !== "RECHAZADO")
    .reduce((sum, pedido) => sum + (pedido.total || 0), 0);

  const pedidosEntregados = pedidos.filter(
    (pedido) => pedido.estado === "DESPACHADO"
  ).length;

  return (
    <main className="page-container">
      <div className="section-title">
        <div>
          <h2>Panel de contador</h2>
          <p>
            Registro contable de pagos, ventas y entrega final de productos.
          </p>
        </div>

        <button className="btn-secondary" onClick={cargarPedidos}>
          Actualizar
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      <section className="admin-grid" style={{ marginBottom: "24px" }}>
        <article className="admin-card">
          <div className="admin-card-header">
            <div>
              <p className="eyebrow-dark">Resumen financiero</p>
              <h3>Ventas registradas</h3>
            </div>
          </div>

          <div className="admin-info-grid">
            <div>
              <span>Total ventas</span>
              <strong>${totalVentas.toLocaleString("es-CL")}</strong>
            </div>

            <div>
              <span>Pedidos entregados</span>
              <strong>{pedidosEntregados}</strong>
            </div>

            <div>
              <span>Transferencias por confirmar</span>
              <strong>{pedidosPorConfirmar}</strong>
            </div>
          </div>
        </article>
      </section>

      {cargando ? (
        <section className="empty-state">
          <div className="empty-icon">⏳</div>
          <h2>Cargando pedidos</h2>
          <p>Consultando información desde el backend.</p>
        </section>
      ) : pedidosContables.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">📊</div>
          <h2>No hay movimientos contables</h2>
          <p>
            Cuando existan pedidos pagados o listos para despacho, aparecerán en
            este panel.
          </p>
        </section>
      ) : (
        <section className="admin-grid">
          {pedidosContables.map((pedido) => (
            <article className="admin-card" key={pedido.id}>
              <div className="admin-card-header">
                <div>
                  <p className="eyebrow-dark">Pedido #{pedido.id}</p>
                  <h3>{pedido.producto?.nombre || "Producto no disponible"}</h3>
                </div>

                <span className={`estado-badge estado-${pedido.estado}`}>
                  {pedido.estado}
                </span>
              </div>

              <div className="admin-info-grid">
                <div>
                  <span>Cliente</span>
                  <strong>
                    {pedido.usuario?.nombre || "Cliente no registrado"}
                  </strong>
                  <small>{pedido.usuario?.email || "Sin correo registrado"}</small>
                </div>

                <div>
                  <span>Producto</span>
                  <strong>{pedido.producto?.nombre || "Sin producto"}</strong>
                </div>

                <div>
                  <span>Cantidad</span>
                  <strong>{pedido.cantidad}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>${pedido.total?.toLocaleString("es-CL")}</strong>
                </div>

                <div>
                  <span>Método pago</span>
                  <strong>{pedido.metodoPago}</strong>
                </div>

                <div>
                  <span>Entrega</span>
                  <strong>{pedido.tipoEntrega}</strong>
                </div>

                <div>
                  <span>Dirección</span>
                  <strong>{pedido.direccion || "Retiro en tienda"}</strong>
                </div>
              </div>

              <div className="admin-actions">
                <button
                  className="btn-primary"
                  onClick={() => manejarConfirmarTransferencia(pedido.id)}
                  disabled={pedido.estado !== "EN_REVISION_PAGO"}
                >
                  Confirmar transferencia
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => manejarDespacho(pedido.id)}
                  disabled={pedido.estado !== "LISTO_DESPACHO"}
                >
                  Registrar entrega
                </button>
              </div>

              {pedido.estado === "EN_REVISION_PAGO" && (
                <p className="nota-carrito">
                  Cliente declaró transferencia. Verifica en el portal bancario
                  y confirma para liberar el pedido al vendedor.
                </p>
              )}

              {pedido.estado === "LISTO_DESPACHO" && (
                <p className="nota-carrito">
                  Pedido listo para entrega. El contador puede registrar la
                  entrega final del producto.
                </p>
              )}

              {pedido.estado === "DESPACHADO" && (
                <p className="nota-carrito">
                  Entrega registrada correctamente. El flujo del pedido fue
                  finalizado.
                </p>
              )}

              {pedido.estado !== "EN_REVISION_PAGO" &&
                pedido.estado !== "LISTO_DESPACHO" &&
                pedido.estado !== "DESPACHADO" && (
                  <p className="nota-carrito">
                    Este pedido está siendo procesado por otro rol del sistema.
                  </p>
                )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default PanelContador;
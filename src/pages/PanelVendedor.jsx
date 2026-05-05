import { useEffect, useState } from "react";
import { aprobarPedido, obtenerPedidos, rechazarPedido } from "../services/api";

function PanelVendedor({ usuarioActual, cambiarPagina }) {
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

  const manejarAprobar = async (id) => {
    try {
      setError("");
      const pedidoActualizado = await aprobarPedido(id);

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((pedido) =>
          pedido.id === id ? pedidoActualizado : pedido
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const manejarRechazar = async (id) => {
    try {
      setError("");
      const pedidoActualizado = await rechazarPedido(id);

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
          <p>Debes iniciar sesión para acceder al panel de vendedor.</p>
          <button className="btn-primary" onClick={() => cambiarPagina("login")}>
            Ir al login
          </button>
        </section>
      </main>
    );
  }

  if (usuarioActual.rol !== "VENDEDOR" && usuarioActual.rol !== "ADMINISTRADOR") {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">⛔</div>
          <h2>No tienes permisos</h2>
          <p>
            Esta pantalla es solo para usuarios con rol VENDEDOR o ADMINISTRADOR.
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

  return (
    <main className="page-container">
      <div className="section-title">
        <div>
          <h2>Panel de vendedor</h2>
          <p>
            Revisión y gestión de pedidos pagados para aprobar o rechazar la
            solicitud.
          </p>
        </div>

        <button className="btn-secondary" onClick={cargarPedidos}>
          Actualizar
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}

      {cargando ? (
        <section className="empty-state">
          <div className="empty-icon">⏳</div>
          <h2>Cargando pedidos</h2>
          <p>Consultando información desde el backend.</p>
        </section>
      ) : pedidos.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No hay pedidos registrados</h2>
          <p>Cuando los clientes generen pedidos, aparecerán aquí.</p>
        </section>
      ) : (
        <section className="admin-grid">
          {pedidos.map((pedido) => (
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
                  <strong>Cliente FERREMAS</strong>
                </div>

                <div>
                  <span>Producto</span>
                  <strong>{pedido.producto?.nombre}</strong>
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
                  <span>Entrega</span>
                  <strong>{pedido.tipoEntrega}</strong>
                </div>

                <div>
                  <span>Método pago</span>
                  <strong>{pedido.metodoPago}</strong>
                </div>
              </div>

              <div className="admin-actions">
                <button
                  className="btn-primary"
                  onClick={() => manejarAprobar(pedido.id)}
                  disabled={pedido.estado !== "PAGADO"}
                >
                  Aprobar
                </button>

                <button
                  className="btn-danger"
                  onClick={() => manejarRechazar(pedido.id)}
                  disabled={pedido.estado === "DESPACHADO"}
                >
                  Rechazar
                </button>
              </div>

              {pedido.estado !== "PAGADO" && (
                <p className="nota-carrito">
                  Solo los pedidos en estado PAGADO pueden ser aprobados por el
                  vendedor.
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default PanelVendedor;
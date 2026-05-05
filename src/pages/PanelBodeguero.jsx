import { useEffect, useState } from "react";
import {
  marcarListoDespacho,
  obtenerPedidos,
  prepararPedido,
} from "../services/api";

function PanelBodeguero({ usuarioActual, cambiarPagina }) {
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

  const manejarPreparar = async (id) => {
    try {
      setError("");
      const pedidoActualizado = await prepararPedido(id);

      setPedidos((pedidosActuales) =>
        pedidosActuales.map((pedido) =>
          pedido.id === id ? pedidoActualizado : pedido
        )
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const manejarListoDespacho = async (id) => {
    try {
      setError("");
      const pedidoActualizado = await marcarListoDespacho(id);

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
          <p>Debes iniciar sesión para acceder al panel de bodega.</p>
          <button className="btn-primary" onClick={() => cambiarPagina("login")}>
            Ir al login
          </button>
        </section>
      </main>
    );
  }

  if (
    usuarioActual.rol !== "BODEGUERO" &&
    usuarioActual.rol !== "ADMINISTRADOR"
  ) {
    return (
      <main className="page-container">
        <section className="empty-state">
          <div className="empty-icon">⛔</div>
          <h2>No tienes permisos</h2>
          <p>
            Esta pantalla es solo para usuarios con rol BODEGUERO o
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

  const pedidosBodega = pedidos.filter(
    (pedido) =>
      pedido.estado === "APROBADO" ||
      pedido.estado === "EN_PREPARACION" ||
      pedido.estado === "LISTO_DESPACHO"
  );

  return (
    <main className="page-container">
      <div className="section-title">
        <div>
          <h2>Panel de bodeguero</h2>
          <p>
            Preparación de pedidos aprobados y control de productos listos para
            despacho.
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
      ) : pedidosBodega.length === 0 ? (
        <section className="empty-state">
          <div className="empty-icon">📦</div>
          <h2>No hay pedidos para preparar</h2>
          <p>
            Cuando el vendedor apruebe pedidos pagados, aparecerán en este
            panel.
          </p>
        </section>
      ) : (
        <section className="admin-grid">
          {pedidosBodega.map((pedido) => (
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
                  <span>Producto</span>
                  <strong>{pedido.producto?.nombre}</strong>
                </div>

                <div>
                  <span>Cantidad</span>
                  <strong>{pedido.cantidad}</strong>
                </div>

                <div>
                  <span>Entrega</span>
                  <strong>{pedido.tipoEntrega}</strong>
                </div>

                <div>
                  <span>Dirección</span>
                  <strong>{pedido.direccion || "Retiro en tienda"}</strong>
                </div>

                <div>
                  <span>Total</span>
                  <strong>${pedido.total?.toLocaleString("es-CL")}</strong>
                </div>

                <div>
                  <span>Método pago</span>
                  <strong>{pedido.metodoPago}</strong>
                </div>
              </div>

              <div className="admin-actions">
                <button
                  className="btn-primary"
                  onClick={() => manejarPreparar(pedido.id)}
                  disabled={pedido.estado !== "APROBADO"}
                >
                  Preparar pedido
                </button>

                <button
                  className="btn-secondary"
                  onClick={() => manejarListoDespacho(pedido.id)}
                  disabled={pedido.estado !== "EN_PREPARACION"}
                >
                  Marcar listo
                </button>
              </div>

              {pedido.estado === "APROBADO" && (
                <p className="nota-carrito">
                  Pedido aprobado por vendedor. Bodega debe iniciar preparación.
                </p>
              )}

              {pedido.estado === "EN_PREPARACION" && (
                <p className="nota-carrito">
                  Pedido en preparación. Cuando esté completo, márcalo como
                  listo para despacho.
                </p>
              )}

              {pedido.estado === "LISTO_DESPACHO" && (
                <p className="nota-carrito">
                  Pedido listo para despacho o retiro. Debe ser gestionado por
                  vendedor/entrega.
                </p>
              )}
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default PanelBodeguero;
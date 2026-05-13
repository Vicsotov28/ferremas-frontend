import { useState } from "react";
import { crearPreferenciaMercadoPago, pagarPedido } from "../services/api";

function Pedidos({ pedidoActual, setPedidoActual, cambiarPagina }) {
  const [metodoPago, setMetodoPago] = useState("MERCADO_PAGO");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [resultadoPago, setResultadoPago] = useState(null);

  const totalMostrado =
    pedidoActual?.totalConDescuento !== undefined
      ? pedidoActual.totalConDescuento
      : pedidoActual?.total;

  const subtotalMostrado =
    pedidoActual?.subtotalOriginal !== undefined
      ? pedidoActual.subtotalOriginal
      : pedidoActual?.total;

  const descuentoAplicado = pedidoActual?.descuentoAplicado || 0;
  const montoDescuento = pedidoActual?.montoDescuento || 0;

  const pagarConMercadoPago = async () => {
    if (!pedidoActual) return;

    try {
      setError("");
      setResultadoPago(null);
      setCargando(true);

      const respuesta = await crearPreferenciaMercadoPago({
        pedidoId: pedidoActual.id,
        titulo: pedidoActual.producto?.nombre || "Pedido FERREMAS",
        cantidad: pedidoActual.cantidad || 1,
        precioUnitario: Number(totalMostrado || pedidoActual.total),
      });

      const urlPago = respuesta.sandboxInitPoint || respuesta.initPoint;

      if (!urlPago) {
        throw new Error("No se recibió URL de pago desde Mercado Pago");
      }

      window.location.href = urlPago;
    } catch (error) {
      setError(error.message);
      setResultadoPago({
        tipo: "rechazado",
        titulo: "Error al iniciar pago",
        mensaje:
          "No se pudo generar la preferencia de pago en Mercado Pago. Revisa la integración e intenta nuevamente.",
      });
    } finally {
      setCargando(false);
    }
  };

  const confirmarTransferencia = async () => {
    if (!pedidoActual) return;

    try {
      setError("");
      setResultadoPago(null);
      setCargando(true);

      const pedidoPagado = await pagarPedido({
        pedidoId: pedidoActual.id,
        metodoPago: "TRANSFERENCIA",
      });

      const pedidoActualizado = {
        ...pedidoPagado,
        subtotalOriginal: pedidoActual.subtotalOriginal,
        descuentoAplicado: pedidoActual.descuentoAplicado,
        montoDescuento: pedidoActual.montoDescuento,
        totalConDescuento: pedidoActual.totalConDescuento,
      };

      setPedidoActual(pedidoActualizado);

      setResultadoPago({
        tipo: "exito",
        titulo: "Transferencia registrada",
        mensaje:
          "La transferencia fue registrada correctamente. El pedido continuará al flujo de revisión del vendedor.",
      });
    } catch (error) {
      setError(error.message);
      setResultadoPago({
        tipo: "rechazado",
        titulo: "Error en transferencia",
        mensaje:
          "No se pudo registrar la transferencia. Intenta nuevamente o vuelve al catálogo.",
      });
    } finally {
      setCargando(false);
    }
  };

  const procesarPago = () => {
    if (metodoPago === "MERCADO_PAGO") {
      pagarConMercadoPago();
      return;
    }

    if (metodoPago === "TRANSFERENCIA") {
      confirmarTransferencia();
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

      {resultadoPago && (
        <section
          className={
            resultadoPago.tipo === "exito"
              ? "payment-result success"
              : "payment-result rejected"
          }
        >
          <div className="payment-icon">
            {resultadoPago.tipo === "exito" ? "✅" : "❌"}
          </div>

          <div>
            <h3>{resultadoPago.titulo}</h3>
            <p>{resultadoPago.mensaje}</p>

            <div className="payment-actions">
              {resultadoPago.tipo === "exito" ? (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => cambiarPagina("pedidos")}
                  >
                    Ver estado del pedido
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => cambiarPagina("catalogo")}
                  >
                    Volver al catálogo
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn-primary"
                    onClick={() => cambiarPagina("catalogo")}
                  >
                    Volver al catálogo
                  </button>

                  <button
                    className="btn-secondary"
                    onClick={() => cambiarPagina("carrito")}
                  >
                    Ir al carrito
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      )}

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
              <span>Subtotal</span>
              <strong>${subtotalMostrado?.toLocaleString("es-CL")}</strong>
            </div>

            <div>
              <span>Descuento</span>
              <strong>
                {descuentoAplicado}% (-$
                {montoDescuento?.toLocaleString("es-CL")})
              </strong>
            </div>

            <div>
              <span>Total final</span>
              <strong>${totalMostrado?.toLocaleString("es-CL")}</strong>
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
              <strong>{pedidoActual.metodoPago || "NO DEFINIDO"}</strong>
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
              <option value="MERCADO_PAGO">
                Mercado Pago / Tarjeta / Débito / Crédito
              </option>
              <option value="TRANSFERENCIA">Transferencia bancaria</option>
            </select>
          </div>

          {metodoPago === "MERCADO_PAGO" &&
            pedidoActual.estado === "PENDIENTE" && (
              <div className="mercadopago-box">
                <h4>Pago con Mercado Pago</h4>
                <p>
                  Serás redirigido al ambiente seguro de Mercado Pago, donde
                  podrás pagar con tarjeta de crédito, débito u otros medios
                  disponibles.
                </p>

                <div className="transferencia-total">
                  <span>Monto a pagar</span>
                  <strong>${totalMostrado?.toLocaleString("es-CL")}</strong>
                </div>
              </div>
            )}

          {metodoPago === "TRANSFERENCIA" &&
            pedidoActual.estado === "PENDIENTE" && (
              <div className="transferencia-box">
                <h4>Datos para transferencia</h4>

                <div className="transferencia-row">
                  <span>Banco</span>
                  <strong>Banco FERREMAS</strong>
                </div>

                <div className="transferencia-row">
                  <span>Tipo de cuenta</span>
                  <strong>Cuenta corriente</strong>
                </div>

                <div className="transferencia-row">
                  <span>N° de cuenta</span>
                  <strong>123456789</strong>
                </div>

                <div className="transferencia-row">
                  <span>RUT empresa</span>
                  <strong>76.123.456-7</strong>
                </div>

                <div className="transferencia-row">
                  <span>Correo</span>
                  <strong>pagos@ferremas.cl</strong>
                </div>

                <div className="transferencia-row">
                  <span>Asunto</span>
                  <strong>Pedido #{pedidoActual.id}</strong>
                </div>

                <div className="transferencia-total">
                  <span>Monto a transferir</span>
                  <strong>${totalMostrado?.toLocaleString("es-CL")}</strong>
                </div>

                <p>
                  Luego de realizar la transferencia, presiona “Confirmar
                  transferencia” para simular la validación del pago.
                </p>
              </div>
            )}

          <button
            className="btn-primary full"
            onClick={procesarPago}
            disabled={pedidoActual.estado !== "PENDIENTE" || cargando}
          >
            {pedidoActual.estado === "PENDIENTE"
              ? cargando
                ? "Procesando..."
                : metodoPago === "MERCADO_PAGO"
                ? "Pagar con Mercado Pago"
                : "Confirmar transferencia"
              : "Pago procesado"}
          </button>

          <p className="nota-carrito">
            El pago con tarjeta, débito o crédito se realiza mediante Mercado
            Pago Checkout Pro. La transferencia bancaria se mantiene como flujo
            alternativo.
          </p>
        </aside>
      </section>
    </main>
  );
}

export default Pedidos;